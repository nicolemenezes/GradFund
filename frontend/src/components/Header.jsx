import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function Header({ onReset }) {
  return (
    <header className="border-b border-[#E5E0D8] bg-[#FBF8F3]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-[#1A1A1A]">
                GradFund
              </span>
              <span className="w-2 h-2 rounded-full bg-[#E04F4F]" />
            </div>
            <p className="text-[11px] font-medium text-[#666666]">Education Loan Assessment Engine</p>
          </div>
        </div>

        {/* Minimalist Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#444444]">
          <span className="text-[#1A1A1A] font-semibold cursor-pointer border-b-2 border-[#1A1A1A] pb-1">
            Loan Assessment
          </span>
          <a href="#lenders" className="hover:text-[#1A1A1A] transition">
            Partner Lenders
          </a>
          <a href="#documents" className="hover:text-[#1A1A1A] transition">
            Required Documents
          </a>
          <a href="#how-it-works" className="hover:text-[#1A1A1A] transition">
            How It Works
          </a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="px-5 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold tracking-wide transition cursor-pointer shadow-sm"
          >
            New Assessment
          </button>
        </div>
      </div>
    </header>
  );
}
