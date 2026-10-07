import { useEffect, useState } from 'react';
import { driveService, companyService } from '../../services';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { Plus } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export default function AdminDrivesPage() {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ company: '', title: '', description: '', driveDate: '', applicationDeadline: '', location: '', mode: 'On-Campus', status: 'open' });
  const toast = useToast();

  const fetch = () => driveService.list({ limit: 50 }).then(({ data }) => setDrives(data.data));
  useEffect(() => {
    fetch();
    companyService.list({ limit: 100, status: '' }).then(({ data }) => setCompanies(data.data));
  }, []);

  const handleSave = async () => {
    try {
      await driveService.create(form);
      toast.success('Drive created!');
      setModal(false);
      fetch();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between"><h1 className="text-2xl font-bold">Placement Drives</h1>
        <Button onClick={() => setModal(true)}><Plus className="w-4 h-4" /> Create Drive</Button></div>
      <div className="grid md:grid-cols-2 gap-4">{drives.map((d) => (
        <div key={d._id} className="card p-5">
          <div className="flex justify-between mb-2"><h3 className="font-semibold">{d.title}</h3><Badge status={d.status}>{d.status}</Badge></div>
          <p className="text-sm text-slate-600">{d.company?.name}</p>
          <p className="text-xs text-slate-400 mt-2">Drive: {formatDate(d.driveDate)} · Deadline: {formatDate(d.applicationDeadline)}</p>
        </div>
      ))}</div>
      <Modal open={modal} onClose={() => setModal(false)} title="Create Placement Drive" size="lg">
        <div className="grid md:grid-cols-2 gap-4">
          <Select label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}>
            <option value="">Select</option>{companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </Select>
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Drive Date" type="date" value={form.driveDate} onChange={(e) => setForm({ ...form, driveDate: e.target.value })} />
          <Input label="Deadline" type="date" value={form.applicationDeadline} onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })} />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Select label="Mode" value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
            {['On-Campus', 'Off-Campus', 'Hybrid', 'Virtual'].map((m) => <option key={m} value={m}>{m}</option>)}
          </Select>
        </div>
        <div className="flex justify-end gap-3 mt-6"><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button onClick={handleSave}>Create</Button></div>
      </Modal>
    </div>
  );
}
