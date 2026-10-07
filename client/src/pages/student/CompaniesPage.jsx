import { useEffect, useState } from 'react';
import { companyService } from '../../services';
import CompanyCard from '../../components/CompanyCard';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { Building2 } from 'lucide-react';
import { debounce } from '../../utils/helpers';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetch = (page = 1, q = search) => {
    setLoading(true);
    companyService.list({ page, limit: 9, search: q }).then(({ data }) => {
      setCompanies(data.data);
      setMeta(data.meta);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const debouncedSearch = debounce((q) => fetch(1, q), 400);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Companies</h1>
      <Input placeholder="Search companies..." value={search} onChange={(e) => { setSearch(e.target.value); debouncedSearch(e.target.value); }} />
      {loading ? <PageLoader /> : companies.length === 0 ? (
        <EmptyState icon={Building2} title="No companies found" description="No companies are currently listed." />
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((c) => <CompanyCard key={c._id} company={c} />)}
          </div>
          <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={(p) => fetch(p)} />
        </>
      )}
    </div>
  );
}
