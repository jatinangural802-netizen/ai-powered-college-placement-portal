import { useEffect, useState } from 'react';
import { announcementService } from '../../services';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { Plus } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', priority: 'Normal' });
  const toast = useToast();

  const fetch = () => announcementService.list({ limit: 50, activeOnly: false }).then(({ data }) => setAnnouncements(data.data));
  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    try {
      await announcementService.create(form);
      toast.success('Announcement created!');
      setModal(false);
      setForm({ title: '', content: '', priority: 'Normal' });
      fetch();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between"><h1 className="text-2xl font-bold">Announcements</h1>
        <Button onClick={() => setModal(true)}><Plus className="w-4 h-4" /> Create</Button></div>
      <div className="space-y-4">{announcements.map((a) => (
        <div key={a._id} className="card p-5">
          <div className="flex items-center gap-2 mb-2"><Badge status={a.priority}>{a.priority}</Badge></div>
          <h3 className="font-semibold">{a.title}</h3>
          <p className="text-sm text-slate-600 mt-2">{a.content}</p>
        </div>
      ))}</div>
      <Modal open={modal} onClose={() => setModal(false)} title="Create Announcement">
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div><label className="label">Content</label><textarea className="input h-32" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
          <Select label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            {['Normal', 'Important', 'Urgent'].map((p) => <option key={p} value={p}>{p}</option>)}
          </Select>
        </div>
        <div className="flex justify-end gap-3 mt-6"><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button onClick={handleSave}>Create</Button></div>
      </Modal>
    </div>
  );
}
