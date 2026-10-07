import { useEffect, useState } from 'react';
import { analyticsService } from '../../services';
import StatCard, { ChartCard } from '../../components/ui/StatCard';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import { BarChart3, TrendingUp, Target, Award } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export default function StudentAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.student().then(({ data: res }) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  if (!data) return null;

  const { summary, statusBreakdown, scoreHistory, topMatchingSkills } = data;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">My Analytics</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Applications" value={summary.totalApplications} icon={BarChart3} />
        <StatCard title="Shortlisted" value={summary.shortlisted} icon={Target} />
        <StatCard title="Rejection Rate" value={`${summary.rejectionRate}%`} icon={TrendingUp} />
        <StatCard title="Resume Score" value={summary.resumeScore || '—'} icon={Award} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Application Status">
          {statusBreakdown?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart><Pie data={statusBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {statusBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-slate-500 text-center py-12">No data yet</p>}
        </ChartCard>
        <ChartCard title="Resume Score History">
          {scoreHistory?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={scoreHistory}>
                <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} />
                <YAxis domain={[0, 100]} /><Tooltip /><Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-slate-500 text-center py-12">Analyze your resume to see score trends</p>}
        </ChartCard>
      </div>
    </div>
  );
}
