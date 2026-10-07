import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService, applicationService } from '../../services';
import { useToast } from '../../context/ToastContext';
import { PageLoader } from '../../components/ui/LoadingSkeleton';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import SkillBadge from '../../components/SkillBadge';
import { formatDate } from '../../utils/helpers';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function JobDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    jobService.get(id).then(({ data: res }) => setData(res.data)).finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await applicationService.apply(id);
      toast.success('Application submitted successfully!');
      setConfirmOpen(false);
      navigate('/student/applications');
    } catch (err) {
      toast.error(err.message);
      if (err.errors?.length) toast.error(err.errors.map((e) => e.field ? `${e.field}: required ${e.required}, yours: ${e.actual}` : e).join('; '));
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!data?.job) return null;

  const { job, eligibility, matchInfo } = data;

  return (
    <div className="space-y-6 max-w-4xl">
      <Link to="/student/jobs" className="text-sm text-primary-600">← Back to Jobs</Link>
      <div className="card p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
            <p className="text-lg text-slate-600 mt-1">{job.company?.name}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge status={job.employmentType}>{job.employmentType}</Badge>
              <Badge status={job.status}>{job.status}</Badge>
            </div>
          </div>
          {job.salary && <p className="text-lg font-semibold text-green-700">{job.salary}</p>}
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-6 text-sm">
          <div><span className="text-slate-500">Location:</span> {job.location}</div>
          <div><span className="text-slate-500">Deadline:</span> {formatDate(job.deadline)}</div>
          <div><span className="text-slate-500">Openings:</span> {job.openings}</div>
          <div><span className="text-slate-500">Min CGPA:</span> {job.minimumCGPA}</div>
          <div><span className="text-slate-500">Departments:</span> {job.eligibleDepartments?.join(', ')}</div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-slate-600 whitespace-pre-wrap">{job.description}</p>
        </div>
        {job.responsibilities?.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Responsibilities</h3>
            <ul className="list-disc list-inside text-slate-600 space-y-1">{job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul>
          </div>
        )}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills?.map((s) => (
              <SkillBadge key={s} skill={s} matched={matchInfo?.matchedSkills?.includes(s.toLowerCase())} missing={matchInfo?.missingSkills?.includes(s.toLowerCase())} />
            ))}
          </div>
        </div>
        {matchInfo && (
          <div className="mt-4 p-4 bg-primary-50 rounded-lg">
            <p className="text-sm font-medium text-primary-800">Smart Job Match: {matchInfo.matchScore}%</p>
          </div>
        )}
        <div className="mt-8">
          {eligibility?.eligible ? (
            <Button onClick={() => setConfirmOpen(true)} className="w-full md:w-auto">Apply Now</Button>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                <AlertCircle className="w-5 h-5" /> You are not eligible because:
              </div>
              <ul className="space-y-1 text-sm text-red-700">
                {eligibility?.reasons?.map((r, i) => (
                  <li key={i}>• {r.field}: Required {r.required}, Yours: {r.actual}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleApply}
        title="Confirm Application" message={`Apply for ${job.title} at ${job.company?.name}?`} loading={applying} />
    </div>
  );
}
