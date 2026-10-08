import React, { useState } from 'react';
import { PieChart, ShieldCheck, AlertTriangle, AlertCircle, Info, Building, HelpCircle } from 'lucide-react';
import { formatINR, formatShortINR } from '../utils/formatters';

export default function DebtStressAnalyzer({
  annualIncomeINR = 1800000,
  monthlyEMIsINR = 25000,
  onUpdate
}) {
  const [annualIncome, setAnnualIncome] = useState(annualIncomeINR);
  const [homeLoanEmi, setHomeLoanEmi] = useState(15000);
  const [carLoanEmi, setCarLoanEmi] = useState(5000);
  const [personalCreditEmi, setPersonalCreditEmi] = useState(5000);
  const [otherEmi, setOtherEmi] = useState(0);

  const totalMonthlyEmi = homeLoanEmi + carLoanEmi + personalCreditEmi + otherEmi;
  const monthlyIncome = annualIncome > 0 ? annualIncome / 12 : 0;
  const foirPercent = monthlyIncome > 0 ? Number(((totalMonthlyEmi / monthlyIncome) * 100).toFixed(1)) : 0;

  // Status Badge Logic matching Phase 3 specs
  let statusBand = 'GREEN';
  let badgeText = 'Safe for Public Banks & NBFCs';
  let badgeColorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  let badgeIcon = <ShieldCheck className="w-4 h-4 text-emerald-600" />;
  let description = 'Safe for Public Banks & NBFCs (< 40%). High probability of loan sanction at lowest premier interest rates (SBI, BOB, BOI).';

  if (foirPercent < 40) {
    statusBand = 'GREEN';
    badgeText = 'Safe for Public Banks & NBFCs';
    badgeColorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    badgeIcon = <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    description = 'Safe for Public Banks & NBFCs (< 40%). High probability of loan sanction at lowest premier interest rates (SBI, BOB, BOI).';
  } else if (foirPercent <= 55) {
    statusBand = 'AMBER';
    badgeText = 'Borderline for Public Banks (SBI/BOB); NBFCs preferred';
    badgeColorClasses = 'bg-amber-50 text-amber-800 border-amber-300';
    badgeIcon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
    description = 'Borderline for Public Banks (40% - 55%). SBI & BOB may require pre-closing credit cards or adding a co-borrower. NBFCs (Credila, Auxilo) are preferred.';
  } else {
    statusBand = 'RED';
    badgeText = 'High Debt Stress - Likely Public Bank Rejection. Consider pre-closing existing loans or adding a co-borrower.';
    badgeColorClasses = 'bg-rose-50 text-rose-800 border-rose-300';
    badgeIcon = <AlertCircle className="w-4 h-4 text-rose-600" />;
    description = 'High Debt Stress (> 55%). Likely Public Bank Rejection. Consider pre-closing existing loans or adding a co-borrower to lower FOIR below 50%.';
  }

  const maxAllowableEMI = Math.max(0, Math.round(monthlyIncome * 0.50 - totalMonthlyEmi));

  return (
    <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-[#E5E0D8]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#F7F2EB] text-[#1A1A1A]">
            <PieChart className="w-6 h-6 text-[#E04F4F]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-[#1A1A1A]">Co-Applicant FOIR & Debt Stress Analyzer</h3>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#E04F4F]/10 text-[#E04F4F] border border-[#E04F4F]/20 uppercase tracking-wider">
                Underwriting Feature 2
              </span>
            </div>
            <p className="text-xs text-[#666666] mt-0.5">
              Fixed Obligation to Income Ratio (FOIR) calculation evaluated against Indian Public Bank (SBI/BOB) & NBFC underwriting rules.
            </p>
          </div>
        </div>
      </div>

      {/* Inputs & Visual Meter Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Annual Income */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5 flex justify-between">
              <span>Co-Applicant Gross Annual Income (INR)</span>
              <span className="text-[#E04F4F] font-bold">{formatShortINR(annualIncome)}</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-[#777777] text-sm font-bold">₹</span>
              <input
                type="number"
                value={annualIncome || ''}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
                step="50000"
                min="0"
                className="w-full bg-white border border-[#D9D2C9] rounded-xl pl-9 pr-4 py-3 text-sm text-[#1A1A1A] font-bold focus:outline-none focus:border-[#1A1A1A] transition"
              />
            </div>
            <p className="text-[11px] text-[#777777] mt-1">
              Monthly Gross Income: <strong>{formatINR(monthlyIncome)}</strong> / month
            </p>
          </div>

          {/* Monthly EMI Breakdown */}
          <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#E5E0D8] space-y-4">
            <h4 className="text-xs font-extrabold text-[#1A1A1A] uppercase tracking-wider flex items-center justify-between">
              <span>Existing Monthly EMIs Breakdown</span>
              <span className="text-xs text-[#E04F4F]">Total: {formatINR(totalMonthlyEmi)}/mo</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#1A1A1A] mb-1">
                  Home Loan EMI (INR)
                </label>
                <input
                  type="number"
                  value={homeLoanEmi}
                  onChange={(e) => setHomeLoanEmi(Number(e.target.value))}
                  step="1000"
                  min="0"
                  className="w-full bg-white border border-[#D9D2C9] rounded-lg px-3 py-2 text-xs font-semibold text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1A1A1A] mb-1">
                  Car / Vehicle Loan EMI (INR)
                </label>
                <input
                  type="number"
                  value={carLoanEmi}
                  onChange={(e) => setCarLoanEmi(Number(e.target.value))}
                  step="1000"
                  min="0"
                  className="w-full bg-white border border-[#D9D2C9] rounded-lg px-3 py-2 text-xs font-semibold text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1A1A1A] mb-1">
                  Personal Loans & Credit Card EMIs (INR)
                </label>
                <input
                  type="number"
                  value={personalCreditEmi}
                  onChange={(e) => setPersonalCreditEmi(Number(e.target.value))}
                  step="1000"
                  min="0"
                  className="w-full bg-white border border-[#D9D2C9] rounded-lg px-3 py-2 text-xs font-semibold text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1A1A1A] mb-1">
                  Other Monthly Liabilities (INR)
                </label>
                <input
                  type="number"
                  value={otherEmi}
                  onChange={(e) => setOtherEmi(Number(e.target.value))}
                  step="1000"
                  min="0"
                  className="w-full bg-white border border-[#D9D2C9] rounded-lg px-3 py-2 text-xs font-semibold text-[#1A1A1A]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Meter & Status Badge (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* FOIR Gauge & Badge Card */}
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E5E0D8] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#666666] uppercase tracking-wider">
                FOIR Calculation Ratio
              </span>
              <span className="text-xs font-bold text-[#1A1A1A]">
                Formula: (EMIs / Income) × 100
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-black ${foirPercent < 40 ? 'text-emerald-600' : foirPercent <= 55 ? 'text-amber-600' : 'text-[#E04F4F]'}`}>
                {foirPercent}%
              </span>
              <span className="text-xs text-[#777777]">
                ({formatINR(totalMonthlyEmi)} / {formatINR(monthlyIncome)})
              </span>
            </div>

            {/* Visual Progress Gauge */}
            <div className="space-y-1 pt-1">
              <div className="h-3 w-full bg-[#E5E0D8] rounded-full overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-500 ${
                    foirPercent < 40
                      ? 'bg-emerald-500'
                      : foirPercent <= 55
                      ? 'bg-amber-500'
                      : 'bg-[#E04F4F]'
                  }`}
                  style={{ width: `${Math.min(100, foirPercent)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#777777] font-semibold px-0.5">
                <span>0%</span>
                <span className="text-emerald-700">Safe (&lt;40%)</span>
                <span className="text-amber-700">Borderline (40-55%)</span>
                <span className="text-rose-700">High Risk (&gt;55%)</span>
              </div>
            </div>

            {/* Visual Status Badge (Strictly matching prompt specs) */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 transition ${badgeColorClasses}`}>
              <div className="shrink-0 mt-0.5">{badgeIcon}</div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider block">Underwriting Status</span>
                <p className="text-xs font-bold mt-0.5">{badgeText}</p>
              </div>
            </div>

            <p className="text-xs text-[#555555] leading-relaxed pt-1">
              {description}
            </p>
          </div>

          {/* Underwriting Recommendation Card */}
          <div className="p-4 rounded-xl bg-[#F7F2EB] border border-[#E5E0D8] text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-[#1A1A1A]">
              <span>Max Allowable New Loan EMI Capacity</span>
              <span className="text-sm font-black text-emerald-700">{formatINR(maxAllowableEMI)}/mo</span>
            </div>
            <p className="text-[11px] text-[#666666]">
              Based on standard 50% FOIR cap enforced by SBI & Bank of Baroda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
