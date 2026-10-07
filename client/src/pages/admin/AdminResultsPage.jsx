import { useEffect, useState } from 'react';
import { resultService, studentService, companyService, jobService } from '../../services';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import { Plus } from 'lucide-react';

export default function AdminResultsPage() {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ student: '', company: '', role: '', status: 'Selected', package: '' });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetch = (page = 1) => {
    setLoading(true);
    resultService.list({ page, limit: 10 }).then(({ data }) => { setResults(data.data); setMeta(data.meta); }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch();
    studentService.listStudents({ limit: 100 }).then(({ data }) => setStudents(data.data));
    companyService.list({ limit: 100, status: '' }).then(({ data }) => setCompanies(data.data));
  }, []);

  const handleSave = async () => {
    try {
      await resultService.create(form);
      toast.success('Result published!');
      setModal(false);
      fetch(meta.page);
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between"><h1 className="text-2xl font-bold">Results</h1>
        <Button onClick={() => setModal(true)}><Plus className="w-4 h-4" /> Publish Result</Button></div>
      {loading ? <PageLoader /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50"><tr>
              <th className="text-left p-4">Student</th><th className="text-left p-4">Company</th><th className="text-left p-4">Role</th>
              <th className="text-left p-4">Package</th><th className="text-left p-4">Status</th>
            </tr></thead>
            <tbody>{results.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-4">{r.student?.fullName}</td><td className="p-4">{r.company?.name}</td>
                <td className="p-4">{r.role}</td><td className="p-4">{r.package}</td>
                <td className="p-4"><Badge status={r.status}>{r.status}</Badge></td>
              </tr>
            ))}</tbody>
          </table>
          <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={fetch} />
        </div>
      )}
      <Modal open={modal} onClose={() => setModal(false)} title="Publish Result">
        <div className="space-y-4">
          <Select label="Student" value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })}>
            <option value="">Select</option>{students.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
          </Select>
          <Select label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}>
            <option value="">Select</option>{companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </Select>
          <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          <Input label="Package" value={form.package} onChange={(e) => setForm({ ...form, package: e.target.value })} />
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {['Selected', 'Rejected', 'Waitlisted', 'Pending'].map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
        <div className="flex justify-end gap-3 mt-6"><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button onClick={handleSave}>Publish</Button></div>
      </Modal>
    </div>
  );
}
