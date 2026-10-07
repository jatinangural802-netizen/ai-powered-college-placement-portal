import { Link } from 'react-router-dom';
import { MapPin, Globe, Briefcase } from 'lucide-react';
import Badge from './ui/Badge';

export default function CompanyCard({ company }) {
  return (
    <Link to={`/student/companies/${company._id}`} className="card p-5 hover:shadow-md transition-shadow block">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-primary-700">{company.name?.[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900">{company.name}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{company.industry}</p>
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-slate-500">
            {company.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{company.location}</span>}
            {company.package && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{company.package}</span>}
          </div>
          {company.package && <p className="text-sm font-medium text-green-700 mt-2">{company.package}</p>}
        </div>
        <Badge status={company.status}>{company.status}</Badge>
      </div>
    </Link>
  );
}
