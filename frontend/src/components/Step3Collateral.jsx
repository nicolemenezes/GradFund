import React from 'react';
import { Building2, CheckCircle2, ArrowLeft, Percent, Landmark } from 'lucide-react';
import { formatINR, formatShortINR } from '../utils/formatters';

const PROPERTY_TYPES = [
  { id: 'Residential Property', label: 'Residential Property (House / Flat / Land)' },
  { id: 'Commercial Property', label: 'Commercial Property (Office / Shop)' },
  { id: 'Fixed Deposit', label: 'Bank Fixed Deposit (FD)' },
  { id: 'Liquid Assets', label: 'Mutual Funds / Govt Bonds / Insurance Policies' }
];

export default function Step3Collateral({ formData, updateFormData, onNext, onBack }) {
  const handleCollateralToggle = (hasCollat) => {
    updateFormData({
      hasCollateral: hasCollat,
      propertyValueINR: hasCollat ? (formData.propertyValueINR || 5000000) : 0
    });
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    updateFormData({
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.hasCollateral && (!formData.propertyValueINR || formData.propertyValueINR <= 0)) {
      alert('Please enter an estimated market value for your collateral property.');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E5E0D8]">
          <div className="p-2.5 rounded-xl bg-[#F7F2EB] text-[#1A1A1A]">
            <Building2 className="w-5 h-5 text-[#E04F4F]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1A1A1A]">Collateral Information</h3>
            <p className="text-xs text-[#666666]">Tangible collateral unlocks prime interest rates (SBI, BOB, BOI)</p>
          </div>
        </div>

        {/* Collateral Toggle Selection */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-[#1A1A1A] mb-3">
            Does the student / co-applicant family have collateral available? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleCollateralToggle(true)}
              className={`p-5 rounded-2xl border flex items-start gap-4 transition text-left cursor-pointer ${
                formData.hasCollateral
                  ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-sm'
                  : 'bg-white border-[#D9D2C9] text-[#1A1A1A] hover:border-[#1A1A1A]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  formData.hasCollateral ? 'bg-[#E04F4F] text-white' : 'border border-[#D9D2C9]'
                }`}
              >
                {formData.hasCollateral && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
              </div>
              <div>
                <span className={`font-extrabold text-sm block ${formData.hasCollateral ? 'text-white' : 'text-[#1A1A1A]'}`}>
                  Yes, Collateral Available
                </span>
                <span className={`text-xs block mt-1 ${formData.hasCollateral ? 'text-slate-300' : 'text-[#666666]'}`}>
                  Eligible for SBI (8.40%), BOI (8.60%-9.00%), BOB Collateral schemes
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleCollateralToggle(false)}
              className={`p-5 rounded-2xl border flex items-start gap-4 transition text-left cursor-pointer ${
                !formData.hasCollateral
                  ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-sm'
                  : 'bg-white border-[#D9D2C9] text-[#1A1A1A] hover:border-[#1A1A1A]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  !formData.hasCollateral ? 'bg-[#E04F4F] text-white' : 'border border-[#D9D2C9]'
                }`}
              >
                {!formData.hasCollateral && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
              </div>
              <div>
                <span className={`font-extrabold text-sm block ${!formData.hasCollateral ? 'text-white' : 'text-[#1A1A1A]'}`}>
                  No Collateral (Unsecured Loan)
                </span>
                <span className={`text-xs block mt-1 ${!formData.hasCollateral ? 'text-slate-300' : 'text-[#666666]'}`}>
                  Filtered for BOB Non-collateral (8.45%), SBI (9.40%), Credila & Auxilo
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Collateral Asset Details */}
        {formData.hasCollateral && (
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E5E0D8] space-y-6">
            <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-[#E04F4F]" /> Collateral Asset Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Category */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
                  Property / Asset Category *
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType || 'Residential Property'}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#D9D2C9] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition cursor-pointer"
                >
                  {PROPERTY_TYPES.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estimated Market Value */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Estimated Market Value (INR) *</span>
                  <span className="text-xs text-[#E04F4F] font-extrabold">
                    {formatShortINR(formData.propertyValueINR)}
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-[#777777] text-sm font-bold">₹</span>
                  <input
                    type="number"
                    name="propertyValueINR"
                    value={formData.propertyValueINR || ''}
                    onChange={handleChange}
                    placeholder="5000000"
                    min="0"
                    step="100000"
                    className="w-full bg-white border border-[#D9D2C9] rounded-lg pl-8 pr-4 py-3 text-sm text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-[#1A1A1A] transition"
                    required={formData.hasCollateral}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informational Note */}
        <div className="mt-6 p-4 rounded-xl bg-[#F7F2EB] border border-[#E5E0D8] flex items-start gap-3">
          <Percent className="w-5 h-5 text-[#E04F4F] shrink-0 mt-0.5" />
          <div className="text-xs text-[#444444]">
            <span className="font-bold text-[#1A1A1A]">Collateral Advantage:</span> Public sector lenders offer rates as low as 8.40% - 9.00% when tangible immovable property collateral is pledged. Non-collateral loans range from 8.45% (for Premier institutions) to 10.75%.
          </div>
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
          Continue to Document Checklist →
        </button>
      </div>
    </form>
  );
}
