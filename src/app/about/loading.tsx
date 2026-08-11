export default function Loading() {
  return (
    <main className="min-h-screen px-4 pt-28 pb-16">
      <div className="mx-auto max-w-5xl">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton mt-5 h-12 w-1/2" />
        <div className="skeleton mt-6 h-4 w-3/4" />
        <div className="mt-8 grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
        <div className="mt-10 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-2xl" />
          ))}
        </div>
      </div>
    </main>
  );
}