import { useEffect, useState } from 'react';
import { applicationService } from '../../services';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import ApplicationTimeline from '../../components/ApplicationTimeline';
import { ClipboardList } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    applicationService.getMy().then(({ data }) => setApplications(data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
      {applications.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No applications yet" description="Start applying to jobs to track your progress here." actionLabel="Browse Jobs" onAction={() => window.location.href = '/student/jobs'} />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {applications.map((app) => (
              <div key={app._id} className={`card p-5 cursor-pointer transition-colors ${selected?._id === app._id ? 'ring-2 ring-primary-500' : 'hover:bg-slate-50'}`}
                onClick={() => setSelected(app)}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{app.company?.name}</p>
                    <p className="text-sm text-slate-600">{app.job?.title}</p>
                    <p className="text-xs text-slate-400 mt-2">Applied: {formatDate(app.appliedAt)}</p>
                  </div>
                  <Badge status={app.status}>{app.status}</Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Application Timeline</h3>
            {selected ? <ApplicationTimeline status={selected.status} /> : (
              <p className="text-sm text-slate-500">Select an application to view timeline</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
