import { Calendar, MapPin, Video, Clock } from 'lucide-react';
import Badge from './ui/Badge';
import { formatDate } from '../utils/helpers';

export default function InterviewCard({ interview }) {
  const jobTitle = interview.application?.job?.title || 'Interview';
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{interview.company?.name}</h3>
          <p className="text-sm text-slate-600 mt-1">{jobTitle}</p>
        </div>
        <Badge status={interview.status}>{interview.status}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4 text-sm text-slate-600">
        <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" />{formatDate(interview.date)}</span>
        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" />{interview.startTime} - {interview.endTime}</span>
        <span className="flex items-center gap-2"><Video className="w-4 h-4 text-slate-400" />{interview.mode}</span>
        {interview.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" />{interview.location}</span>}
      </div>
      <Badge status={interview.round} className="mt-3">{interview.round} Round</Badge>
    </div>
  );
}
