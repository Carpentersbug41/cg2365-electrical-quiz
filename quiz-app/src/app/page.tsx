import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-8 transition-colors duration-300">
      <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4 text-center">
        Choose Your Course
      </h1>
      <p className="text-slate-600 dark:text-slate-300 text-lg mb-10 text-center max-w-2xl">
        Select a subject area to keep learning paths and data fully separate.
      </p>

      <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl">
        <Link
          href="/2365/learn"
          className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">C&G 2365</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Existing electrical course with current lessons, quiz bank, and progress.
          </p>
          <p className="mt-5 text-blue-600 dark:text-blue-400 font-medium">Open 2365</p>
        </Link>

        <Link
          href="/gcse/science/physics/learn"
          className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">GCSE Science Physics</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Separate GCSE Physics route and data scope.
          </p>
          <p className="mt-5 text-blue-600 dark:text-blue-400 font-medium">Open GCSE Physics</p>
        </Link>

        <Link
          href="/gcse/science/biology/learn"
          className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">GCSE Science Biology</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Separate GCSE Biology route and data scope.
          </p>
          <p className="mt-5 text-blue-600 dark:text-blue-400 font-medium">Open GCSE Biology</p>
        </Link>
      </div>
    </div>
  );
}
