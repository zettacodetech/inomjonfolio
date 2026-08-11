export default function Loading() {
  return (
    <main className="min-h-screen px-4 pt-28 pb-16">
      <div className="mx-auto max-w-5xl">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton mt-5 h-12 w-1/2" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="skeleton h-16 rounded-2xl" />
            <div className="skeleton h-16 rounded-2xl" />
            <div className="skeleton h-16 rounded-2xl" />
            <div className="skeleton h-16 rounded-2xl" />
          </div>
          <div className="skeleton h-80 rounded-2xl" />
        </div>
      </div>
    </main>
  );
}