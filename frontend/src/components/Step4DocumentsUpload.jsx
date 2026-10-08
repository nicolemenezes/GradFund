import React, { useState, useRef } from 'react';
import { FileCheck, UploadCloud, CheckCircle2, Trash2, FileText, ArrowLeft, AlertCircle, Loader2, Lock } from 'lucide-react';
import DocumentHealthChecker from './DocumentHealthChecker';
import { useToast } from '../context/ToastContext';

const MANDATORY_DOCS = [
  { id: 'itr', title: 'Income Tax Returns (ITR)', subtitle: 'Last 3 Years for Co-applicant (Form 16)' },
  { id: 'bank', title: 'Bank Account Statements', subtitle: 'Last 6 Months Bank Statements with salary/business credit' },
  { id: 'ca_networth', title: 'CA Net Worth Certificate', subtitle: 'Includes 18-digit UDIN & Property Valuation breakdown' },
  { id: 'admission', title: 'University Admission Letter', subtitle: 'Official Offer Letter with Tuition Breakdown' },
  { id: 'academic', title: 'Academic Marksheets & Degree', subtitle: '10th, 12th & Graduation Certificates' },
  { id: 'property', title: 'Property Legal Deeds', subtitle: 'Title Deed & Encumbrance (If Collateral Selected)', conditional: true }
];

export default function Step4DocumentsUpload({ formData, updateFormData, onSubmitAssessment, isLoading, onBack }) {
  const [dragActive, setDragActive] = useState(false);
  const [targetDocTitle, setTargetDocTitle] = useState('');
  const fileInputRef = useRef(null);
  const toast = useToast();

  const uploadedFiles = formData.uploadedDocuments || [];
  const requiredDocsList = MANDATORY_DOCS.filter(d => !d.conditional || formData.hasCollateral);
  const minRequiredCount = 4;
  const isRequirementMet = uploadedFiles.length >= minRequiredCount;

  // Trigger hidden native file input for specific document type button
  const handleTriggerNativeFileInput = (docTitle) => {
    setTargetDocTitle(docTitle);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Trigger hidden native file input for general dropzone click
  const handleDropzoneClick = () => {
    setTargetDocTitle('General Uploaded Document');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle files selected via native File Explorer dialog
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const newDocs = selectedFiles.map((file, idx) => {
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        const displaySize = file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(1)} KB`
          : `${sizeInMB} MB`;

        return {
          id: Date.now() + Math.random() + idx,
          title: targetDocTitle || 'Uploaded Document',
          name: file.name,
          size: displaySize,
          uploadedAt: new Date().toLocaleTimeString()
        };
      });

      updateFormData({
        uploadedDocuments: [...uploadedFiles, ...newDocs]
      });

      if (newDocs.length === 1) {
        toast.success(`Attached document: ${newDocs[0].name}`);
      } else {
        toast.success(`Attached ${newDocs.length} documents successfully`);
      }

      // Reset file input value so re-selecting same file triggers onChange
      e.target.value = '';
    }
  };

  const handleRemoveFile = (fileId) => {
    const fileToRemove = uploadedFiles.find((f) => f.id === fileId);
    const updated = uploadedFiles.filter((f) => f.id !== fileId);
    updateFormData({ uploadedDocuments: updated });

    if (fileToRemove) {
      toast.info(`Removed document: ${fileToRemove.name}`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const newDocs = droppedFiles.map((file, idx) => {
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        const displaySize = file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(1)} KB`
          : `${sizeInMB} MB`;

        return {
          id: Date.now() + Math.random() + idx,
          title: 'Custom Drag & Drop File',
          name: file.name,
          size: displaySize,
          uploadedAt: new Date().toLocaleTimeString()
        };
      });

      updateFormData({
        uploadedDocuments: [...uploadedFiles, ...newDocs]
      });

      toast.success(`Dropped and attached ${newDocs.length} document(s)`);
    }
  };

  const handleSubmitClick = () => {
    if (!isRequirementMet) {
      toast.warning(`Please attach at least ${minRequiredCount} mandatory documents (${uploadedFiles.length}/${minRequiredCount} attached)`);
      return;
    }
    onSubmitAssessment();
  };

  return (
    <div className="space-y-8">
      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        style={{ display: 'none' }}
      />

      {/* Upload Zone & Documents List */}
      <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E0D8]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F7F2EB] text-[#1A1A1A]">
              <FileCheck className="w-5 h-5 text-[#E04F4F]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1A1A1A]">Document Checklist & Verification Upload</h3>
              <p className="text-xs text-[#666666]">Attach mandatory files for instant underwriting audit & score verification</p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-lg bg-[#F7F2EB] border border-[#D9D2C9] text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isRequirementMet ? 'bg-emerald-500' : 'bg-[#E04F4F]'}`} />
            {uploadedFiles.length}/{minRequiredCount} Mandatory Docs Attached
          </div>
        </div>

        {/* Drag and Drop Zone - Clickable to open File Explorer */}
        <div
          onClick={handleDropzoneClick}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer ${dragActive
              ? 'border-[#1A1A1A] bg-[#F7F2EB]'
              : 'border-[#D9D2C9] bg-[#FFFDF9] hover:border-[#1A1A1A]'
            }`}
        >
          <UploadCloud className="w-10 h-10 text-[#E04F4F] mx-auto mb-3" />
          <h4 className="text-sm font-bold text-[#1A1A1A] mb-1">
            Click here or Drag & Drop loan verification documents
          </h4>
          <p className="text-xs text-[#777777] mb-4">
            PDF, JPG, PNG up to 10MB (ITRs, Form 16, CA Net Worth Certificate with UDIN, Bank Statements)
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
            {requiredDocsList.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => handleTriggerNativeFileInput(doc.title)}
                className="px-3.5 py-2 rounded-lg bg-white border border-[#D9D2C9] hover:border-[#1A1A1A] text-xs font-bold text-[#1A1A1A] transition cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                + Attach {doc.title}
              </button>
            ))}
          </div>
        </div>

        {/* Attached Files List */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
              Attached Documents ({uploadedFiles.length})
            </h4>
            {!isRequirementMet && (
              <span className="text-xs text-[#E04F4F] font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Attach at least {minRequiredCount} documents to proceed
              </span>
            )}
          </div>

          {uploadedFiles.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-[#FFFDF9] border border-[#E5E0D8] text-[#777777] text-xs font-medium">
              No documents attached yet. Click the attachment buttons above or drop files to select from your computer.
            </div>
          ) : (
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFFDF9] border border-[#E5E0D8] text-xs transition hover:border-[#1A1A1A]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-[#F7F2EB] text-[#1A1A1A] shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#1A1A1A] truncate">{file.name}</p>
                      <p className="text-[11px] text-[#777777]">
                        {file.title} • {file.size} • Uploaded {file.uploadedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.id)}
                      className="p-1.5 rounded-lg text-[#777777] hover:text-[#E04F4F] hover:bg-[#F7F2EB] transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feature 3 Integration: Indian Tax & Net Worth Document Health Checker */}
      <DocumentHealthChecker
        declaredIncomeINR={formData.annualIncomeINR}
        hasCollateral={formData.hasCollateral}
        uploadedDocuments={uploadedFiles}
      />

      {/* Navigation & Submit CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 rounded-lg border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex flex-col sm:items-end w-full sm:w-auto">
          {!isRequirementMet && (
            <p className="text-xs text-[#E04F4F] font-bold mb-1.5 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Attach at least 4 mandatory documents to unlock ({uploadedFiles.length}/4)
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmitClick}
            disabled={isLoading}
            className={`w-full sm:w-auto px-9 py-3.5 rounded-lg font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-sm ${
              isRequirementMet && !isLoading
                ? 'bg-[#1A1A1A] hover:bg-black text-white cursor-pointer'
                : 'bg-gray-200 text-gray-500 border border-gray-300 cursor-pointer'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Calculating Assessment & Matching Lenders...
              </>
            ) : !isRequirementMet ? (
              <>
                <Lock className="w-4 h-4" />
                Attach All 4 Required Docs ({uploadedFiles.length}/4)
              </>
            ) : (
              'Calculate & Match Lenders →'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
