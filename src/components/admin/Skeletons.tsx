interface SkeletonProps {
  className?: string;
}

// Base Skeleton block with shimmer animation
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`skeleton animate-pulse bg-white/5 rounded-lg ${className}`} />
  );
}

// Skeleton for booking cards
export function BookingCardSkeleton() {
  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-32 h-5" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

// Skeleton for staff cards
export function StaffCardSkeleton() {
  return (
    <div className="glass-card p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-14 h-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
        <Skeleton className="flex-1 h-9 rounded-lg" />
        <Skeleton className="flex-1 h-9 rounded-lg" />
      </div>
    </div>
  );
}

// Skeleton for stats cards
export function StatsCardSkeleton() {
  return (
    <div className="glass-card p-4">
      <Skeleton className="h-8 w-12 mb-2" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

// Skeleton for calendar
export function CalendarSkeleton() {
  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i + 7} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
}

// Skeleton for table rows
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex gap-4 p-3 border-b border-white/5">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-5 flex-1" />
      ))}
    </div>
  );
}

// Full page loading skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
      
      {/* Bookings List */}
      <div className="space-y-3">
        <BookingCardSkeleton />
        <BookingCardSkeleton />
        <BookingCardSkeleton />
      </div>
    </div>
  );
}


