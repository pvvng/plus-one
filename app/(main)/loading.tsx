import Loader from "@/components/loader";

export default function Loading() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Loader />
    </div>
  );
}

export function CalendarLoading() {
  return (
    <section
      className="w-full max-w-screen-xl mx-auto sm:p-5 p-3 relative border rounded-lg
      border-neutral-50 dark:border-neutral-900 dark:bg-neutral-900 shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-start font-medium text-lg flex items-center gap-1">
          <div className="size-5 bg-neutral-400 animate-pulse rounded-full" />
          <div className="w-20 h-3 bg-neutral-400 animate-pulse rounded-full" />
        </div>
        <div className="w-16 h-5 bg-neutral-400 animate-pulse rounded" />
      </div>
      <div className="mt-5 w-full h-[192px] bg-neutral-400 animate-pulse rounded" />
      <div className="flex justify-end">
        <div className="w-24 h-3 mt-4 bg-neutral-400 animate-pulse rounded" />
      </div>
    </section>
  );
}
