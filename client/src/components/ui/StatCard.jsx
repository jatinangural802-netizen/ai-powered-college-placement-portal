import { getScoreColor, getScoreBg } from '../../utils/helpers';

export default function StatCard({ title, value, icon: Icon, subtitle, trend }) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
        </div>
        {Icon && (
          <div className="p-3 rounded-lg bg-primary-50">
            <Icon className="w-6 h-6 text-primary-600" />
          </div>
        )}
      </div>
    </div>
  );
}

export function ResumeScore({ score, size = 'lg' }) {
  const sizes = { sm: 'text-2xl', md: 'text-3xl', lg: 'text-5xl' };
  return (
    <div className="text-center">
      <div className={`font-bold ${sizes[size]} ${getScoreColor(score)}`}>{score}</div>
      <div className="text-sm text-slate-500 mt-1">/ 100</div>
      <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
        <div className={`h-2 rounded-full transition-all ${getScoreBg(score)}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export function ChartCard({ title, children }) {
  return (
    <div className="card p-6">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}
