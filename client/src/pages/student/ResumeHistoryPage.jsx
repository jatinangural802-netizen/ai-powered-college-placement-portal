import { useEffect, useState } from 'react';
import { resumeAnalysisService } from '../../services';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { History } from 'lucide-react';
import { getScoreColor, formatDate } from '../../utils/helpers';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ResumeHistoryPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resumeAnalysisService.history().then(({ data: res }) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const { analyses = [], scoreTimeline = [] } = data || {};

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Resume History</h1>
      {analyses.length === 0 ? (
        <EmptyState icon={History} title="No analysis history" description="Upload and analyze your resume to track improvement over time." actionLabel="Analyze Resume" onAction={() => window.location.href = '/student/resume-analyzer'} />
      ) : (
        <>
          {scoreTimeline.length > 1 && (
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Score Over Time</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={[...scoreTimeline].reverse()}>
                  <XAxis dataKey="version" label={{ value: 'Version', position: 'insideBottom' }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(v) => [`${v}/100`, 'Score']} labelFormatter={(l) => `Version ${l}`} />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="space-y-3">
            {analyses.map((a, i) => (
              <div key={a._id} className="card p-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Version {analyses.length - i} — {a.resume?.originalFilename || 'Resume'}</p>
                  <p className="text-sm text-slate-500">{formatDate(a.analyzedAt)}{a.job?.title ? ` · vs ${a.job.title}` : ''}</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${getScoreColor(a.score)}`}>{a.score}</p>
                  <p className="text-xs text-slate-500">/ 100</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
