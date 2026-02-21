import { useRef } from 'react';

interface ServiceCardProps {
  id: string;
  name: string;
  description?: string | null;
  duration: number;
  price: number;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

/**
 * Service Card Component
 * Glassmorphism card with 3D tilt effect and liquid highlight
 */
export function ServiceCard({
  id,
  name,
  description,
  duration,
  price,
  onSelect,
  isSelected = false,
}: ServiceCardProps): React.ReactElement {
  const cardRef = useRef<HTMLButtonElement>(null);


  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => onSelect?.(id)}

      className={`
        w-full text-left relative overflow-hidden cursor-pointer p-6 transition-all duration-300 ease-out rounded-3xl backdrop-blur-2xl
        ${isSelected
          ? 'ring-2 ring-aurora shadow-aurora-strong bg-white/60 border-[1.5px] border-[#006fb8] scale-[1.02]'
          : 'hover:shadow-aurora bg-white/30 border border-white/50 scale-100'
        }
      `}
    >


      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-chrome flex items-center justify-between gap-2">
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
          <p className="text-chrome-gray text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-glass-subtle">
          <div className="flex items-center gap-2 text-sm text-chrome-gray">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>{duration} min</span>
          </div>
          <div className="text-xl font-bold text-chrome">
            {price.toFixed(0)}€
          </div>
        </div>
      </div>

      {/* Gradient border overlay */}
      <div
        className={`absolute inset-0 pointer-events-none rounded-[inherit] p-px [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] mask-exclude [-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [-webkit-mask-composite:xor] ${
          isSelected
            ? 'bg-linear-to-br from-[#89CFF0] to-[#aadaf2]'
            : 'bg-linear-to-br from-[#89CFF0]/20 to-[#89CFF0]/5'
        }`}
      />
    </button>
  );
}

export default ServiceCard;


