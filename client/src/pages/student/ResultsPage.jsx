import { useEffect, useState } from 'react';
import { resultService } from '../../services';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { Award, CheckCircle } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resultService.getMy().then(({ data }) => setResults(data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const selected = results.filter((r) => r.status === 'Selected');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Placement Results</h1>
      {selected.length > 0 && (
        <div className="card p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3 mb-4"><CheckCircle className="w-8 h-8 text-green-600" /><h2 className="text-xl font-bold text-green-800">Congratulations!</h2></div>
          {selected.map((r) => (
            <div key={r._id} className="mb-4">
              <p className="text-green-900 font-semibold text-lg">{r.company?.name}</p>
              <p className="text-green-700">{r.role || r.job?.title}</p>
              {r.package && <p className="text-green-800 font-medium mt-1">Package: {r.package}</p>}
              {r.joiningDate && <p className="text-sm text-green-600 mt-1">Joining: {formatDate(r.joiningDate)}</p>}
            </div>
          ))}
        </div>
      )}
      {results.length === 0 ? (
        <EmptyState icon={Award} title="No results yet" description="Your placement results will appear here once published." />
      ) : (
        <div className="space-y-4">
          {results.map((r) => (
            <div key={r._id} className="card p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold">{r.company?.name}</p>
                <p className="text-sm text-slate-600">{r.role || r.job?.title}</p>
                {r.package && <p className="text-sm text-green-700 mt-1">{r.package}</p>}
              </div>
              <Badge status={r.status}>{r.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
