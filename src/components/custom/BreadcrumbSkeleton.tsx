import { Skeleton } from '@/components/ui/skeleton';

interface BreadcrumbSkeletonProps {
  className?: string;
  segments?: number;
}

export default function BreadcrumbSkeleton({
  className = '',
  segments = 3,
}: BreadcrumbSkeletonProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center space-x-2 text-sm">
        {Array.from({ length: segments }).map((_, index) => (
          <div key={`segment-${index}`}>
            <Skeleton
              key={`segment-${index}`}
              className={`h-4 ${index === 0 ? 'w-20' : index === 1 ? 'w-32' : 'w-16'}`}
            />
            {index < segments - 1 && (
              <span key={`separator-${index}`} className="text-slate-400 dark:text-slate-600">
                /
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
