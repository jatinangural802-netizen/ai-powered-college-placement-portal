import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button variant="secondary" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
      <Button variant="secondary" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
