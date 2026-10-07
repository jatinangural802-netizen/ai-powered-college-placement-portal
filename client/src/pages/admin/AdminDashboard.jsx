import { useEffect, useState } from 'react';
import { analyticsService } from '../../services';
import StatCard, { ChartCard } from '../../components/ui/StatCard';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import { Users, Building2, Briefcase, ClipboardList, Star, Calendar, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.admin().then(({ data: res }) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  if (!data) return null;

  const { summary, applicationsByStatus, selectionsByDepartment, companyParticipation, placementTrend } = data;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard title="Students" value={summary.totalStudents} icon={Users} />
        <StatCard title="Companies" value={summary.activeCompanies} icon={Building2} />
        <StatCard title="Open Jobs" value={summary.openJobs} icon={Briefcase} />
        <StatCard title="Applications" value={summary.totalApplications} icon={ClipboardList} />
        <StatCard title="Shortlisted" value={summary.shortlisted} icon={Star} />
        <StatCard title="Interviews" value={summary.totalInterviews} icon={Calendar} />
        <StatCard title="Selected" value={summary.selections} icon={Award} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Applications by Status">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart><Pie data={applicationsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              {applicationsByStatus?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Selections by Department">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={selectionsByDepartment}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Company Participation">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={companyParticipation} layout="vertical"><XAxis type="number" /><YAxis dataKey="name" type="category" width={100} /><Tooltip /><Bar dataKey="count" fill="#8b5cf6" /></BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Placement Trend">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={placementTrend}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-6"><p className="text-sm text-slate-500">Average Package</p><p className="text-2xl font-bold text-green-700">{summary.averagePackage} LPA</p></div>
        <div className="card p-6"><p className="text-sm text-slate-500">Highest Package</p><p className="text-2xl font-bold text-green-700">{summary.highestPackage} LPA</p></div>
      </div>
    </div>
  );
}
