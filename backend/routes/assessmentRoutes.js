const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const Lender = require('../models/Lender');
const {
  calculateLrsTaxDetails,
  analyzeFoirDetails,
  checkDocumentHealthDetails
} = require('../utils/phase3Calculators');

// @route   POST /api/assessments/lrs-calculator
// @desc    Calculate LRS Tax (TCS), Forex Markup, SWIFT wire fees & True Out-of-Pocket INR
// @access  Public
router.post('/lrs-calculator', (req, res) => {
  try {
    const {
      totalRemittanceINR,
      fundingSourceLoanINR,
      fundingSourceSavingsINR,
      swiftWireFeeINR,
      forexMarkupPercent
    } = req.body;

    const result = calculateLrsTaxDetails({
      totalRemittanceINR,
      fundingSourceLoanINR,
      fundingSourceSavingsINR,
      swiftWireFeeINR,
      forexMarkupPercent
    });

    return res.status(200).json({
      success: true,
      message: 'LRS TCS and Forex Outflow calculated successfully',
      data: result
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error calculating LRS tax',
      error: err.message
    });
  }
});

// @route   POST /api/assessments/foir-analyzer
// @desc    Analyze Co-applicant FOIR & Debt Stress (Green/Amber/Red bands)
// @access  Public
router.post('/foir-analyzer', (req, res) => {
  try {
    const { annualIncomeINR, monthlyEMIsINR } = req.body;
    const result = analyzeFoirDetails({ annualIncomeINR, monthlyEMIsINR });

    return res.status(200).json({
      success: true,
      message: 'Co-applicant FOIR & Debt Stress analyzed successfully',
      data: result
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error analyzing FOIR debt stress',
      error: err.message
    });
  }
});

// @route   POST /api/assessments/document-health-check
// @desc    Validate 3 Years ITR, CA Net Worth Certificate, UDIN & Document Readiness Score
// @access  Public
router.post('/document-health-check', (req, res) => {
  try {
    const result = checkDocumentHealthDetails(req.body);
    return res.status(200).json({
      success: true,
      message: 'Document health check completed successfully',
      data: result
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error running document health check',
      error: err.message
    });
  }
});

// @route   POST /api/assessments
// @desc    Calculate loan assessment results & match lenders, then save to DB
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      studentName = 'Student',
      cibilScore = 720,
      country,
      university,
      course,
      tuitionFeesINR,
      livingCostPerYearINR,
      durationYears,
      familySavingsINR = 0,
      scholarshipsINR = 0,
      feesPaidINR = 0,
      annualIncomeINR,
      monthlyEMIsINR = 0,
      hasCollateral,
      propertyValueINR = 0,
      // Phase 3 extra fields
      fundingSourceLoanINR,
      fundingSourceSavingsINR,
      swiftWireFeeINR = 2500,
      forexMarkupPercent = 1.5,
      itrDeclaredIncomeINR,
      bankStatementMonthlyCreditINR,
      caCertificatePresent = true,
      udinNumber = '24123456AAAAAA1234',
      hasPropertyDeedBreakdown = true,
      uploadedDocuments = []
    } = req.body;

    // Basic Input Validation
    if (!country || !university || !course) {
      return res.status(400).json({
        success: false,
        message: 'Country, University, and Course are required fields.'
      });
    }

    const tuition = Number(tuitionFeesINR) || 0;
    const livingCost = Number(livingCostPerYearINR) || 0;
    const duration = Number(durationYears) || 1;
    const familySavings = Number(familySavingsINR) || 0;
    const scholarships = Number(scholarshipsINR) || 0;
    const feesPaid = Number(feesPaidINR) || 0;
    const annualIncome = Number(annualIncomeINR) || 0;
    const monthlyEMIs = Number(monthlyEMIsINR) || 0;
    const propValue = Number(propertyValueINR) || 0;
    const userHasCollateral = Boolean(hasCollateral);
    const userCibil = Number(cibilScore) || 720;

    // 1. Core Calculations
    const totalStudyCostINR = (tuition * duration) + (livingCost * duration);
    const existingFunding = familySavings + scholarships + feesPaid;
    const totalFundingGapINR = Math.max(0, totalStudyCostINR - existingFunding);

    // Phase 3: Feature 1 - LRS Tax Calculation
    const loanRemittance = fundingSourceLoanINR !== undefined ? Number(fundingSourceLoanINR) : totalFundingGapINR;
    const savingsRemittance = fundingSourceSavingsINR !== undefined ? Number(fundingSourceSavingsINR) : 0;

    const lrsBreakdown = calculateLrsTaxDetails({
      totalRemittanceINR: totalFundingGapINR,
      fundingSourceLoanINR: loanRemittance,
      fundingSourceSavingsINR: savingsRemittance,
      swiftWireFeeINR,
      forexMarkupPercent
    });

    // Phase 3: Feature 2 - FOIR Debt Stress Analysis
    const foirAnalysis = analyzeFoirDetails({
      annualIncomeINR: annualIncome,
      monthlyEMIsINR: monthlyEMIs
    });

    // Phase 3: Feature 3 - Document Health Checker
    const documentHealth = checkDocumentHealthDetails({
      annualIncomeINR: annualIncome,
      itrDeclaredIncomeINR: itrDeclaredIncomeINR || annualIncome,
      bankStatementMonthlyCreditINR: bankStatementMonthlyCreditINR || (annualIncome / 12),
      caCertificatePresent,
      udinNumber,
      hasPropertyDeedBreakdown,
      hasCollateral: userHasCollateral,
      uploadedDocuments
    });

    // 2. Query Lenders and Determine Matches
    const allLenders = await Lender.find();

    const matchedLenders = allLenders.map((lender) => {
      let isEligible = true;
      const reasons = [];

      // Check Collateral Requirement
      if (lender.loanType === 'Collateral') {
        if (!userHasCollateral) {
          isEligible = false;
          reasons.push('Requires collateral property');
        } else if (propValue > 0 && propValue < totalFundingGapINR) {
          reasons.push(`Property value (₹${propValue.toLocaleString('en-IN')}) is lower than funding gap (₹${totalFundingGapINR.toLocaleString('en-IN')})`);
        }
      }

      // Check CIBIL Score Requirement
      if (userCibil < lender.minCibilScore) {
        isEligible = false;
        reasons.push(`CIBIL score (${userCibil}) is below minimum requirement (${lender.minCibilScore})`);
      }

      // FOIR Check Warning
      if (foirAnalysis.foirPercentage > 50) {
        reasons.push(`High Co-applicant FOIR (${foirAnalysis.foirPercentage}% > 50% threshold)`);
      }

      const matchReason = isEligible
        ? (reasons.length > 0 ? `Eligible with notes: ${reasons.join('; ')}` : 'Fully eligible matching loan criteria')
        : `Not eligible: ${reasons.join('; ')}`;

      return {
        lenderId: lender._id,
        lenderName: lender.lenderName,
        loanType: lender.loanType,
        interestRate: lender.interestRate,
        conditionNote: lender.conditionNote,
        minCibilScore: lender.minCibilScore,
        requiredDocuments: lender.requiredDocuments,
        isEligible,
        matchReason
      };
    });

    // Sort matched lenders: eligible ones first
    matchedLenders.sort((a, b) => (b.isEligible === a.isEligible ? 0 : b.isEligible ? 1 : -1));

    // 3. Save Assessment to DB
    const newAssessment = new Assessment({
      studentName,
      cibilScore: userCibil,
      country,
      university,
      course,
      tuitionFeesINR: tuition,
      livingCostPerYearINR: livingCost,
      durationYears: duration,
      familySavingsINR: familySavings,
      scholarshipsINR: scholarships,
      feesPaidINR: feesPaid,
      annualIncomeINR: annualIncome,
      monthlyEMIsINR: monthlyEMIs,
      hasCollateral: userHasCollateral,
      propertyValueINR: propValue,
      totalStudyCostINR,
      totalFundingGapINR,
      foirPercentage: foirAnalysis.foirPercentage,
      lrsBreakdown,
      foirAnalysis,
      documentHealth,
      matchedLenders
    });

    const savedAssessment = await newAssessment.save();

    // 4. Return Response
    return res.status(201).json({
      success: true,
      message: 'Assessment completed and saved successfully.',
      assessmentId: savedAssessment._id,
      data: {
        totalStudyCostINR,
        totalFundingGapINR,
        foirPercentage: foirAnalysis.foirPercentage,
        foirStatus: foirAnalysis.badgeText,
        lrsBreakdown,
        foirAnalysis,
        documentHealth,
        matchedLendersCount: matchedLenders.filter((l) => l.isEligible).length,
        matchedLenders,
        assessment: savedAssessment
      }
    });
  } catch (error) {
    console.error('Error processing assessment:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while calculating assessment.',
      error: error.message
    });
  }
});

// @route   GET /api/assessments
// @desc    Get all saved loan assessments
// @access  Public
router.get('/', async (req, res) => {
  try {
    const assessments = await Assessment.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: assessments.length,
      data: assessments
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch assessments',
      error: error.message
    });
  }
});

// @route   GET /api/assessments/:id
// @desc    Get single loan assessment by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }
    return res.status(200).json({
      success: true,
      data: assessment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch assessment',
      error: error.message
    });
  }
});

module.exports = router;
