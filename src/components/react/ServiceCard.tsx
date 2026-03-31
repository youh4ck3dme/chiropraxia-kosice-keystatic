interface ServiceCardProps {
  id: string;
  name: string;
  description?: string | null;
  duration: number;
  price: number;
  isExpress?: boolean;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

/**
 * Service Card Component
 * Glassmorphism card with 3D tilt effect and liquid highlight.
 * Supports an `isExpress` variant with amber styling for priority bookings.
 */
export function ServiceCard({
  id,
  name,
  description,
  duration,
  price,
  isExpress = false,
  onSelect,
  isSelected = false,
}: Readonly<ServiceCardProps>): JSX.Element {
  const buttonClass = (() => {
    if (isExpress) {
      return isSelected
        ? 'ring-2 ring-amber-400 shadow-[0_0_80px_-10px_rgba(251,191,36,0.5)] bg-amber-50/60 border-[1.5px] border-amber-400 scale-[1.02]'
        : 'hover:shadow-[0_0_60px_-15px_rgba(251,191,36,0.4)] bg-amber-50/40 border border-amber-300/60 scale-100';
    }
    return isSelected
      ? 'ring-2 ring-aurora shadow-aurora-strong bg-white/60 border-[1.5px] border-[#006fb8] scale-[1.02]'
      : 'hover:shadow-aurora bg-white/30 border border-white/50 scale-100';
  })();

  const gradientClass = (() => {
    if (isExpress) {
      return isSelected
        ? 'bg-linear-to-br from-amber-300 to-amber-400'
        : 'bg-linear-to-br from-amber-200/40 to-amber-100/20';
    }
    return isSelected
      ? 'bg-linear-to-br from-[#89CFF0] to-[#aadaf2]'
      : 'bg-linear-to-br from-[#89CFF0]/20 to-[#89CFF0]/5';
  })();

  return (
    <button
      type="button"
      onClick={() => onSelect?.(id)}
      className={`w-full text-left relative overflow-hidden cursor-pointer px-5 py-4 transition-all duration-300 ease-out rounded-3xl backdrop-blur-2xl ${buttonClass}`}
    >

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-chrome flex items-center gap-2">
            {isExpress && <span aria-hidden="true">⚡</span>}
            <span className="text-chrome font-bold">
              {name}
            </span>
          </h3>
          {isSelected && (
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-aurora text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-chrome-gray text-sm mb-2 line-clamp-2">
            {description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-glass-subtle">
          <div className="flex items-center gap-2 text-sm text-chrome-gray">
            {duration > 0 && (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span>{duration} min</span>
              </>
            )}
          </div>
          <div className="text-xl font-bold text-chrome">
            {price.toFixed(0)}€
          </div>
        </div>
      </div>

      {/* Gradient border overlay */}
      <div
        className={`absolute inset-0 pointer-events-none rounded-[inherit] p-px [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] mask-exclude [-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [-webkit-mask-composite:xor] ${gradientClass}`}
      />
    </button>
  );
}

export default ServiceCard;


