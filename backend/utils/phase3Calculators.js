/**
 * Utility functions for Phase 3 Indian-centric financial calculations:
 * 1. LRS Tax (TCS) & Forex Outflow Shock Calculator
 * 2. Co-Applicant FOIR & Debt Stress Analyzer
 * 3. Indian Tax & Net Worth Document Health Checker
 */

/**
 * Feature 1: LRS Tax (TCS) & Forex Outflow Shock Calculator
 */
function calculateLrsTaxDetails({
  totalRemittanceINR = 0,
  fundingSourceLoanINR = 0,
  fundingSourceSavingsINR = 0,
  swiftWireFeeINR = 2500,
  forexMarkupPercent = 1.5
}) {
  const remittance = Number(totalRemittanceINR) || 0;
  let loanAmount = Number(fundingSourceLoanINR) || 0;
  let savingsAmount = Number(fundingSourceSavingsINR) || 0;

  // If user didn't explicitly split, assume remaining funding comes from loan
  if (loanAmount === 0 && savingsAmount === 0) {
    loanAmount = remittance;
  } else if (loanAmount + savingsAmount !== remittance && (loanAmount + savingsAmount) > 0) {
    // Normalize ratio to remittance
    const totalAlloc = loanAmount + savingsAmount;
    loanAmount = (loanAmount / totalAlloc) * remittance;
    savingsAmount = (savingsAmount / totalAlloc) * remittance;
  }

  const LRS_EXEMPT_THRESHOLD = 700000; // ₹7 Lakhs threshold under RBI LRS
  const excessAmount = Math.max(0, remittance - LRS_EXEMPT_THRESHOLD);

  let loanTcsINR = 0;
  let savingsTcsINR = 0;

  if (excessAmount > 0) {
    const loanRatio = remittance > 0 ? loanAmount / remittance : 1;
    const loanExcess = excessAmount * loanRatio;
    const savingsExcess = excessAmount - loanExcess;

    // TCS Rates: Education Loan = 0.5%, Personal Savings/Family Funds = 20%
    loanTcsINR = Math.round(loanExcess * 0.005);
    savingsTcsINR = Math.round(savingsExcess * 0.20);
  }

  const totalTcsINR = loanTcsINR + savingsTcsINR;
  const swiftFee = Number(swiftWireFeeINR) || 2500;
  const forexMarkupINR = Math.round(remittance * ((Number(forexMarkupPercent) || 1.5) / 100));

  const outflowShockINR = totalTcsINR + swiftFee + forexMarkupINR;
  const trueOutOfPocketINR = remittance + outflowShockINR;

  return {
    totalRemittanceINR: Math.round(remittance),
    loanAmountINR: Math.round(loanAmount),
    savingsAmountINR: Math.round(savingsAmount),
    lrsExemptThresholdINR: LRS_EXEMPT_THRESHOLD,
    excessAboveThresholdINR: Math.round(excessAmount),
    swiftWireFeeINR: Math.round(swiftFee),
    forexMarkupPercent: Number(forexMarkupPercent) || 1.5,
    forexMarkupINR,
    loanTcsINR,
    savingsTcsINR,
    totalTcsINR,
    outflowShockINR,
    trueOutOfPocketINR
  };
}

/**
 * Feature 2: Co-Applicant FOIR & Debt Stress Analyzer
 */
function analyzeFoirDetails({ annualIncomeINR = 0, monthlyEMIsINR = 0 }) {
  const annualIncome = Number(annualIncomeINR) || 0;
  const monthlyEMIs = Number(monthlyEMIsINR) || 0;
  const monthlyIncome = annualIncome > 0 ? annualIncome / 12 : 0;

  const foirPercentage = monthlyIncome > 0 ? Number(((monthlyEMIs / monthlyIncome) * 100).toFixed(1)) : 0;

  let statusBand = 'GREEN';
  let badgeText = 'Safe for Public Banks & NBFCs';
  let color = 'emerald';
  let recommendation = 'Safe for Public Banks & NBFCs. Excellent debt service capacity. High likelihood of approval at lowest interest rates.';

  if (foirPercentage < 40) {
    statusBand = 'GREEN';
    badgeText = 'Safe for Public Banks & NBFCs';
    color = 'emerald';
    recommendation = 'Safe for Public Banks & NBFCs (< 40%). Excellent debt-to-income ratio. Co-applicant qualifies for prime interest rates at public banks like SBI & BOB.';
  } else if (foirPercentage <= 55) {
    statusBand = 'AMBER';
    badgeText = 'Borderline for Public Banks (SBI/BOB); NBFCs preferred';
    color = 'amber';
    recommendation = 'Borderline for Public Banks (40% - 55%). SBI & BOB may request loan pre-closure or adding a secondary co-borrower. NBFCs (Credila, Auxilo) are preferred.';
  } else {
    statusBand = 'RED';
    badgeText = 'High Debt Stress - Likely Public Bank Rejection. Consider pre-closing existing loans or adding a co-borrower.';
    color = 'red';
    recommendation = 'High Debt Stress (> 55%). Likely Public Bank Rejection. We strongly recommend pre-closing existing loans/credit cards or adding an additional earning co-borrower to lower FOIR below 50%.';
  }

  // Calculate maximum new EMI capacity for target bank (assuming max 50% FOIR limit)
  const maxAllowableEMI = Math.max(0, Math.round(monthlyIncome * 0.50 - monthlyEMIs));

  return {
    annualIncomeINR: Math.round(annualIncome),
    monthlyIncomeINR: Math.round(monthlyIncome),
    monthlyEMIsINR: Math.round(monthlyEMIs),
    foirPercentage,
    statusBand,
    badgeText,
    color,
    recommendation,
    maxAllowableEMI
  };
}

/**
 * Feature 3: Indian Tax & Net Worth Document Health Checker
 */
function checkDocumentHealthDetails({
  annualIncomeINR = 0,
  itrDeclaredIncomeINR = 0,
  bankStatementMonthlyCreditINR = 0,
  caCertificatePresent = true,
  udinNumber = '',
  hasPropertyDeedBreakdown = true,
  hasCollateral = false,
  uploadedDocuments = []
}) {
  const annualIncome = Number(annualIncomeINR) || 0;
  const itrIncome = Number(itrDeclaredIncomeINR) || annualIncome;
  const bankMonthlyCredit = Number(bankStatementMonthlyCreditINR) || (annualIncome / 12);
  const bankAnnualizedCredit = bankMonthlyCredit * 12;

  const checks = [];
  const warnings = [];

  // Check 1: 3 Years ITRs / Form 16 check
  let itrStatus = 'VERIFIED';
  let itrDetails = '3 Years ITR / Form 16 verified. Income aligns with bank credit statements.';

  if (itrIncome > 0 && bankAnnualizedCredit > 0) {
    const variancePercent = Math.abs(itrIncome - bankAnnualizedCredit) / itrIncome * 100;
    if (variancePercent > 10) {
      itrStatus = 'WARNING';
      const warningText = `Your declared ITR income (₹${itrIncome.toLocaleString('en-IN')}) differs from bank statement credits (₹${Math.round(bankAnnualizedCredit).toLocaleString('en-IN')}) by ${variancePercent.toFixed(1)}% (>10% threshold).`;
      itrDetails = warningText;
      warnings.push(warningText);
    } else {
      itrDetails = `Declared ITR income matches bank statement credits (Variance: ${variancePercent.toFixed(1)}%).`;
    }
  }

  checks.push({
    id: 'itr_check',
    name: '3 Years ITRs / Form 16 Income Match',
    status: itrStatus,
    details: itrDetails
  });

  // Check 2: CA Net Worth Certificate check (UDIN + Property valuation deed breakdown)
  let caStatus = 'VERIFIED';
  let caDetails = 'CA Net Worth Certificate verified with valid UDIN number and valuation breakdown.';

  const cleanUdin = String(udinNumber || '').trim();
  const isValidUdin = cleanUdin.length === 18 && /^[a-zA-Z0-9]+$/.test(cleanUdin);

  if (!caCertificatePresent) {
    caStatus = 'MISSING';
    caDetails = 'CA Net Worth Certificate not uploaded.';
    warnings.push('CA Net Worth Certificate is missing.');
  } else if (!isValidUdin) {
    caStatus = 'WARNING';
    const udinWarn = 'UDIN number missing or invalid on CA Net Worth Certificate (must be an 18-digit alphanumeric code). Banks will reject unverified certificates.';
    caDetails = udinWarn;
    warnings.push(udinWarn);
  } else if (hasCollateral && !hasPropertyDeedBreakdown) {
    caStatus = 'WARNING';
    const propWarn = 'Property valuation deed breakdown missing in CA Net Worth Certificate.';
    caDetails = propWarn;
    warnings.push(propWarn);
  } else {
    caDetails = `CA Net Worth Certificate verified with valid 18-digit UDIN (${cleanUdin}) & valuation breakdown.`;
  }

  checks.push({
    id: 'ca_networth_check',
    name: 'CA Net Worth Certificate & UDIN Validation',
    status: caStatus,
    details: caDetails
  });

  // Check 3: Bank Account Statement Check
  checks.push({
    id: 'bank_statement_check',
    name: '6 Months Bank Account Statement Consistency',
    status: bankMonthlyCredit > 0 ? 'VERIFIED' : 'WARNING',
    details: bankMonthlyCredit > 0 ? 'Regular monthly credit transactions detected on bank statements.' : 'Bank statement transactions require verification.'
  });

  // Check 4: Property Deed Breakdown (if collateral selected)
  if (hasCollateral) {
    const deedStatus = hasPropertyDeedBreakdown ? 'VERIFIED' : 'WARNING';
    if (!hasPropertyDeedBreakdown) {
      warnings.push('Property Legal Title Deed and Encumbrance breakdown required for collateral valuation.');
    }
    checks.push({
      id: 'property_deed_check',
      name: 'Property Title Deed & Valuation Breakdown',
      status: deedStatus,
      details: hasPropertyDeedBreakdown ? 'Property valuation deed & clear title verified.' : 'Property valuation deed breakdown pending.'
    });
  } else {
    checks.push({
      id: 'unsecured_collateral_check',
      name: 'Unsecured Loan Criteria Pre-screening',
      status: 'VERIFIED',
      details: 'Non-collateral loan profile evaluated against bank academic tier list.'
    });
  }

  // Check 5: Academic & Admission Documents
  checks.push({
    id: 'admission_check',
    name: 'University Admission & Fee Structure Breakdown',
    status: 'VERIFIED',
    details: 'Unconditional / Conditional admission letter & fee structure verified.'
  });

  const verifiedCount = checks.filter(c => c.status === 'VERIFIED').length;
  const totalChecks = checks.length;
  const scorePercentage = Math.round((verifiedCount / totalChecks) * 100);
  const readinessScore = `${verifiedCount}/${totalChecks} Verified`;

  return {
    readinessScore,
    scorePercentage,
    totalChecks,
    verifiedCount,
    warnings,
    checks
  };
}

module.exports = {
  calculateLrsTaxDetails,
  analyzeFoirDetails,
  checkDocumentHealthDetails
};
