import React from 'react';
import { Globe, GraduationCap, BookOpen, Coins, Clock, User, ShieldCheck } from 'lucide-react';
import { formatINR, formatShortINR } from '../utils/formatters';

const COUNTRIES = [
  { code: 'US', name: 'United States (US)', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom (UK)', flag: '🇬🇧' },
  { code: 'Canada', name: 'Canada', flag: '🇨🇦' },
  { code: 'Germany', name: 'Germany', flag: '🇩🇪' },
  { code: 'Ireland', name: 'Ireland', flag: '🇮🇪' },
  { code: 'Australia', name: 'Australia', flag: '🇦🇺' }
];

const SUGGESTED_UNIVERSITIES = [
  'Harvard University',
  'Stanford University',
  'MIT',
  'University of Toronto',
  'Oxford University',
  'Imperial College London',
  'TUM Munich',
  'Trinity College Dublin',
  'University of Melbourne'
];

export default function Step1StudyDetails({ formData, updateFormData, onNext }) {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    updateFormData({
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    });
  };

  const estimatedTotalCost =
    ((Number(formData.tuitionFeesINR) || 0) + (Number(formData.livingCostPerYearINR) || 0)) *
    (Number(formData.durationYears) || 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.country || !formData.university || !formData.course) {
      alert('Please fill in all required fields (Country, University, and Course).');
      return;
    }
    if (!formData.tuitionFeesINR || formData.tuitionFeesINR <= 0) {
      alert('Please enter a valid tuition fee amount.');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E5E0D8]">
          <div className="p-2.5 rounded-xl bg-[#F7F2EB] text-[#1A1A1A]">
            <BookOpen className="w-5 h-5 text-[#E04F4F]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1A1A1A]">Study & Academic Details</h3>
            <p className="text-xs text-[#666666]">Target destination, institution details, and estimated expenses</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Name */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#E04F4F]" /> Student Full Name *
            </label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName || ''}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-white border border-[#D9D2C9] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] transition"
              required
            />
          </div>

          {/* Student CIBIL Score */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E04F4F]" /> CIBIL Credit Score (Estimate)
              </span>
              <span className="text-[#E04F4F] font-extrabold">{formData.cibilScore || 720}</span>
            </label>
            <input
              type="range"
              name="cibilScore"
              min="300"
              max="900"
              step="10"
              value={formData.cibilScore || 720}
              onChange={handleChange}
              className="w-full accent-[#E04F4F] bg-[#E5E0D8] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#777777] font-medium mt-1">
              <span>300 (Poor)</span>
              <span>700 (Good)</span>
              <span>900 (Excellent)</span>
            </div>
          </div>

          {/* Destination Country */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#E04F4F]" /> Destination Country *
            </label>
            <select
              name="country"
              value={formData.country || 'US'}
              onChange={handleChange}
              className="w-full bg-white border border-[#D9D2C9] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] transition cursor-pointer"
              required
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* University Name */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#E04F4F]" /> University / Institution *
            </label>
            <input
              type="text"
              name="university"
              value={formData.university || ''}
              onChange={handleChange}
              list="university-list"
              placeholder="e.g. Harvard University"
              className="w-full bg-white border border-[#D9D2C9] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] transition"
              required
            />
            <datalist id="university-list">
              {SUGGESTED_UNIVERSITIES.map((u, idx) => (
                <option key={idx} value={u} />
              ))}
            </datalist>
          </div>

          {/* Course Name */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#E04F4F]" /> Course / Program Title *
            </label>
            <input
              type="text"
              name="course"
              value={formData.course || ''}
              onChange={handleChange}
              placeholder="e.g. MS in Computer Science"
              className="w-full bg-white border border-[#D9D2C9] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] transition"
              required
            />
          </div>

          {/* Course Duration */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#E04F4F]" /> Course Duration (Years) *
            </label>
            <select
              name="durationYears"
              value={formData.durationYears || 2}
              onChange={handleChange}
              className="w-full bg-white border border-[#D9D2C9] rounded-lg px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] transition cursor-pointer"
              required
            >
              <option value={1}>1 Year (Master's / PG Diploma)</option>
              <option value={2}>2 Years (Standard MS / MBA)</option>
              <option value={3}>3 Years (Bachelor's / PhD)</option>
              <option value={4}>4 Years (Undergraduate BS)</option>
            </select>
          </div>

          {/* Tuition Fees per Year */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-[#E04F4F]" /> Tuition Fees Per Year (INR) *
              </span>
              <span className="text-xs text-[#E04F4F] font-extrabold">
                {formatShortINR(formData.tuitionFeesINR)}
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-[#777777] text-sm font-bold">₹</span>
              <input
                type="number"
                name="tuitionFeesINR"
                value={formData.tuitionFeesINR || ''}
                onChange={handleChange}
                placeholder="2500000"
                min="0"
                step="50000"
                className="w-full bg-white border border-[#D9D2C9] rounded-lg pl-8 pr-4 py-3 text-sm text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] transition"
                required
              />
            </div>
          </div>

          {/* Living Cost per Year */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-[#E04F4F]" /> Living Cost Per Year (INR) *
              </span>
              <span className="text-xs text-[#E04F4F] font-extrabold">
                {formatShortINR(formData.livingCostPerYearINR)}
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-[#777777] text-sm font-bold">₹</span>
              <input
                type="number"
                name="livingCostPerYearINR"
                value={formData.livingCostPerYearINR || ''}
                onChange={handleChange}
                placeholder="1000000"
                min="0"
                step="50000"
                className="w-full bg-white border border-[#D9D2C9] rounded-lg pl-8 pr-4 py-3 text-sm text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] transition"
                required
              />
            </div>
          </div>
        </div>

        {/* Featured GradGuide Dark Summary Card */}
        <div className="mt-8 p-6 rounded-2xl bg-[#111111] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E04F4F]">
              Total Estimated Study Expense
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              (Tuition + Living) × {formData.durationYears || 2} Years
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-white">{formatINR(estimatedTotalCost)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3.5 rounded-lg bg-[#1A1A1A] hover:bg-black text-white font-bold text-sm transition cursor-pointer"
        >
          Continue to Financial Profile →
        </button>
      </div>
    </form>
  );
}
