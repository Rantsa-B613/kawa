import { Skeleton } from "../ui/Skeleton";

export function ReservationListSkeleton({ groups = 2, rowsPerGroup = 2 }) {
  return (
    <div className="space-y-8">
      {Array.from({ length: groups }).map((_, gi) => (
        <div key={gi}>
          <div className="mb-3 flex items-center gap-3 px-1">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-px flex-1" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: rowsPerGroup }).map((_, ri) => (
              <div
                key={ri}
                className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-10 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap sm:gap-4">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-7 w-24 rounded-full" />
                  <Skeleton className="hidden h-9 w-20 rounded-xl sm:block" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReservationsSkeleton() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="h-7 w-64 sm:h-8" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-56 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-11 flex-1 rounded-full sm:max-w-xs" />
        <Skeleton className="h-11 w-full rounded-full sm:w-48" />
        <Skeleton className="h-11 w-full rounded-full sm:w-44" />
        <Skeleton className="h-11 w-full rounded-xl sm:ml-auto sm:w-48" />
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
      </div>

      <div className="mt-6 flex gap-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="mt-8">
        <ReservationListSkeleton />
      </div>
    </div>
  );
}
