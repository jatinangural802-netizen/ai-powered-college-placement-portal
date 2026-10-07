import { Upload, FileText, X } from 'lucide-react';

export default function FileUpload({ onFileSelect, accept = '.pdf', label = 'Upload PDF Resume', file, onClear }) {
  return (
    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
      {file ? (
        <div className="flex items-center justify-center gap-3">
          <FileText className="w-8 h-8 text-primary-600" />
          <div className="text-left">
            <p className="text-sm font-medium text-slate-900">{file.name}</p>
            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          {onClear && (
            <button onClick={onClear} className="p-1 hover:bg-slate-100 rounded" aria-label="Remove file">
              <X className="w-4 h-4 text-slate-500" />
            </button>
          )}
        </div>
      ) : (
        <>
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700 mb-1">{label}</p>
          <p className="text-xs text-slate-500 mb-4">PDF only, max 5MB</p>
          <label className="btn-primary cursor-pointer inline-flex">
            Choose File
            <input type="file" accept={accept} className="hidden" onChange={(e) => e.target.files[0] && onFileSelect(e.target.files[0])} />
          </label>
        </>
      )}
    </div>
  );
}
