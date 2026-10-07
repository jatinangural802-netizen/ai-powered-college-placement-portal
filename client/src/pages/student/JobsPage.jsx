import { useEffect, useState } from 'react';
import { jobService } from '../../services';
import JobCard from '../../components/JobCard';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { Briefcase } from 'lucide-react';
import { debounce } from '../../utils/helpers';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ search: '', location: '', employmentType: '', sort: 'newest' });
  const [loading, setLoading] = useState(true);

  const fetch = (page = 1, f = filters) => {
    setLoading(true);
    jobService.list({ page, limit: 9, ...f }).then(({ data }) => {
      setJobs(data.data);
      setMeta(data.meta);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const debouncedSearch = debounce((f) => fetch(1, f), 400);

  const updateFilter = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    if (key === 'search') debouncedSearch(next);
    else fetch(1, next);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Job Openings</h1>
      <div className="grid md:grid-cols-4 gap-4">
        <Input placeholder="Search jobs..." value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} />
        <Input placeholder="Location" value={filters.location} onChange={(e) => updateFilter('location', e.target.value)} />
        <Select value={filters.employmentType} onChange={(e) => updateFilter('employmentType', e.target.value)}>
          <option value="">All Types</option>
          <option value="Full Time">Full Time</option>
          <option value="Internship">Internship</option>
          <option value="Internship + Full Time">Internship + Full Time</option>
        </Select>
        <Select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
          <option value="newest">Newest</option>
          <option value="deadline">Deadline</option>
          <option value="salary">Salary</option>
        </Select>
      </div>
      {loading ? <PageLoader /> : jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="No jobs found" description="No companies are currently accepting applications." actionLabel="Browse Companies" onAction={() => window.location.href = '/student/companies'} />
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((j) => <JobCard key={j._id} job={j} />)}
          </div>
          <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={(p) => fetch(p)} />
        </>
      )}
    </div>
  );
}
