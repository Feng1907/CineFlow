import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function SectionHeader({ title, to }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="section-title mb-0">{title}</h2>
      {to && (
        <Link
          to={to}
          className="flex items-center gap-1 text-sm text-zinc-400 hover:text-brand transition-colors"
        >
          See all <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}
