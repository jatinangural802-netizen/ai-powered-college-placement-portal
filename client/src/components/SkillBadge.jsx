export default function SkillBadge({ skill, matched, missing }) {
  let cls = 'bg-slate-100 text-slate-700';
  if (matched) cls = 'bg-green-100 text-green-800';
  if (missing) cls = 'bg-red-100 text-red-800';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${cls}`}>
      {matched && '✓ '}{missing && '✗ '}{skill}
    </span>
  );
}
