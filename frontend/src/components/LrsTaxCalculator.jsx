import React, { useState, useEffect } from 'react';
import { Landmark, Info, ShieldAlert } from 'lucide-react';
import { formatINR, formatShortINR } from '../utils/formatters';

export default function LrsTaxCalculator({ initialRemittanceINR = 3000000 }) {
  const [remittanceAmount, setRemittanceAmount] = useState(initialRemittanceINR);
  const [loanRatioPercent, setLoanRatioPercent] = useState(80); // 80% Loan, 20% Personal/Family Savings
  const [swiftFee, setSwiftFee] = useState(2500); // default ~₹2,500
  const [forexMarkup, setForexMarkup] = useState(1.5); // default 1.5%

  // Update remittance amount if initialRemittanceINR changes from parent gap calculation
  useEffect(() => {
    if (initialRemittanceINR !== undefined) {
      setRemittanceAmount(initialRemittanceINR);
    }
  }, [initialRemittanceINR]);

  const loanPortion = Math.round((remittanceAmount * loanRatioPercent) / 100);
  const savingsPortion = remittanceAmount - loanPortion;

  const LRS_EXEMPT_THRESHOLD = 700000; // ₹7 Lakhs RBI LRS threshold
  const excess = Math.max(0, remittanceAmount - LRS_EXEMPT_THRESHOLD);

  // TCS allocation calculation
  const loanExcess = remittanceAmount > 0 ? excess * (loanPortion / remittanceAmount) : 0;
  const savingsExcess = excess - loanExcess;

  const loanTcs = Math.round(loanExcess * 0.005); // 0.5% for education loan
  const savingsTcs = Math.round(savingsExcess * 0.20); // 20% for personal/family savings
  const totalTcs = loanTcs + savingsTcs;

  const forexMarkupAmount = Math.round(remittanceAmount * (forexMarkup / 100));
  const estimatedForexAndSwift = swiftFee + forexMarkupAmount;
  const outflowShock = totalTcs + estimatedForexAndSwift;
  const trueOutOfPocket = remittanceAmount + outflowShock;

  return (
    <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Header & Subtitle */}
      <div className="flex items-start justify-between pb-4 border-b border-[#E5E0D8]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#F7F2EB] text-[#1A1A1A]">
            <Landmark className="w-6 h-6 text-[#E04F4F]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-[#1A1A1A]">
                LRS Tax (TCS) & Forex Outflow Shock Calculator
              </h3>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#E04F4F]/10 text-[#E04F4F] border border-[#E04F4F]/20 uppercase tracking-wider">
                RBI LRS Feature 1
              </span>
            </div>
            <p className="text-xs italic text-[#666666] mt-0.5">
              Unbudgeted Indian government remittance tax and wire fees on international money transfers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs & Parameters (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Remittance Amount Input */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 flex justify-between">
              <span>Funding Gap Amount (Total Remittance)</span>
              <span className="text-[#E04F4F] text-xs font-extrabold">{formatShortINR(remittanceAmount)}</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-[#777777] text-sm font-bold">₹</span>
              <input
                type="number"
                value={remittanceAmount || ''}
                onChange={(e) => setRemittanceAmount(Number(e.target.value))}
                step="50000"
                min="0"
                className="w-full bg-white border border-[#D9D2C9] rounded-xl pl-9 pr-4 py-3 text-sm text-[#1A1A1A] font-bold focus:outline-none focus:border-[#1A1A1A] transition"
              />
            </div>
            <p className="text-[11px] text-[#777777] mt-1.5 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#E04F4F]" /> First ₹700,000 (₹7 Lakhs) per financial year has 0% TCS under RBI LRS rules.
            </p>
          </div>

          {/* Funding Source Split Slider */}
          <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#E5E0D8] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#1A1A1A]">
              <span>Funding Source Allocation</span>
              <span className="text-xs text-[#666666]">
                Loan: <strong className="text-[#1A1A1A]">{loanRatioPercent}%</strong> ({formatShortINR(loanPortion)}) | Savings: <strong className="text-[#1A1A1A]">{100 - loanRatioPercent}%</strong> ({formatShortINR(savingsPortion)})
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={loanRatioPercent}
              onChange={(e) => setLoanRatioPercent(Number(e.target.value))}
              className="w-full accent-[#E04F4F] cursor-pointer"
            />

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Education Loan TCS Rate</span>
                <span className="text-sm font-black text-emerald-950">0.5% TCS</span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">Section 80E eligible loan</span>
              </div>

              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                <span className="text-[10px] font-bold text-rose-800 uppercase block">Personal Savings TCS Rate</span>
                <span className="text-sm font-black text-rose-950">20.0% TCS</span>
                <span className="text-[10px] text-rose-700 block mt-0.5">Family funds above ₹7L</span>
              </div>
            </div>
          </div>

          {/* Wire Fees & Forex Markup Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 flex justify-between">
                <span>SWIFT Wire Transfer Fee</span>
                <span className="text-[#1A1A1A] font-bold">{formatINR(swiftFee)}</span>
              </label>
              <input
                type="number"
                value={swiftFee}
                onChange={(e) => setSwiftFee(Number(e.target.value))}
                min="1500"
                max="5000"
                step="250"
                className="w-full bg-white border border-[#D9D2C9] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] font-bold focus:outline-none focus:border-[#1A1A1A]"
              />
              <span className="text-[10px] text-[#777777] mt-1 block">Intermediary wire fee (~₹2,500)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 flex justify-between">
                <span>Bank Forex Spread %</span>
                <span className="text-[#1A1A1A] font-bold">{forexMarkup}%</span>
              </label>
              <input
                type="number"
                value={forexMarkup}
                onChange={(e) => setForexMarkup(Number(e.target.value))}
                min="0.5"
                max="5.0"
                step="0.1"
                className="w-full bg-white border border-[#D9D2C9] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] font-bold focus:outline-none focus:border-[#1A1A1A]"
              />
              <span className="text-[10px] text-[#777777] mt-1 block">Exchange rate markup spread</span>
            </div>
          </div>
        </div>

        {/* Right Output Card (5 Cols): Data-Dense Breakdown & Out-of-Pocket Highlight */}
        <div className="lg:col-span-5 bg-[#FFFDF9] border border-[#E5E0D8] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E0D8]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                Remittance Cost Breakdown
              </span>
              <span className="px-2 py-0.5 rounded bg-[#F7F2EB] text-[#1A1A1A] border border-[#D9D2C9] text-[10px] font-bold">
                RBI LRS Rule
              </span>
            </div>

            {/* Itemized Breakdown Lines */}
            <div className="space-y-3.5 text-xs">
              {/* 1. Net Funding Gap */}
              <div className="flex items-center justify-between">
                <span className="text-[#666666] font-medium">Funding Gap Amount:</span>
                <span className="font-bold text-[#1A1A1A]">{formatINR(remittanceAmount)}</span>
              </div>

              {/* 2. Applicable LRS TCS Tax */}
              <div className="space-y-1 pt-1 border-t border-dashed border-[#E5E0D8]">
                <div className="flex items-center justify-between">
                  <span className="text-[#666666] font-medium">Applicable LRS Tax (TCS):</span>
                  <span className="font-bold text-[#E04F4F]">+{formatINR(totalTcs)}</span>
                </div>
                <div className="pl-3 text-[11px] text-[#777777] space-y-0.5">
                  <div className="flex justify-between">
                    <span>• Loan portion (0.5% above ₹7L):</span>
                    <span>{formatINR(loanTcs)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Savings portion (20% above ₹7L):</span>
                    <span>{formatINR(savingsTcs)}</span>
                  </div>
                </div>
              </div>

              {/* 3. Forex & SWIFT Charges */}
              <div className="space-y-1 pt-1 border-t border-dashed border-[#E5E0D8]">
                <div className="flex items-center justify-between">
                  <span className="text-[#666666] font-medium">Estimated Forex & SWIFT Charges:</span>
                  <span className="font-bold text-[#1A1A1A]">+{formatINR(estimatedForexAndSwift)}</span>
                </div>
                <div className="pl-3 text-[11px] text-[#777777] space-y-0.5">
                  <div className="flex justify-between">
                    <span>• Intermediary SWIFT Wire Fee:</span>
                    <span>{formatINR(swiftFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Forex Spread Markup ({forexMarkup}%):</span>
                    <span>{formatINR(forexMarkupAmount)}</span>
                  </div>
                </div>
              </div>

              {/* 4. Total Outflow Shock Extra */}
              <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between text-xs font-bold text-[#1A1A1A]">
                <span>Total Outflow Shock Buffer:</span>
                <span className="text-[#E04F4F] font-black">+{formatINR(outflowShock)}</span>
              </div>
            </div>

            {/* Hero True Out-of-Pocket Highlight Box */}
            <div className="mt-6 p-4 rounded-xl bg-white border-2 border-[#1A1A1A] space-y-1">
              <span className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block">
                True Out-of-Pocket INR Requirement
              </span>
              <div className="text-3xl font-black text-[#E04F4F]">
                {formatINR(trueOutOfPocket)}
              </div>
              <p className="text-[11px] text-[#555555] mt-1 leading-snug">
                Exact final cash sum required to prevent last-minute visa financial shocks.
              </p>
            </div>
          </div>

          {/* Cash Crunch Info Note */}
          <div className="mt-5 p-3 rounded-xl bg-[#F7F2EB] border border-[#E5E0D8] text-[11px] text-[#555555] flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-[#E04F4F] shrink-0 mt-0.5" />
            <p>
              <strong>Note:</strong> TCS is adjustable in your annual Income Tax Return (ITR), but requires liquid upfront cash before bank wire transfer dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
