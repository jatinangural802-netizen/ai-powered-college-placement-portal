import { APPLICATION_STEPS } from '../utils/helpers';
import Badge from './ui/Badge';

export default function ApplicationTimeline({ status }) {
  const currentIdx = APPLICATION_STEPS.indexOf(status);
  const isRejected = status === 'Rejected' || status === 'Withdrawn';

  return (
    <div className="flex flex-col gap-0">
      {APPLICATION_STEPS.map((step, idx) => {
        const isActive = step === status;
        const isPast = currentIdx > idx;
        const isFuture = currentIdx < idx && !isRejected;
        return (
          <div key={step} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full shrink-0 ${
                isActive ? 'bg-primary-600 ring-4 ring-primary-100' :
                isPast ? 'bg-green-500' : 'bg-slate-300'
              }`} />
              {idx < APPLICATION_STEPS.length - 1 && (
                <div className={`w-0.5 h-8 ${isPast ? 'bg-green-300' : 'bg-slate-200'}`} />
              )}
            </div>
            <div className={`pb-4 ${isFuture ? 'opacity-40' : ''}`}>
              <p className={`text-sm font-medium ${isActive ? 'text-primary-700' : 'text-slate-700'}`}>{step}</p>
            </div>
          </div>
        );
      })}
      {isRejected && <Badge status={status}>{status}</Badge>}
    </div>
  );
}
