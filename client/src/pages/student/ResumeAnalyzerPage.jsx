import { useEffect, useState } from 'react';
import { resumeService, resumeAnalysisService, jobService } from '../../services';
import { useToast } from '../../context/ToastContext';
import FileUpload from '../../components/ui/FileUpload';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { ResumeScore } from '../../components/ui/StatCard';
import SkillBadge from '../../components/SkillBadge';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import { getScoreColor } from '../../utils/helpers';
import { Upload, Search, Download, Brain, AlertTriangle } from 'lucide-react';

const STEPS = ['Upload Resume', 'Extract Text', 'Analyze', 'View Score', 'Skill Match', 'Suggestions'];

const SECTION_LABELS = {
  contactInformation: 'Contact Information',
  summary: 'Summary',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  experience: 'Experience',
  certifications: 'Certifications',
  links: 'Links',
  formatting: 'Formatting',
};

const SECTION_MAX = {
  contactInformation: 10, summary: 5, education: 15, skills: 20,
  projects: 20, experience: 20, certifications: 5, links: 5, formatting: 5,
};

export default function ResumeAnalyzerPage() {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const toast = useToast();

  useEffect(() => {
    resumeService.getMy().then(({ data }) => {
      if (data.data?.[0]) { setResume(data.data[0]); setStep(2); }
    });
    jobService.list({ limit: 50 }).then(({ data }) => setJobs(data.data));
    resumeAnalysisService.aiStatus().then(({ data }) => setAiStatus(data.data));
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStep(1);
    try {
      const { data } = await resumeService.upload(file);
      setResume(data.data);
      setStep(2);
      toast.success('Resume uploaded and text extracted!');
      setTimeout(() => handleAnalyze(data.data._id), 500);
    } catch (err) {
      toast.error(err.message);
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (resumeId = resume?._id) => {
    if (!resumeId) return;
    setLoading(true);
    setStep(3);
    try {
      const { data } = await resumeAnalysisService.analyze(resumeId, selectedJob || undefined);
      setAnalysis(data.data);
      setStep(5);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  const record = analysis?.analysis;
  const ai = analysis?.ai;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Resume Analyzer</h1>
          <p className="text-slate-500 mt-1">Upload, analyze, and improve your resume with ATS scoring</p>
        </div>
        {record && (
          <Button variant="secondary" onClick={handlePrint}><Download className="w-4 h-4" /> Download Report</Button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex flex-wrap gap-2 no-print">
        {STEPS.map((s, i) => (
          <div key={s} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${i <= step ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs">{i + 1}</span>{s}
          </div>
        ))}
      </div>

      {aiStatus && !aiStatus.available && (
        <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 no-print">
          <Brain className="w-5 h-5" />
          AI enhancement is unavailable. Configure AI_PROVIDER and AI_API_KEY for AI suggestions. Basic ATS analysis works without AI.
        </div>
      )}

      {/* Step 1: Upload */}
      {step <= 1 && (
        <div className="max-w-xl no-print">
          <FileUpload file={file} onFileSelect={setFile} onClear={() => setFile(null)} />
          {file && <Button onClick={handleUpload} className="mt-4 w-full" disabled={loading}>{loading ? 'Uploading...' : 'Upload & Extract'}</Button>}
        </div>
      )}

      {/* Job selection for matching */}
      {resume && step >= 2 && (
        <div className="card p-4 flex flex-wrap gap-4 items-end no-print">
          <Select label="Analyze against job (optional)" value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} className="flex-1 min-w-[200px]">
            <option value="">General Analysis</option>
            {jobs.map((j) => <option key={j._id} value={j._id}>{j.title} — {j.company?.name}</option>)}
          </Select>
          <Button onClick={() => handleAnalyze()} disabled={loading}>
            <Search className="w-4 h-4" /> {loading ? 'Analyzing...' : 'Analyze Resume'}
          </Button>
        </div>
      )}

      {loading && step >= 2 && <PageLoader />}

      {/* Analysis Results */}
      {record && !loading && (
        <div id="resume-report" className="space-y-6">
          <div className="card p-8 text-center print-only">
            <h1 className="text-2xl font-bold">CareerBridge Resume Analysis Report</h1>
            <p className="text-slate-500 mt-2">{new Date(record.analyzedAt).toLocaleDateString()}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-8 flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold mb-4">ATS Score</h2>
              <ResumeScore score={record.score} />
            </div>
            {record.jobMatchScore != null && (
              <div className="card p-8 flex flex-col items-center justify-center">
                <h2 className="text-lg font-semibold mb-4">Job Match Score</h2>
                <ResumeScore score={record.jobMatchScore} />
              </div>
            )}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Section Scores</h3>
              <div className="space-y-3">
                {Object.entries(record.sectionScores || {}).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{SECTION_LABELS[key] || key}</span>
                      <span className={getScoreColor((val / (SECTION_MAX[key] || 10)) * 100)}>{val}/{SECTION_MAX[key] || 10}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${(val / (SECTION_MAX[key] || 10)) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {analysis?.partialExtraction && (
            <div className="flex items-center gap-2 p-4 bg-amber-50 rounded-lg text-sm text-amber-800">
              <AlertTriangle className="w-5 h-5" /> Some information could not be automatically detected.
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold text-green-700 mb-3">Strengths</h3>
              <ul className="space-y-2">{record.strengths?.map((s, i) => <li key={i} className="text-sm text-slate-600 flex gap-2"><span className="text-green-500">✓</span>{s}</li>)}</ul>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-red-700 mb-3">Weaknesses</h3>
              <ul className="space-y-2">{record.weaknesses?.map((s, i) => <li key={i} className="text-sm text-slate-600 flex gap-2"><span className="text-red-500">✗</span>{s}</li>)}</ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold mb-3">Matched Skills</h3>
              <div className="flex flex-wrap gap-2">{record.matchedSkills?.map((s) => <SkillBadge key={s} skill={s} matched />)}</div>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold mb-3">Missing Skills</h3>
              <div className="flex flex-wrap gap-2">{record.missingSkills?.length > 0 ? record.missingSkills.map((s) => <SkillBadge key={s} skill={s} missing />) : <p className="text-sm text-slate-500">No missing required skills</p>}</div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-3">Improvement Suggestions</h3>
            <ul className="space-y-2">{record.suggestions?.map((s, i) => <li key={i} className="text-sm text-slate-600 flex gap-2"><span className="text-primary-500 font-bold">{i + 1}.</span>{s}</li>)}</ul>
          </div>

          {ai?.available && ai?.suggestions && (
            <div className="card p-6 border-primary-200 bg-primary-50/50">
              <div className="flex items-center gap-2 mb-4"><Brain className="w-5 h-5 text-primary-600" /><h3 className="font-semibold text-primary-800">AI Enhancement</h3></div>
              {ai.suggestions.summary && <p className="text-sm text-slate-700 mb-4">{ai.suggestions.summary}</p>}
              {ai.suggestions.suggestions?.map((s, i) => <p key={i} className="text-sm text-slate-600 mb-1">• {s}</p>)}
            </div>
          )}

          {ai && !ai.available && ai.message && (
            <div className="card p-4 text-sm text-slate-600 bg-slate-50">{ai.message}</div>
          )}
        </div>
      )}
    </div>
  );
}
