import { useEffect, useState } from 'react';
import { companyService } from '../../services';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const emptyForm = { name: '', industry: '', location: '', description: '', package: '', minimumCGPA: 6.5, eligibleDepartments: 'CSE,IT', status: 'Active' };

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetch = (page = 1) => {
    setLoading(true);
    companyService.list({ page, limit: 10, status: '' }).then(({ data }) => {
      setCompanies(data.data);
      setMeta(data.meta);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    const payload = { ...form, minimumCGPA: parseFloat(form.minimumCGPA), eligibleDepartments: form.eligibleDepartments.split(',').map((s) => s.trim()) };
    try {
      if (editId) await companyService.update(editId, payload);
      else await companyService.create(payload);
      toast.success(editId ? 'Updated!' : 'Created!');
      setModal(false);
      setForm(emptyForm);
      setEditId(null);
      fetch(meta.page);
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async () => {
    try {
      await companyService.remove(deleteId);
      toast.success('Company removed/deactivated');
      setDeleteId(null);
      fetch(meta.page);
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Companies</h1>
        <Button onClick={() => { setForm(emptyForm); setEditId(null); setModal(true); }}><Plus className="w-4 h-4" /> Add Company</Button>
      </div>
      {loading ? <PageLoader /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50"><tr>
              <th className="text-left p-4">Name</th><th className="text-left p-4">Industry</th><th className="text-left p-4">Location</th>
              <th className="text-left p-4">Package</th><th className="text-left p-4">Status</th><th className="p-4">Actions</th>
            </tr></thead>
            <tbody>{companies.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-4 font-medium">{c.name}</td><td className="p-4">{c.industry}</td><td className="p-4">{c.location}</td>
                <td className="p-4">{c.package}</td><td className="p-4"><Badge status={c.status}>{c.status}</Badge></td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => { setForm({ ...c, eligibleDepartments: c.eligibleDepartments?.join(',') }); setEditId(c._id); setModal(true); }} className="p-1 hover:bg-slate-100 rounded"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(c._id)} className="p-1 hover:bg-red-50 rounded text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}</tbody>
          </table>
          <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={fetch} />
        </div>
      )}
      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Company' : 'Add Company'} size="lg">
        <div className="grid md:grid-cols-2 gap-4">
          {['name', 'industry', 'location', 'package', 'minimumCGPA'].map((f) => (
            <Input key={f} label={f.charAt(0).toUpperCase() + f.slice(1)} value={form[f] || ''} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
          ))}
          <Input label="Departments (comma sep)" value={form.eligibleDepartments || ''} onChange={(e) => setForm({ ...form, eligibleDepartments: e.target.value })} className="md:col-span-2" />
          <div className="md:col-span-2"><label className="label">Description</label><textarea className="input h-24" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6"><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></div>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Company" message="This will deactivate the company if it has applications." danger confirmText="Delete" />
    </div>
  );
}
