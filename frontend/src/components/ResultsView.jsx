import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Building2,
  Download,
  ChevronDown,
  ChevronUp,
  Landmark,
  PieChart,
  FileCheck,
} from 'lucide-react';
import { formatINR, formatShortINR } from '../utils/formatters';
import LrsTaxCalculator from './LrsTaxCalculator';
import DebtStressAnalyzer from './DebtStressAnalyzer';
import DocumentHealthChecker from './DocumentHealthChecker';

export default function ResultsView({ resultData, formData, onStartOver }) {
  const [activeTab, setActiveTab] = useState('lenders'); // 'lenders', 'lrs', 'foir', 'doc-health'
  const [lenderFilter, setLenderFilter] = useState('all');
  const [expandedLenderId, setExpandedLenderId] = useState(null);

  if (!resultData) return null;

  const {
    totalStudyCostINR = 0,
    totalFundingGapINR = 0,
    foirPercentage = 0,
    matchedLenders = [],
    lrsBreakdown,
    foirAnalysis,
    documentHealth
  } = resultData;

  const eligibleCount = matchedLenders.filter((l) => l.isEligible).length;

  const filteredLenders = matchedLenders.filter((lender) => {
    if (lenderFilter === 'eligible') return lender.isEligible;
    if (lenderFilter === 'collateral') return lender.loanType === 'Collateral';
    if (lenderFilter === 'non-collateral') return lender.loanType === 'Non-collateral';
    return true;
  });

  // Calculate FOIR badge text & color
  const foirVal = foirPercentage || (foirAnalysis ? foirAnalysis.foirPercentage : 0);
  let foirBadgeClass = 'bg-emerald-950 text-emerald-300 border-emerald-800';
  if (foirVal >= 40 && foirVal <= 55) {
    foirBadgeClass = 'bg-amber-950 text-amber-300 border-amber-800';
  } else if (foirVal > 55) {
    foirBadgeClass = 'bg-rose-950 text-rose-300 border-rose-800';
  }

  return (
    <div className="space-y-8">
      {/* Signature GradGuide Solid Dark Banner */}
      <div className="bg-[#111111] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E04F4F] text-white">
                Full Assessment Report
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                Phase 3 Indian-Centric Edition
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Loan Eligibility & Indian Tax Shock Analysis
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Applicant: <span className="text-white font-bold">{formData.studentName || 'Student'}</span> • {formData.university} ({formData.country})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button
              onClick={onStartOver}
              className="px-5 py-2.5 rounded-lg bg-[#E04F4F] hover:bg-[#c93f3f] text-xs font-bold text-white transition flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> New Assessment
            </button>
          </div>
        </div>

        {/* 5 Core Metrics Cards Grid inside Hero Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Study Cost */}
          <div className="bg-[#1A1A1A] border border-slate-800 rounded-xl p-4">
            <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">Total Study Cost</span>
            <div className="text-xl font-black text-white mt-1">{formatShortINR(totalStudyCostINR)}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {formData.durationYears || 2} Years Expenses
            </span>
          </div>

          {/* Funding Gap */}
          <div className="bg-[#1A1A1A] border border-[#E04F4F]/40 rounded-xl p-4">
            <span className="text-[11px] text-[#E04F4F] font-bold block uppercase tracking-wider">Net Funding Gap</span>
            <div className="text-xl font-black text-white mt-1">{formatShortINR(totalFundingGapINR)}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Remittance Needed</span>
          </div>

          {/* LRS TCS Shock */}
          <div className="bg-[#1A1A1A] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">LRS Outflow Shock</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E04F4F] text-white font-bold">RBI TCS</span>
            </div>
            <div className="text-xl font-black text-[#E04F4F] mt-1">
              {lrsBreakdown ? formatShortINR(lrsBreakdown.outflowShockINR) : 'Calculated'}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">TCS + Forex + Wire Fee</span>
          </div>

          {/* FOIR % Status */}
          <div className="bg-[#1A1A1A] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Co-applicant FOIR</span>
              <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full border ${foirBadgeClass}`}>
                {foirVal}%
              </span>
            </div>
            <div className={`text-xl font-black mt-1 ${foirVal < 40 ? 'text-emerald-400' : foirVal <= 55 ? 'text-amber-400' : 'text-[#E04F4F]'}`}>
              {foirVal}%
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">EMIs / Income Ratio</span>
          </div>

          {/* Document Health Readiness */}
          <div className="bg-[#1A1A1A] border border-slate-800 rounded-xl p-4">
            <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">Document Health</span>
            <div className="text-xl font-black text-white mt-1">
              {documentHealth ? documentHealth.readinessScore : '4/5 Verified'}
            </div>
            <span className="text-[10px] text-emerald-400 mt-1 block">Form 16 & UDIN Audit</span>
          </div>
        </div>

        {/* Navigation Tabs for Phase 3 Sections */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('lenders')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'lenders'
                ? 'bg-[#E04F4F] text-white'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" /> Overview & Bank Schemes ({eligibleCount} Eligible)
          </button>

          <button
            onClick={() => setActiveTab('lrs')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'lrs'
                ? 'bg-[#E04F4F] text-white'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Landmark className="w-4 h-4" /> Feature 1: LRS Tax Shock
          </button>

          <button
            onClick={() => setActiveTab('foir')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'foir'
                ? 'bg-[#E04F4F] text-white'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <PieChart className="w-4 h-4" /> Feature 2: Co-Applicant FOIR
          </button>

          <button
            onClick={() => setActiveTab('doc-health')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'doc-health'
                ? 'bg-[#E04F4F] text-white'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" /> Feature 3: Doc Health Audit
          </button>
        </div>
      </div>

      {/* OVERVIEW / LENDERS TAB: Prominently renders Bank Schemes AND Feature 1 LRS Tax Calculator */}
      {activeTab === 'lenders' && (
        <div className="space-y-8">
          {/* Prominent Feature 1 LRS Calculator on Main Dashboard */}
          <div>
            <LrsTaxCalculator initialRemittanceINR={totalFundingGapINR || 3000000} />
          </div>

          {/* Matched Bank Schemes Grid */}
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D8]">
              <div>
                <h3 className="text-xl font-black text-[#1A1A1A] flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#E04F4F]" /> Education Loan Offers & Bank Scheme Eligibility
                </h3>
                <p className="text-xs text-[#666666]">Evaluated against public & private bank underwriting criteria</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setLenderFilter('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    lenderFilter === 'all'
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-white border border-[#D9D2C9] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
                  }`}
                >
                  All ({matchedLenders.length})
                </button>
                <button
                  onClick={() => setLenderFilter('eligible')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    lenderFilter === 'eligible'
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-white border border-[#D9D2C9] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
                  }`}
                >
                  Eligible ({eligibleCount})
                </button>
                <button
                  onClick={() => setLenderFilter('collateral')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    lenderFilter === 'collateral'
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-white border border-[#D9D2C9] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
                  }`}
                >
                  Collateral
                </button>
                <button
                  onClick={() => setLenderFilter('non-collateral')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    lenderFilter === 'non-collateral'
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-white border border-[#D9D2C9] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
                  }`}
                >
                  Non-Collateral
                </button>
              </div>
            </div>

            {/* Lender Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLenders.map((lender, index) => {
                const isExpanded = expandedLenderId === (lender.lenderId || index);
                return (
                  <div
                    key={lender.lenderId || index}
                    className={`rounded-2xl border p-6 transition-all flex flex-col justify-between ${
                      lender.isEligible
                        ? 'bg-[#FFFDF9] border-[#E5E0D8]'
                        : 'bg-[#FBF8F3] border-[#E5E0D8] opacity-75'
                    }`}
                  >
                    <div>
                      {/* Bank Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h4 className="text-lg font-black text-[#1A1A1A] flex items-center gap-2">
                            {lender.lenderName}
                            <span className="text-xs px-2 py-0.5 rounded-md bg-[#F7F2EB] font-bold text-[#1A1A1A] border border-[#D9D2C9]">
                              {lender.loanType}
                            </span>
                          </h4>
                          <p className="text-[11px] text-[#666666] mt-0.5">{lender.conditionNote}</p>
                        </div>

                        {lender.isEligible ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Eligible
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-extrabold flex items-center gap-1 shrink-0">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Ineligible
                          </span>
                        )}
                      </div>

                      {/* Rates */}
                      <div className="grid grid-cols-2 gap-3 my-4 p-3.5 rounded-xl bg-[#F7F2EB] border border-[#E5E0D8]">
                        <div>
                          <span className="text-[10px] text-[#666666] uppercase font-bold block">Interest Rate</span>
                          <span className="text-base font-black text-[#1A1A1A]">{lender.interestRate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#666666] uppercase font-bold block">Min CIBIL</span>
                          <span className="text-base font-black text-[#1A1A1A]">{lender.minCibilScore}</span>
                        </div>
                      </div>

                      {/* Status Note */}
                      <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#E5E0D8] text-xs text-[#444444] mb-4">
                        <span className="font-bold text-[#1A1A1A] block mb-0.5">Underwriting Notes:</span>
                        {lender.matchReason}
                      </div>
                    </div>

                    <div>
                      {/* Required Documents */}
                      {isExpanded && lender.requiredDocuments && lender.requiredDocuments.length > 0 && (
                        <div className="mb-4 pt-3 border-t border-[#E5E0D8] text-xs space-y-1.5">
                          <span className="font-bold text-[#1A1A1A] block mb-1">Required Bank Documents:</span>
                          {lender.requiredDocuments.map((doc, dIdx) => (
                            <div key={dIdx} className="flex items-center gap-2 text-[#444444] text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E04F4F]" />
                              {doc}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => setExpandedLenderId(isExpanded ? null : (lender.lenderId || index))}
                          className="flex-1 py-2 text-xs font-bold text-[#1A1A1A] hover:bg-[#F7F2EB] border border-[#D9D2C9] rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          {isExpanded ? (
                            <>Hide Docs <ChevronUp className="w-3.5 h-3.5" /></>
                          ) : (
                            <>View Docs <ChevronDown className="w-3.5 h-3.5" /></>
                          )}
                        </button>

                        <button
                          onClick={() => alert(`Simulated application start for ${lender.lenderName} (${lender.loanType})`)}
                          className={`py-2 px-4 text-xs font-bold rounded-lg transition cursor-pointer ${
                            lender.isEligible
                              ? 'bg-[#1A1A1A] hover:bg-black text-white'
                              : 'bg-[#F7F2EB] text-[#888888] border border-[#D9D2C9]'
                          }`}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: DEDICATED FEATURE 1 LRS TAX CALCULATOR */}
      {activeTab === 'lrs' && (
        <LrsTaxCalculator initialRemittanceINR={totalFundingGapINR || 3000000} />
      )}

      {/* TAB CONTENT 3: FEATURE 2 DEBT STRESS ANALYZER */}
      {activeTab === 'foir' && (
        <DebtStressAnalyzer
          annualIncomeINR={formData.annualIncomeINR || 1800000}
          monthlyEMIsINR={formData.monthlyEMIsINR || 25000}
        />
      )}

      {/* TAB CONTENT 4: FEATURE 3 DOCUMENT HEALTH CHECKER */}
      {activeTab === 'doc-health' && (
        <DocumentHealthChecker
          declaredIncomeINR={formData.annualIncomeINR || 1800000}
          hasCollateral={formData.hasCollateral}
          uploadedDocuments={formData.uploadedDocuments}
        />
      )}
    </div>
  );
}
