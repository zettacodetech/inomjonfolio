export default function Loading() {
  return (
    <main className="min-h-screen px-4 pt-28 pb-16">
      <div className="mx-auto max-w-5xl">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton mt-5 h-12 w-2/3" />
        <div className="grid gap-6 pt-12 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-3xl p-7">
              <div className="skeleton h-40 rounded-2xl" />
              <div className="skeleton mt-5 h-4 w-24" />
              <div className="skeleton mt-3 h-6 w-3/4" />
              <div className="skeleton mt-3 h-4 w-full" />
              <div className="skeleton mt-3 h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}