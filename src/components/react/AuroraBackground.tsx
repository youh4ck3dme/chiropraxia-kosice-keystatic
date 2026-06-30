import { useRef, type FC } from 'react';

/**
 * Aurora Background Component
 * Creates a premium animated background with Baby Blue color blobs.
 * Optimized for performance with CSS-only animations and hardware acceleration.
 */
export const AuroraBackground: FC = () => {
<<<<<<< HEAD
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="bg-void pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Aurora Blobs - Baby Blue Oriented */}
      <div className="absolute inset-0 opacity-40">
        <div className="aurora-blob blob-1" />
        <div className="aurora-blob blob-2" />
        <div className="aurora-blob blob-3" />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
=======
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-void"
      aria-hidden="true"
    >
      {/* Aurora Blobs - Baby Blue Oriented */}
      <div className="absolute inset-0 opacity-40">
        <div className="aurora-blob blob-1" />
        <div className="aurora-blob blob-2" />
        <div className="aurora-blob blob-3" />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
>>>>>>> origin/main
        .aurora-blob {
          position: absolute;
          width: 60vw;
          height: 60vw;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
          mix-blend-mode: plus-lighter;
          will-change: transform;
        }

        .blob-1 {
          background: var(--color-aurora);
          top: -20%;
          left: -10%;
          animation: aurora-float-1 25s infinite alternate ease-in-out;
        }

        .blob-2 {
          background: var(--color-aurora-dim);
          top: 30%;
          right: -10%;
          animation: aurora-float-2 30s infinite alternate-reverse ease-in-out;
        }

        .blob-3 {
          background: var(--color-aurora-glow);
          bottom: -10%;
          left: 20%;
          animation: aurora-float-3 35s infinite alternate ease-in-out;
        }

        @keyframes aurora-float-1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(15%, 10%) scale(1.2); }
        }

        @keyframes aurora-float-2 {
          0% { transform: translate(0, 0) scale(1.1); }
          100% { transform: translate(-20%, 15%) scale(0.9); }
        }

        @keyframes aurora-float-3 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(10%, -15%) scale(1.1); }
        }
<<<<<<< HEAD
      `,
        }}
      />
=======
      `}} />
>>>>>>> origin/main
    </div>
  );
};

export default AuroraBackground;
