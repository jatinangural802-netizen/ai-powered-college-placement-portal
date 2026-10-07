import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { companyService, jobService } from '../../services';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import JobCard from '../../components/JobCard';
import Badge from '../../components/ui/Badge';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      companyService.get(id),
      jobService.list({ company: id, limit: 20 }),
    ]).then(([cRes, jRes]) => {
      setCompany(cRes.data.data);
      setJobs(jRes.data.data);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (!company) return null;

  return (
    <div className="space-y-6">
      <Link to="/student/companies" className="text-sm text-primary-600">← Back to Companies</Link>
      <div className="card p-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-700">{company.name[0]}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{company.name}</h1>
            <p className="text-slate-500 mt-1">{company.industry} · {company.location}</p>
            <div className="flex gap-2 mt-3">
              <Badge status={company.status}>{company.status}</Badge>
              {company.package && <span className="text-sm font-medium text-green-700">{company.package}</span>}
            </div>
          </div>
        </div>
        <p className="mt-6 text-slate-600 leading-relaxed">{company.description}</p>
        <div className="grid md:grid-cols-3 gap-4 mt-6 text-sm">
          <div><span className="text-slate-500">Min CGPA:</span> <span className="font-medium">{company.minimumCGPA}</span></div>
          <div><span className="text-slate-500">Departments:</span> <span className="font-medium">{company.eligibleDepartments?.join(', ')}</span></div>
          {company.website && <div><a href={company.website} target="_blank" rel="noreferrer" className="text-primary-600">Visit Website →</a></div>}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Open Positions ({jobs.length})</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((j) => <JobCard key={j._id} job={j} />)}
        </div>
      </div>
    </div>
  );
}
