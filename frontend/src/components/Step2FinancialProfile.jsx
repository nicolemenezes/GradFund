import React from 'react';
import { Wallet, PiggyBank, ArrowLeft } from 'lucide-react';
import { formatINR, formatShortINR } from '../utils/formatters';
import LrsTaxCalculator from './LrsTaxCalculator';
import DebtStressAnalyzer from './DebtStressAnalyzer';

export default function Step2FinancialProfile({ formData, updateFormData, onNext, onBack }) {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    updateFormData({
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    });
  };

  // Calculations for real-time preview
  const tuition = Number(formData.tuitionFeesINR) || 0;
  const living = Number(formData.livingCostPerYearINR) || 0;
  const duration = Number(formData.durationYears) || 1;
  const totalCost = (tuition + living) * duration;

  const familySavings = Number(formData.familySavingsINR) || 0;
  const scholarships = Number(formData.scholarshipsINR) || 0;
  const feesPaid = Number(formData.feesPaidINR) || 0;
  const existingContributions = familySavings + scholarships + feesPaid;
  const estimatedGap = Math.max(0, totalCost - existingContributions);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.annualIncomeINR || formData.annualIncomeINR < 0) {
      alert('Please enter a valid annual income for the co-applicant.');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8 space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E5E0D8]">
          <div className="p-2.5 rounded-xl bg-[#F7F2EB] text-[#1A1A1A]">
            <Wallet className="w-5 h-5 text-[#E04F4F]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1A1A1A]">Financial Profile & Co-Applicant</h3>
            <p className="text-xs text-[#666666]">Existing family contributions and co-applicant income overview</p>
          </div>
        </div>

        {/* Section A: Family Self Contributions */}
        <div>
          <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <PiggyBank className="w-4 h-4 text-[#E04F4F]" /> Self & Family Contributions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Family Savings */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-2 flex items-center justify-between">
                <span>Family Savings Available</span>
                <span className="text-xs text-[#E04F4F] font-bold">{formatShortINR(formData.familySavingsINR)}</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-[#777777] text-sm font-bold">₹</span>
                <input
                  type="number"
                  name="familySavingsINR"
                  value={formData.familySavingsINR || ''}
                  onChange={handleChange}
                  placeholder="500000"
                  min="0"
                  step="25000"
                  className="w-full bg-white border border-[#D9D2C9] rounded-lg pl-8 pr-4 py-3 text-sm text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-[#1A1A1A] transition"
                />
              </div>
            </div>

            {/* Scholarships */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-2 flex items-center justify-between">
                <span>Scholarships / Grants</span>
                <span className="text-xs text-[#E04F4F] font-bold">{formatShortINR(formData.scholarshipsINR)}</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-[#777777] text-sm font-bold">₹</span>
                <input
                  type="number"
                  name="scholarshipsINR"
                  value={formData.scholarshipsINR || ''}
                  onChange={handleChange}
                  placeholder="200000"
                  min="0"
                  step="10000"
                  className="w-full bg-white border border-[#D9D2C9] rounded-lg pl-8 pr-4 py-3 text-sm text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-[#1A1A1A] transition"
                />
              </div>
            </div>

            {/* Fees Already Paid */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-2 flex items-center justify-between">
                <span>Fees Already Paid</span>
                <span className="text-xs text-[#E04F4F] font-bold">{formatShortINR(formData.feesPaidINR)}</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-[#777777] text-sm font-bold">₹</span>
                <input
                  type="number"
                  name="feesPaidINR"
                  value={formData.feesPaidINR || ''}
                  onChange={handleChange}
                  placeholder="100000"
                  min="0"
                  step="10000"
                  className="w-full bg-white border border-[#D9D2C9] rounded-lg pl-8 pr-4 py-3 text-sm text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-[#1A1A1A] transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Gap Summary Banner */}
        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E5E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#666666] block">Estimated Net Funding Gap Required</span>
            <div className="text-2xl font-black text-[#1A1A1A] mt-0.5">{formatINR(estimatedGap)}</div>
          </div>
          <div className="text-xs text-[#777777]">
            Total Expense ({formatShortINR(totalCost)}) − Total Contributions ({formatShortINR(existingContributions)})
          </div>
        </div>

        {/* FEATURE 1 INTEGRATION: Positioned directly right below the Estimated Net Funding Gap Required card */}
        <div>
          <LrsTaxCalculator initialRemittanceINR={estimatedGap} />
        </div>

        {/* FEATURE 2 INTEGRATION: Interactive Co-Applicant FOIR & Debt Stress Analyzer */}
        <div className="pt-4 border-t border-[#E5E0D8]">
          <DebtStressAnalyzer
            annualIncomeINR={formData.annualIncomeINR}
            monthlyEMIsINR={formData.monthlyEMIsINR}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-lg border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white font-bold text-sm transition flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          type="submit"
          className="px-8 py-3.5 rounded-lg bg-[#1A1A1A] hover:bg-black text-white font-bold text-sm transition cursor-pointer"
        >
          Continue to Collateral Info →
        </button>
      </div>
    </form>
  );
}
