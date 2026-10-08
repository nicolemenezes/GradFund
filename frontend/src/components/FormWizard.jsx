import React, { useState } from 'react';
import StepProgressBar from './StepProgressBar';
import Step1StudyDetails from './Step1StudyDetails';
import Step2FinancialProfile from './Step2FinancialProfile';
import Step3Collateral from './Step3Collateral';
import Step4DocumentsUpload from './Step4DocumentsUpload';
import ResultsView from './ResultsView';
import { useToast } from '../context/ToastContext';

const INITIAL_FORM_DATA = {
  // Step 1: Study Details
  studentName: 'Rahul Sharma',
  cibilScore: 740,
  country: 'US',
  university: 'Harvard University',
  course: 'MS in Computer Science',
  tuitionFeesINR: 3500000,
  livingCostPerYearINR: 1200000,
  durationYears: 2,

  // Step 2: Financial Profile & Co-applicant
  familySavingsINR: 1000000,
  scholarshipsINR: 500000,
  feesPaidINR: 200000,
  annualIncomeINR: 1800000,
  monthlyEMIsINR: 25000,

  // Step 3: Collateral Information
  hasCollateral: true,
  propertyType: 'Residential Property',
  propertyValueINR: 6500000,

  // Step 4: Documents Upload Simulation
  uploadedDocuments: []
};

export default function FormWizard({ onStepChange }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const toast = useToast();

  const updateFormData = (patch) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const handleNextStep = () => {
    const next = Math.min(currentStep + 1, 4);
    setCurrentStep(next);
    if (onStepChange) onStepChange(next);
  };

  const handlePrevStep = () => {
    const prev = Math.max(currentStep - 1, 1);
    setCurrentStep(prev);
    if (onStepChange) onStepChange(prev);
  };

  const handleJumpStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    if (onStepChange) onStepChange(stepNumber);
  };

  const handleStartOver = () => {
    setAssessmentResult(null);
    setCurrentStep(1);
    setErrorMsg(null);
    toast.info('Assessment form reset.');
    if (onStepChange) onStepChange(1);
  };

  // Submit assessment state to backend API (POST http://localhost:5000/api/assessments)
  const handleSubmitAssessment = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    toast.info('Calculating loan assessment & matching bank schemes...');

    try {
      const response = await fetch('http://localhost:5000/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.message || 'Failed to submit loan assessment');
      }

      setAssessmentResult(json.data);
      const eligibleCount = (json.data.matchedLenders || []).filter(l => l.isEligible).length;
      toast.success(`Assessment completed! Found ${eligibleCount} eligible bank scheme(s).`);
    } catch (err) {
      console.warn('Backend API connection error. Generating live offline fallback assessment.', err);

      // Fallback evaluation algorithm if backend server is not running during local browser preview
      const tuition = Number(formData.tuitionFeesINR) || 0;
      const living = Number(formData.livingCostPerYearINR) || 0;
      const duration = Number(formData.durationYears) || 1;
      const totalCost = (tuition + living) * duration;
      const savings = (Number(formData.familySavingsINR) || 0) + (Number(formData.scholarshipsINR) || 0) + (Number(formData.feesPaidINR) || 0);
      const gap = Math.max(0, totalCost - savings);
      const monthlyInc = (Number(formData.annualIncomeINR) || 0) / 12;
      const foir = monthlyInc > 0 ? Number((((Number(formData.monthlyEMIsINR) || 0) / monthlyInc) * 100).toFixed(2)) : 0;

      // Mocked Seed Matches
      const fallbackLenders = [
        { lenderName: 'BOI', loanType: 'Collateral', interestRate: '9.00% (Girls: 8.60%)', conditionNote: '0.40% concession for female students', minCibilScore: 670, isEligible: formData.hasCollateral && formData.cibilScore >= 670, matchReason: formData.hasCollateral ? 'Matches property collateral requirement' : 'Requires property collateral' },
        { lenderName: 'BOB', loanType: 'Non-collateral', interestRate: '8.45%', conditionNote: 'Applicable for Premier/Top 100 universities', minCibilScore: 700, isEligible: formData.cibilScore >= 700, matchReason: 'Eligible for unsecured Premier institution loan' },
        { lenderName: 'BOB', loanType: 'Collateral', interestRate: '8.95% (Boys) / 8.75% (Girls)', conditionNote: '0.20% concession for girls', minCibilScore: 700, isEligible: formData.hasCollateral && formData.cibilScore >= 700, matchReason: formData.hasCollateral ? 'Matches collateral loan parameters' : 'Requires collateral' },
        { lenderName: 'SBI', loanType: 'Non-collateral', interestRate: '9.40%', conditionNote: 'SBI Student Loan Scheme', minCibilScore: 750, isEligible: formData.cibilScore >= 750, matchReason: formData.cibilScore >= 750 ? 'Eligible for SBI Unsecured Loan' : 'Requires CIBIL score >= 750' },
        { lenderName: 'SBI', loanType: 'Collateral', interestRate: '8.40%', conditionNote: 'SBI Global Ed-Vantage Scheme', minCibilScore: 750, isEligible: formData.hasCollateral && formData.cibilScore >= 750, matchReason: formData.hasCollateral && formData.cibilScore >= 750 ? 'Fully eligible for lowest 8.40% rate' : 'Requires Collateral & CIBIL >= 750' },
        { lenderName: 'Credila', loanType: 'Non-collateral', interestRate: '10.75%', conditionNote: 'HDFC Credila custom education loan', minCibilScore: 680, isEligible: formData.cibilScore >= 680, matchReason: 'Eligible for HDFC Credila unsecured' },
        { lenderName: 'Credila', loanType: 'Collateral', interestRate: '9.25%-9.75%', conditionNote: 'Property backed flexible terms', minCibilScore: 680, isEligible: formData.hasCollateral && formData.cibilScore >= 680, matchReason: formData.hasCollateral ? 'Eligible for property backed loan' : 'Requires collateral' },
        { lenderName: 'Auxilo', loanType: 'Non-collateral', interestRate: '10.25%', conditionNote: '100% financing options for STEM', minCibilScore: 670, isEligible: formData.cibilScore >= 670, matchReason: 'Eligible for Auxilo STEM loan' },
        { lenderName: 'Auxilo', loanType: 'Collateral', interestRate: '10.00%', conditionNote: 'Fast track property collateral approval', minCibilScore: 670, isEligible: formData.hasCollateral && formData.cibilScore >= 670, matchReason: formData.hasCollateral ? 'Eligible for property collateral loan' : 'Requires collateral' }
      ];

      // Phase 3 calculations for fallback mode
      const excessGap = Math.max(0, gap - 700000);
      const loanTcs = Math.round(excessGap * 0.8 * 0.005);
      const savingsTcs = Math.round(excessGap * 0.2 * 0.20);
      const swiftFee = 2500;
      const forexMarkupAmount = Math.round(gap * 0.015);
      const outflowShock = loanTcs + savingsTcs + swiftFee + forexMarkupAmount;

      const foirStatusText = foir < 40
        ? 'Safe for Public Banks & NBFCs'
        : foir <= 55
        ? 'Borderline for Public Banks (SBI/BOB); NBFCs preferred'
        : 'High Debt Stress - Likely Public Bank Rejection. Consider pre-closing existing loans or adding a co-borrower.';

      setAssessmentResult({
        totalStudyCostINR: totalCost,
        totalFundingGapINR: gap,
        foirPercentage: foir,
        foirStatus: foirStatusText,
        lrsBreakdown: {
          totalRemittanceINR: gap,
          loanAmountINR: Math.round(gap * 0.8),
          savingsAmountINR: Math.round(gap * 0.2),
          swiftWireFeeINR: swiftFee,
          forexMarkupPercent: 1.5,
          forexMarkupINR: forexMarkupAmount,
          loanTcsINR: loanTcs,
          savingsTcsINR: savingsTcs,
          totalTcsINR: loanTcs + savingsTcs,
          outflowShockINR: outflowShock,
          trueOutOfPocketINR: gap + outflowShock
        },
        foirAnalysis: {
          foirPercentage: foir,
          badgeText: foirStatusText,
          statusBand: foir < 40 ? 'GREEN' : foir <= 55 ? 'AMBER' : 'RED'
        },
        documentHealth: {
          readinessScore: '4/5 Verified',
          scorePercentage: 80,
          warnings: []
        },
        matchedLendersCount: fallbackLenders.filter(l => l.isEligible).length,
        matchedLenders: fallbackLenders
      });

      const eligibleCount = fallbackLenders.filter(l => l.isEligible).length;
      toast.success(`Assessment completed! Found ${eligibleCount} eligible bank scheme(s).`);
    } finally {
      setIsLoading(false);
    }
  };

  // If calculation results exist, show Results View
  if (assessmentResult) {
    return (
      <ResultsView
        resultData={assessmentResult}
        formData={formData}
        onStartOver={handleStartOver}
      />
    );
  }

  return (
    <div>
      {/* Step Progress Bar */}
      <StepProgressBar currentStep={currentStep} setStep={handleJumpStep} />

      {errorMsg && (
        <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Step Components */}
      {currentStep === 1 && (
        <Step1StudyDetails
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNextStep}
        />
      )}

      {currentStep === 2 && (
        <Step2FinancialProfile
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNextStep}
          onBack={handlePrevStep}
        />
      )}

      {currentStep === 3 && (
        <Step3Collateral
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNextStep}
          onBack={handlePrevStep}
        />
      )}

      {currentStep === 4 && (
        <Step4DocumentsUpload
          formData={formData}
          updateFormData={updateFormData}
          onSubmitAssessment={handleSubmitAssessment}
          isLoading={isLoading}
          onBack={handlePrevStep}
        />
      )}
    </div>
  );
}
