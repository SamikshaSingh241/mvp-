import React, { useState } from 'react';
import { FileText, Upload, CheckCircle2, AlertCircle, FileCheck, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';

export const ResumeUploadCard = ({ currentResumeUrl, resumeOriginalName, onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleFile = async (file) => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!file) return;

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 5MB limit. Please upload a smaller PDF or DOCX.');
      return;
    }

    // Check file extension
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    const isExtensionValid = /\.(pdf|docx|doc)$/i.test(file.name);

    if (!validTypes.includes(file.type) && !isExtensionValid) {
      setErrorMsg('Invalid format. Accepted file formats: PDF and DOCX only.');
      return;
    }

    setIsUploading(true);
    try {
      await onUploadSuccess(file);
      setSuccessMsg(`"${file.name}" uploaded successfully!`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Area */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative rounded-2xl p-6 border-2 border-dashed transition-all text-center flex flex-col items-center justify-center ${
          dragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-slate-700/80 hover:border-slate-600 bg-slate-900/40'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-3 text-blue-400">
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          ) : (
            <Upload className="w-6 h-6" />
          )}
        </div>

        <h4 className="text-sm font-semibold text-white mb-1">
          {isUploading ? 'Uploading & parsing resume...' : 'Drag & drop your resume here'}
        </h4>
        <p className="text-xs text-slate-400 mb-4">
          Accepted: <span className="text-slate-300 font-medium">PDF or DOCX</span> (Max 5MB)
        </p>

        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf,.docx,.doc"
            className="hidden"
            onChange={onInputChange}
            disabled={isUploading}
          />
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors">
            Browse Document
          </span>
        </label>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Existing Upload Status */}
      {currentResumeUrl && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-white truncate max-w-[200px]">
                {resumeOriginalName || 'Resume.pdf'}
              </p>
              <p className="text-[11px] text-emerald-400 font-medium">Active & Verified</p>
            </div>
          </div>

          <a
            href={currentResumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium"
          >
            View
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};
