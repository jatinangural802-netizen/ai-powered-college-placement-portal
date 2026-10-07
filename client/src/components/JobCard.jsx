import { Link } from 'react-router-dom';
import { MapPin, Clock, Building2 } from 'lucide-react';
import Badge from './ui/Badge';
import { formatDate } from '../utils/helpers';

export default function JobCard({ job, matchScore, showApply = true }) {
  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Link to={`/student/jobs/${job._id}`} className="text-base font-semibold text-slate-900 hover:text-primary-600">
            {job.title}
          </Link>
          <p className="text-sm text-slate-600 mt-1 flex items-center gap-1">
            <Building2 className="w-4 h-4" /> {job.company?.name}
          </p>
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
            {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
            {job.deadline && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Deadline: {formatDate(job.deadline)}</span>}
          </div>
          {job.salary && <p className="text-sm font-medium text-green-700 mt-2">{job.salary}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          {matchScore != null && (
            <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-1 rounded-full">{matchScore}% Match</span>
          )}
          <Badge status={job.employmentType}>{job.employmentType}</Badge>
        </div>
      </div>
      {showApply && (
        <Link to={`/student/jobs/${job._id}`} className="btn-primary w-full mt-4 text-center">View Details</Link>
      )}
    </div>
  );
}
