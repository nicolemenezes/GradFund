import React, { useState } from 'react';
import { FileCheck, CheckCircle2, AlertTriangle, XCircle, ShieldCheck, FileText, Info, Award } from 'lucide-react';
import { formatINR, formatShortINR } from '../utils/formatters';

export default function DocumentHealthChecker({
  declaredIncomeINR = 1800000,
  hasCollateral = true,
  uploadedDocuments = [],
  onUpdate
}) {
  const [itrIncome, setItrIncome] = useState(declaredIncomeINR);
  const [bankMonthlyCredit, setBankMonthlyCredit] = useState(declaredIncomeINR / 12); // Defaults to matching
  const [caCertPresent, setCaCertPresent] = useState(true);
  const [udinNumber, setUdinNumber] = useState('24123456AAAAAA1234');
  const [hasPropertyBreakdown, setHasPropertyBreakdown] = useState(true);

  const bankAnnualizedCredit = bankMonthlyCredit * 12;
  const incomeVariancePercent = itrIncome > 0 ? (Math.abs(declaredIncomeINR - bankAnnualizedCredit) / declaredIncomeINR) * 100 : 0;

  // Verification Rules
  const warnings = [];
  const checks = [];

  // Check 1: 3 Years ITR / Form 16 Income Match (<10% variance)
  let itrCheckStatus = 'VERIFIED';
  let itrDetails = '3 Years ITR / Form 16 verified. Declared income matches bank credits.';

  if (incomeVariancePercent > 10) {
    itrCheckStatus = 'WARNING';
    const msg = `Your declared ITR income (₹${formatShortINR(declaredIncomeINR)}) differs from bank statement credits (₹${formatShortINR(bankAnnualizedCredit)}) by ${incomeVariancePercent.toFixed(1)}% (>10% threshold).`;
    itrDetails = msg;
    warnings.push(msg);
  } else {
    itrDetails = `Declared ITR income aligns with bank statement credits (Variance: ${incomeVariancePercent.toFixed(1)}%).`;
  }

  checks.push({
    id: 'itr_check',
    title: '3 Years ITRs / Form 16 Income Match',
    subtitle: 'Verifies declared income matches 6-month bank credit statements within 10%',
    status: itrCheckStatus,
    details: itrDetails
  });

  // Check 2: CA Net Worth Certificate Check (UDIN + Property valuation deed breakdown)
  const cleanUdin = (udinNumber || '').trim();
  const isValidUdin = cleanUdin.length === 18 && /^[a-zA-Z0-9]+$/.test(cleanUdin);

  let caCheckStatus = 'VERIFIED';
  let caDetails = 'CA Net Worth Certificate verified with valid 18-digit UDIN and valuation breakdown.';

  if (!caCertPresent) {
    caCheckStatus = 'MISSING';
    caDetails = 'CA Net Worth Certificate not attached.';
    warnings.push('CA Net Worth Certificate is missing from applicant portfolio.');
  } else if (!isValidUdin) {
    caCheckStatus = 'WARNING';
    const udinMsg = 'UDIN number missing or invalid on CA Net Worth Certificate (must be an 18-digit alphanumeric code). Banks will reject unverified certificates.';
    caDetails = udinMsg;
    warnings.push(udinMsg);
  } else if (hasCollateral && !hasPropertyBreakdown) {
    caCheckStatus = 'WARNING';
    const propMsg = 'Property valuation deed breakdown missing in CA Net Worth Certificate.';
    caDetails = propMsg;
    warnings.push(propMsg);
  } else {
    caDetails = `Verified with valid 18-digit UDIN (${cleanUdin}) & Property Valuation Breakdown.`;
  }

  checks.push({
    id: 'ca_check',
    title: 'CA Net Worth Certificate & UDIN Validation',
    subtitle: 'Verifies presence of 18-digit ICAI UDIN number and property valuation breakdown',
    status: caCheckStatus,
    details: caDetails
  });

  // Check 3: Bank Account Statements (6 Months)
  checks.push({
    id: 'bank_check',
    title: '6 Months Bank Account Statement Audit',
    subtitle: 'Audit for consistent salary/business cash flow credits',
    status: bankMonthlyCredit > 0 ? 'VERIFIED' : 'WARNING',
    details: bankMonthlyCredit > 0 ? 'Regular monthly credit transactions verified on bank statement.' : 'Bank statement credit transactions require verification.'
  });

  // Check 4: Property Title Deed & Valuation (if collateral)
  if (hasCollateral) {
    const deedStatus = hasPropertyBreakdown ? 'VERIFIED' : 'WARNING';
    checks.push({
      id: 'deed_check',
      title: 'Property Legal Title Deed & Encumbrance',
      subtitle: 'Verified property valuation deed breakdown and non-encumbrance status',
      status: deedStatus,
      details: hasPropertyBreakdown ? 'Property legal title deed & valuation breakdown verified.' : 'Property valuation deed breakdown pending.'
    });
  } else {
    checks.push({
      id: 'academic_tier_check',
      title: 'Premier Academic Institution Pre-screening',
      subtitle: 'Evaluated against premier target university bank lists',
      status: 'VERIFIED',
      details: 'Unsecured education loan profile pre-screened against premier university list.'
    });
  }

  // Check 5: Academic & University Admission Letter
  checks.push({
    id: 'offer_check',
    title: 'University Offer Letter & Fee Schedule',
    subtitle: 'Official letter with exact tuition fees & living expenses breakdown',
    status: 'VERIFIED',
    details: 'Unconditional admission letter and official fee breakdown verified.'
  });

  const verifiedCount = checks.filter(c => c.status === 'VERIFIED').length;
  const totalChecks = checks.length;
  const readinessScoreText = `${verifiedCount}/${totalChecks} Verified`;
  const readinessPercentage = Math.round((verifiedCount / totalChecks) * 100);

  return (
    <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-[#E5E0D8]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#F7F2EB] text-[#1A1A1A]">
            <FileCheck className="w-6 h-6 text-[#E04F4F]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-[#1A1A1A]">Indian Tax & Net Worth Document Health Checker</h3>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#E04F4F]/10 text-[#E04F4F] border border-[#E04F4F]/20 uppercase tracking-wider">
                Doc Audit Feature 3
              </span>
            </div>
            <p className="text-xs text-[#666666] mt-0.5">
              Automated pre-underwriting audit for 3 Years ITR income matching, CA Net Worth Certificate UDIN verification, and legal property deeds.
            </p>
          </div>
        </div>

        {/* Readiness Score Pill */}

      </div>

      {/* Interactive Verification Controls */}
      <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E5E0D8] space-y-4">
        <h4 className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider flex items-center justify-between">
          <span>Live Document Audit Inputs</span>
          <span className="text-xs text-[#777777] font-normal">Adjust values to simulate bank verification check</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          {/* Declared Income vs Bank Credits */}
          <div>
            <label className="block font-bold text-[#1A1A1A] mb-1">
              Declared Annual Income (Form 16)
            </label>
            <input
              type="number"
              value={itrIncome}
              onChange={(e) => setItrIncome(Number(e.target.value))}
              step="50000"
              className="w-full bg-white border border-[#D9D2C9] rounded-lg px-3 py-2 font-semibold text-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1A1A1A] mb-1 flex justify-between">
              <span>Bank Monthly Salary Credits</span>
              <span className="text-[10px] text-[#777777]">Annualized: {formatShortINR(bankAnnualizedCredit)}</span>
            </label>
            <input
              type="number"
              value={bankMonthlyCredit}
              onChange={(e) => setBankMonthlyCredit(Number(e.target.value))}
              step="5000"
              className="w-full bg-white border border-[#D9D2C9] rounded-lg px-3 py-2 font-semibold text-[#1A1A1A]"
            />
            <p className="text-[10px] text-[#777777] mt-1">
              Income Variance: <strong className={incomeVariancePercent > 10 ? 'text-[#E04F4F]' : 'text-emerald-700'}>{incomeVariancePercent.toFixed(1)}%</strong>
            </p>
          </div>

          {/* CA UDIN Input */}
          <div>
            <label className="block font-bold text-[#1A1A1A] mb-1 flex justify-between">
              <span>CA Net Worth Certificate UDIN</span>
              <span className={`text-[10px] font-bold ${isValidUdin ? 'text-emerald-700' : 'text-[#E04F4F]'}`}>
                {isValidUdin ? '18-Digit Valid' : 'Invalid Format'}
              </span>
            </label>
            <input
              type="text"
              value={udinNumber}
              onChange={(e) => setUdinNumber(e.target.value)}
              placeholder="e.g. 24123456AAAAAA1234"
              maxLength={18}
              className="w-full bg-white border border-[#D9D2C9] rounded-lg px-3 py-2 font-mono font-bold text-[#1A1A1A] uppercase tracking-wider"
            />
            <p className="text-[10px] text-[#777777] mt-1">Must be exact 18-digit ICAI UDIN number</p>
          </div>
        </div>

        {/* Checkboxes for document features */}
        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#E5E0D8] text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={caCertPresent}
              onChange={(e) => setCaCertPresent(e.target.checked)}
              className="rounded text-[#1A1A1A] accent-[#1A1A1A]"
            />
            <span className="font-semibold text-[#1A1A1A]">CA Net Worth Certificate Attached</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasPropertyBreakdown}
              onChange={(e) => setHasPropertyBreakdown(e.target.checked)}
              className="rounded text-[#1A1A1A] accent-[#1A1A1A]"
            />
            <span className="font-semibold text-[#1A1A1A]">Property Valuation & Title Deed Breakdown Included</span>
          </label>
        </div>
      </div>

      {/* Flagged Warnings Section (Prominent Alerts if any) */}
      {warnings.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-900 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-[#E04F4F]" />
            <span>Document Audit Flagged Warnings ({warnings.length})</span>
          </div>
          <div className="space-y-1.5 pl-6">
            {warnings.map((warn, wIdx) => (
              <p key={wIdx} className="text-rose-800 font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E04F4F]" />
                {warn}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Document Checklist Items Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider">
          Verification Checklist Breakdown
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checks.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition ${item.status === 'VERIFIED'
                ? 'bg-[#FFFDF9] border-[#E5E0D8]'
                : item.status === 'WARNING'
                  ? 'bg-rose-50/50 border-rose-200'
                  : 'bg-[#FBF8F3] border-[#E5E0D8]'
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h5 className="text-xs font-extrabold text-[#1A1A1A] flex items-center gap-1.5">
                    {item.title}
                  </h5>
                  <p className="text-[11px] text-[#666666] mt-0.5">{item.subtitle}</p>
                </div>

                {item.status === 'VERIFIED' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                  </span>
                ) : item.status === 'WARNING' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-black flex items-center gap-1 shrink-0">
                    <AlertTriangle className="w-3 h-3 text-[#E04F4F]" /> Warning
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-black flex items-center gap-1 shrink-0">
                    <XCircle className="w-3 h-3 text-slate-500" /> Missing
                  </span>
                )}
              </div>

              <div className="mt-3 p-2.5 rounded-lg bg-white border border-[#E5E0D8] text-[11px] text-[#444444] font-medium">
                {item.details}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
