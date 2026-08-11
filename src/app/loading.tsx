export default function Loading() {
  return (
    <main className="min-h-screen px-4 pt-28 pb-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div className="space-y-5">
            <div className="skeleton h-24 w-4/5" />
            <div className="skeleton h-24 w-2/3" />
            <div className="skeleton mt-6 h-4 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
            <div className="flex gap-3 pt-4">
              <div className="skeleton h-11 w-36 rounded-full" />
              <div className="skeleton h-11 w-32 rounded-full" />
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="skeleton h-[420px] w-full max-w-[320px] rounded-2xl" />
          </div>
        </div>
      </div>
    </main>
  );
}