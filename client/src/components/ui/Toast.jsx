import { CheckCircle, XCircle, Info } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export default function Toast({ message, type = 'success' }) {
  const Icon = icons[type];
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg ${colors[type]}`}>
      <Icon className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
