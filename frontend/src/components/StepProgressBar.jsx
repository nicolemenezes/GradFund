import React from 'react';
import { BookOpen, Wallet, Building2, FileCheck, Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Study Details', icon: BookOpen, desc: 'Country, University & Fees' },
  { id: 2, label: 'Financial Profile', icon: Wallet, desc: 'Savings, Income & Liabilities' },
  { id: 3, label: 'Collateral Info', icon: Building2, desc: 'Assets & Property Details' },
  { id: 4, label: 'Document Upload', icon: FileCheck, desc: 'Checklist & Verification' }
];

export default function StepProgressBar({ currentStep, setStep }) {
  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full bg-white border border-[#E5E0D8] rounded-2xl p-5 sm:p-7 mb-8 shadow-xs">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold text-[#E04F4F] uppercase tracking-wider">
            Step 0{currentStep} / 0{STEPS.length}
          </span>
          <h2 className="text-xl font-extrabold text-[#1A1A1A]">
            {STEPS[currentStep - 1]?.label}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-[#666666]">Progress</span>
          <div className="text-sm font-extrabold text-[#1A1A1A]">{Math.round(progressPercent)}%</div>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-[#F2ECE4] h-2 rounded-full mb-6 overflow-hidden relative">
        <div
          className="bg-[#E04F4F] h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Stepper Nodes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <button
              key={step.id}
              onClick={() => isDone && setStep(step.id)}
              disabled={!isDone}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition ${
                isCurrent
                  ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-sm'
                  : isDone
                  ? 'bg-[#FFFDF9] border-[#E5E0D8] text-[#1A1A1A] hover:border-[#1A1A1A] cursor-pointer'
                  : 'bg-[#FBF8F3] border-[#EBF2EB]/50 text-[#888888] opacity-60 cursor-not-allowed'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold transition ${
                  isDone
                    ? 'bg-[#E04F4F] text-white'
                    : isCurrent
                    ? 'bg-white text-[#1A1A1A]'
                    : 'bg-[#E5E0D8] text-[#666666]'
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-bold truncate ${isCurrent ? 'text-white' : 'text-[#1A1A1A]'}`}>
                  {step.label}
                </p>
                <p className={`text-[11px] truncate hidden sm:block ${isCurrent ? 'text-slate-300' : 'text-[#777777]'}`}>
                  {step.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
