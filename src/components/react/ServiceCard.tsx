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
      className={`relative w-full cursor-pointer overflow-hidden rounded-3xl p-6 text-left backdrop-blur-2xl transition-all duration-300 ease-out ${
        isSelected
          ? 'ring-aurora shadow-aurora-strong scale-[1.02] border-[1.5px] border-[#006fb8] bg-white/60 ring-2'
          : 'hover:shadow-aurora scale-100 border border-white/50 bg-white/30'
      } `}
    >
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-chrome flex items-center justify-between gap-2 text-xl font-bold">
            <span className="text-chrome font-bold">{name}</span>
          </h3>
          {isSelected && (
            <span className="bg-aurora flex h-6 w-6 items-center justify-center rounded-full text-white">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M5 12l5 5L20 7" />
              </svg>
            </span>
          )}
        </div>

        {/* Description */}
        {description && <p className="text-chrome-gray mb-4 line-clamp-2 text-sm">{description}</p>}

        {/* Footer */}
        <div className="border-glass-subtle flex items-center justify-between border-t pt-4">
          <div className="text-chrome-gray flex items-center gap-2 text-sm">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>{duration} min</span>
          </div>
          <div className="text-chrome text-xl font-bold">{price.toFixed(0)}€</div>
        </div>
      </div>

      {/* Gradient border overlay */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-[inherit] mask-exclude p-px [-webkit-mask-composite:xor] [-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] ${
          isSelected
            ? 'bg-linear-to-br from-[#89CFF0] to-[#aadaf2]'
            : 'bg-linear-to-br from-[#89CFF0]/20 to-[#89CFF0]/5'
        }`}
      />
    </button>
  );
}

export default ServiceCard;
