import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <main className="min-h-screen pb-8">
      {/* Header Skeleton */}
      <div className="relative w-full">
        <div className="relative h-48 w-full sm:h-64">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 pb-8">
            <div className="flex items-end space-x-5">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="flex min-w-0 flex-1 items-center justify-end space-x-6">
                <div className="flex space-x-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="mt-1 h-4 w-12" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="mt-4 h-16 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mx-auto mt-8 max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <Skeleton className="h-10 w-full" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
