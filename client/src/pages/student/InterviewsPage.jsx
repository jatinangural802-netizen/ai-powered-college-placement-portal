import { useEffect, useState } from 'react';
import { interviewService } from '../../services';
import InterviewCard from '../../components/InterviewCard';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { Calendar } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewService.getMy().then(({ data }) => setInterviews(data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const upcoming = interviews.filter((i) => new Date(i.date) >= new Date() && i.status === 'Scheduled');
  const past = interviews.filter((i) => new Date(i.date) < new Date() || i.status !== 'Scheduled');

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Interviews</h1>
      {interviews.length === 0 ? (
        <EmptyState icon={Calendar} title="No interviews scheduled" description="Interviews will appear here once scheduled by the placement cell." />
      ) : (
        <>
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Upcoming ({upcoming.length})</h2>
              <div className="grid md:grid-cols-2 gap-4">{upcoming.map((i) => <InterviewCard key={i._id} interview={i} />)}</div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Past Interviews</h2>
              <div className="grid md:grid-cols-2 gap-4">{past.map((i) => <InterviewCard key={i._id} interview={i} />)}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
