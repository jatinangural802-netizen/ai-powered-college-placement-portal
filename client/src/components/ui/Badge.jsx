import { STATUS_COLORS } from '../../utils/helpers';

export default function Badge({ status, children }) {
  const color = STATUS_COLORS[status] || STATUS_COLORS[children] || 'bg-slate-100 text-slate-700';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {children || status}
    </span>
  );
}
