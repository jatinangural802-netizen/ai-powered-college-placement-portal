import { useEffect, useState } from 'react';
import { announcementService } from '../../services';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import Badge from '../../components/ui/Badge';
import { formatDate } from '../../utils/helpers';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    announcementService.list({ limit: 50 }).then(({ data }) => setAnnouncements(data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a._id} className="card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge status={a.priority}>{a.priority}</Badge>
                  <span className="text-xs text-slate-400">{formatDate(a.createdAt)}</span>
                </div>
                <h3 className="font-semibold text-slate-900">{a.title}</h3>
                <p className="text-slate-600 mt-2 leading-relaxed">{a.content}</p>
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && <p className="text-center text-slate-500 py-12">No announcements at this time.</p>}
      </div>
    </div>
  );
}
