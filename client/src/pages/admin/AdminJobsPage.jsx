import { useEffect, useState } from 'react';
import { jobService, companyService } from '../../services';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import { Plus } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const emptyForm = { title: '', company: '', description: '', salary: '', location: '', minimumCGPA: 6.5, requiredSkills: '', deadline: '', employmentType: 'Full Time', openings: 5, status: 'Open' };

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetch = (page = 1) => {
    setLoading(true);
    jobService.list({ page, limit: 10, admin: true, status: '' }).then(({ data }) => {
      setJobs(data.data);
      setMeta(data.meta);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch();
    companyService.list({ limit: 100, status: '' }).then(({ data }) => setCompanies(data.data));
  }, []);

  const handleSave = async () => {
    const payload = {
      ...form,
      minimumCGPA: parseFloat(form.minimumCGPA),
      openings: parseInt(form.openings, 10),
      requiredSkills: form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      eligibleDepartments: ['CSE', 'IT', 'ECE'],
      graduationYears: [2026],
    };
    try {
      if (editId) await jobService.update(editId, payload);
      else await jobService.create(payload);
      toast.success('Saved!');
      setModal(false);
      fetch(meta.page);
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between"><h1 className="text-2xl font-bold">Jobs</h1>
        <Button onClick={() => { setForm(emptyForm); setEditId(null); setModal(true); }}><Plus className="w-4 h-4" /> Add Job</Button></div>
      {loading ? <PageLoader /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50"><tr>
              <th className="text-left p-4">Title</th><th className="text-left p-4">Company</th><th className="text-left p-4">Deadline</th><th className="text-left p-4">Status</th><th className="p-4">Actions</th>
            </tr></thead>
            <tbody>{jobs.map((j) => (
              <tr key={j._id} className="border-t">
                <td className="p-4 font-medium">{j.title}</td><td className="p-4">{j.company?.name}</td>
                <td className="p-4">{formatDate(j.deadline)}</td><td className="p-4"><Badge status={j.status}>{j.status}</Badge></td>
                <td className="p-4"><Button size="sm" variant="secondary" onClick={() => { setForm({ ...j, company: j.company?._id, requiredSkills: j.requiredSkills?.join(', '), deadline: j.deadline?.slice(0, 10) }); setEditId(j._id); setModal(true); }}>Edit</Button></td>
              </tr>
            ))}</tbody>
          </table>
          <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={fetch} />
        </div>
      )}
      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Job' : 'Add Job'} size="lg">
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Select label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}>
            <option value="">Select</option>{companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </Select>
          <Input label="Salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          <Input label="Skills (comma sep)" value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} className="md:col-span-2" />
          <div className="md:col-span-2"><label className="label">Description</label><textarea className="input h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6"><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></div>
      </Modal>
    </div>
  );
}
