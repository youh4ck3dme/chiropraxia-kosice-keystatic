interface StatusBadgeProps {
  status: string;
}

const styles: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  confirmed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const labels: Record<string, string> = {
  pending: '⏳ Čaká',
  confirmed: '✓ Potvrdená',
  cancelled: '✕ Zrušená',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-500/20 text-gray-400'}`}>
      {labels[status] || status}
    </span>
  );
}


