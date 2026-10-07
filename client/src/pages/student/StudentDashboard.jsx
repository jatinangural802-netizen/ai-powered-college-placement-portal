import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Star, Calendar, CheckCircle, FileText, TrendingUp } from 'lucide-react';
import { studentService } from '../../services';
import StatCard, { ChartCard } from '../../components/ui/StatCard';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import JobCard from '../../components/JobCard';
import InterviewCard from '../../components/InterviewCard';
import Badge from '../../components/ui/Badge';
import { formatDate, FIELD_LABELS } from '../../utils/helpers';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.getDashboard().then(({ data: res }) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  if (!data) return null;

  const { user, profile, stats, upcomingInterviews, recentApplications, recommendedJobs, selection, announcements, charts } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {user.fullName}</h1>
        <p className="text-slate-500 mt-1">Here's your placement progress overview</p>
      </div>

      {selection && (
        <div className="card p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-lg font-bold text-green-800">Congratulations!</h2>
          </div>
          <p className="text-green-700">You have been selected for:</p>
          <p className="font-semibold text-green-900 mt-1">{selection.company?.name} — {selection.role || selection.job?.title}</p>
          {selection.package && <p className="text-green-700 mt-1">Package: {selection.package}</p>}
        </div>
      )}

      {profile && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900">Profile Completion</h3>
            <span className="text-sm font-medium text-primary-600">{profile.profileCompletion}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div className="bg-primary-600 h-3 rounded-full transition-all" style={{ width: `${profile.profileCompletion}%` }} />
          </div>
          {profile.missingFields?.length > 0 && (
            <p className="text-xs text-slate-500 mt-2">
              Missing: {profile.missingFields.slice(0, 5).map((f) => FIELD_LABELS[f] || f).join(', ')}
              {profile.missingFields.length > 5 && '...'}
              <Link to="/student/profile" className="text-primary-600 ml-2">Complete profile →</Link>
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Applications" value={stats.totalApplications} icon={Briefcase} />
        <StatCard title="Shortlisted" value={stats.shortlisted} icon={Star} />
        <StatCard title="Interviews" value={stats.interviews} icon={Calendar} />
        <StatCard title="Selected" value={stats.selected} icon={CheckCircle} />
        <StatCard title="ATS Score" value={stats.atsScore || '—'} icon={FileText} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Application Status">
          {charts.statusDistribution?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={charts.statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {charts.statusDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-slate-500 text-center py-8">No applications yet</p>}
        </ChartCard>
        <ChartCard title="Placement Funnel">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={charts.funnel}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Upcoming Interviews</h2>
            <Link to="/student/interviews" className="text-sm text-primary-600">View all</Link>
          </div>
          {upcomingInterviews?.length > 0 ? (
            <div className="space-y-4">{upcomingInterviews.map((i) => <InterviewCard key={i._id} interview={i} />)}</div>
          ) : <div className="card p-8 text-center text-sm text-slate-500">No upcoming interviews</div>}
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Applications</h2>
            <Link to="/student/applications" className="text-sm text-primary-600">View all</Link>
          </div>
          <div className="card divide-y divide-slate-100">
            {recentApplications?.length > 0 ? recentApplications.map((app) => (
              <div key={app._id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{app.company?.name}</p>
                  <p className="text-sm text-slate-500">{app.job?.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(app.appliedAt)}</p>
                </div>
                <Badge status={app.status}>{app.status}</Badge>
              </div>
            )) : <p className="p-8 text-center text-sm text-slate-500">No applications yet</p>}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Recommended for You</h2>
          <Link to="/student/jobs" className="text-sm text-primary-600">Browse all jobs</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedJobs?.map((job) => <JobCard key={job._id} job={job} matchScore={job.matchScore} />)}
        </div>
      </div>

      {announcements?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Announcements</h2>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a._id} className="card p-4 flex items-start gap-3">
                <Badge status={a.priority}>{a.priority}</Badge>
                <div>
                  <p className="font-medium text-slate-900">{a.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{a.content.slice(0, 150)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
