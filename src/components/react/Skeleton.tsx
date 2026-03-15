import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}

/**
 * Skeleton Loader Component
 * Provides a premium-feel pulsing placeholder for loading states
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  borderRadius = '0.5rem',
}) => {
  return (
    <div
      className={`animate-pulse border border-white/10 bg-white/5 ${className}`}
      style={{
        width: width || '100%',
        height: height || '1rem',
        borderRadius,
      }}
    />
  );
};

export const SkeletonCircle: React.FC<Omit<SkeletonProps, 'borderRadius'>> = (props) => {
  return <Skeleton {...props} borderRadius="50%" />;
};

export const BookingSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      <Skeleton height="3rem" className="rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton height="4rem" className="rounded-xl" />
        <Skeleton height="4rem" className="rounded-xl" />
      </div>
      <div className="space-y-2">
        <Skeleton width="40%" height="1.5rem" />
        <div className="grid grid-cols-4 gap-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} height="2.5rem" className="rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};
