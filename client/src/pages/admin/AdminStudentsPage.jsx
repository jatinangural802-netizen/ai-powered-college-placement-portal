import { useEffect, useState } from 'react';
import { studentService } from '../../services';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import { debounce } from '../../utils/helpers';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ search: '', department: '' });
  const [loading, setLoading] = useState(true);

  const fetch = (page = 1, f = filters) => {
    setLoading(true);
    studentService.listStudents({ page, limit: 10, ...f }).then(({ data }) => {
      setStudents(data.data);
      setMeta(data.meta);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);
  const debouncedSearch = debounce((f) => fetch(1, f), 400);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Students</h1>
      <div className="flex gap-4">
        <Input placeholder="Search..." value={filters.search} onChange={(e) => { const f = { ...filters, search: e.target.value }; setFilters(f); debouncedSearch(f); }} className="flex-1" />
        <Select value={filters.department} onChange={(e) => { const f = { ...filters, department: e.target.value }; setFilters(f); fetch(1, f); }}>
          <option value="">All Departments</option>
          {['CSE', 'IT', 'ECE', 'ME', 'CE'].map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
      </div>
      {loading ? <PageLoader /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b"><tr>
              <th className="text-left p-4 font-medium">Name</th><th className="text-left p-4">Email</th><th className="text-left p-4">ID</th>
              <th className="text-left p-4">Dept</th><th className="text-left p-4">CGPA</th><th className="text-left p-4">Profile</th>
            </tr></thead>
            <tbody>{students.map((s) => (
              <tr key={s.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-medium">{s.fullName}</td><td className="p-4">{s.email}</td><td className="p-4">{s.studentId}</td>
                <td className="p-4">{s.department}</td><td className="p-4">{s.profile?.cgpa ?? '—'}</td>
                <td className="p-4">{s.profile?.profileCompletion ?? 0}%</td>
              </tr>
            ))}</tbody>
          </table>
          <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={(p) => fetch(p)} />
        </div>
      )}
    </div>
  );
}
