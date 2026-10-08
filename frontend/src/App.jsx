import React, { useState } from 'react';
import Header from './components/Header';
import FormWizard from './components/FormWizard';

export default function App() {
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#E04F4F] selection:text-white">
      {/* Header */}
      <Header currentStep={1} onReset={handleReset} />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <FormWizard key={resetKey} />
      </main>
    </div>
  );
}
