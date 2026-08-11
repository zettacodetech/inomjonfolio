export default function Loading() {
  return (
    <main className="min-h-screen px-4 pt-28 pb-16">
      <div className="mx-auto max-w-5xl">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton mt-5 h-12 w-1/2" />
        <div className="mt-8 flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-9 w-24 rounded-full" />
          ))}
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl">
              <div className="skeleton h-32 rounded-none rounded-t-2xl" />
              <div className="space-y-3 p-5">
                <div className="skeleton h-5 w-2/3" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}