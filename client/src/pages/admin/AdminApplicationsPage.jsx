import { useEffect, useState } from 'react';
import { applicationService, interviewService } from '../../services';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import { formatDate } from '../../utils/helpers';

const STATUSES = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [statusModal, setStatusModal] = useState(null);
  const [interviewModal, setInterviewModal] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [interviewForm, setInterviewForm] = useState({ round: 'Technical', date: '', startTime: '10:00', endTime: '11:00', mode: 'Online' });
  const toast = useToast();

  const fetch = (page = 1) => {
    setLoading(true);
    applicationService.list({ page, limit: 10 }).then(({ data }) => {
      setApplications(data.data);
      setMeta(data.meta);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async () => {
    try {
      await applicationService.updateStatus(statusModal._id, { status: newStatus });
      toast.success('Status updated');
      setStatusModal(null);
      fetch(meta.page);
    } catch (err) { toast.error(err.message); }
  };

  const scheduleInterview = async () => {
    try {
      await interviewService.schedule({ ...interviewForm, application: interviewModal._id });
      toast.success('Interview scheduled');
      setInterviewModal(null);
      fetch(meta.page);
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Applications</h1>
      {loading ? <PageLoader /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50"><tr>
              <th className="text-left p-4">Student</th><th className="text-left p-4">Company</th><th className="text-left p-4">Job</th>
              <th className="text-left p-4">Date</th><th className="text-left p-4">CGPA</th><th className="text-left p-4">Status</th><th className="p-4">Actions</th>
            </tr></thead>
            <tbody>{applications.map((a) => (
              <tr key={a._id} className="border-t">
                <td className="p-4">{a.student?.fullName}</td><td className="p-4">{a.company?.name}</td><td className="p-4">{a.job?.title}</td>
                <td className="p-4">{formatDate(a.appliedAt)}</td><td className="p-4">{a.studentCgpa ?? '—'}</td>
                <td className="p-4"><Badge status={a.status}>{a.status}</Badge></td>
                <td className="p-4 flex gap-2 flex-wrap">
                  <Button size="sm" variant="secondary" onClick={() => { setStatusModal(a); setNewStatus(a.status); }}>Status</Button>
                  <Button size="sm" onClick={() => setInterviewModal(a)}>Schedule</Button>
                </td>
              </tr>
            ))}</tbody>
          </table>
          <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={fetch} />
        </div>
      )}
      <Modal open={!!statusModal} onClose={() => setStatusModal(null)} title="Update Status">
        <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <div className="flex justify-end gap-3 mt-6"><Button variant="secondary" onClick={() => setStatusModal(null)}>Cancel</Button><Button onClick={updateStatus}>Update</Button></div>
      </Modal>
      <Modal open={!!interviewModal} onClose={() => setInterviewModal(null)} title="Schedule Interview">
        <div className="space-y-4">
          <Select label="Round" value={interviewForm.round} onChange={(e) => setInterviewForm({ ...interviewForm, round: e.target.value })}>
            {['Aptitude', 'Technical', 'HR', 'Managerial', 'Final'].map((r) => <option key={r} value={r}>{r}</option>)}
          </Select>
          <Input label="Date" type="date" value={interviewForm.date} onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start" value={interviewForm.startTime} onChange={(e) => setInterviewForm({ ...interviewForm, startTime: e.target.value })} />
            <Input label="End" value={interviewForm.endTime} onChange={(e) => setInterviewForm({ ...interviewForm, endTime: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6"><Button variant="secondary" onClick={() => setInterviewModal(null)}>Cancel</Button><Button onClick={scheduleInterview}>Schedule</Button></div>
      </Modal>
    </div>
  );
}
