import { useEffect, useState } from 'react';
import { interviewService } from '../../services';
import InterviewCard from '../../components/InterviewCard';
import Pagination from '../../components/ui/Pagination';
import { PageLoader } from '../../components/ui/LoadingSkeleton';

export default function AdminInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetch = (page = 1) => {
    setLoading(true);
    interviewService.list({ page, limit: 10 }).then(({ data }) => {
      setInterviews(data.data);
      setMeta(data.meta);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Interviews</h1>
      {loading ? <PageLoader /> : (
        <>
          <div className="grid md:grid-cols-2 gap-4">{interviews.map((i) => <InterviewCard key={i._id} interview={i} />)}</div>
          <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={fetch} />
        </>
      )}
    </div>
  );
}
