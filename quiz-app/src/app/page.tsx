import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-8 transition-colors duration-300">
      <div className="w-full max-w-7xl flex justify-end mb-6">
        <Link
          href="/auth/sign-in"
          className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors"
        >
          Sign in
        </Link>
      </div>
      <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-400 dark:to-blue-600 mb-4 text-center">
        Electrical Learning Hub
      </h1>
      <p className="text-slate-600 dark:text-slate-400 text-xl mb-12 text-center max-w-2xl">
        Master electrical concepts with interactive quizzes and real-time circuit simulations.
      </p>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl w-full">
        
        {/* Learn Link - NEW! */}
        <Link 
          href="/learn"
          className="group relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl overflow-hidden hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
        >
          <div className="h-2 bg-gradient-to-r from-purple-400 to-pink-500"></div>
          <div className="p-8 flex flex-col h-full items-center text-center">
            <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300 bg-white/20 rounded-full p-6">🎓</div>
            <h2 className="text-3xl font-bold text-white mb-4">Learn</h2>
            <p className="text-indigo-100 text-lg mb-8">
              Structured lessons with AI tutor support. Evidence-based learning for Unit 202.
            </p>
            <div className="mt-auto px-8 py-3 bg-white text-indigo-600 rounded-full font-bold group-hover:bg-indigo-50 transition-colors shadow-lg">
              Start Learning &rarr;
            </div>
          </div>
        </Link>

        {/* Quiz Link */}
        <Link 
          href="/quiz"
          className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
        >
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <div className="p-8 flex flex-col h-full items-center text-center">
            <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300 bg-blue-50 dark:bg-blue-900/30 rounded-full p-6">📝</div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Quiz</h2>
            <p className="text-gray-600 dark:text-slate-300 text-lg mb-8">
              Practice questions for Health & Safety, Communication, and Science.
            </p>
            <div className="mt-auto px-8 py-3 bg-blue-600 text-white rounded-full font-bold group-hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
              Start Quiz &rarr;
            </div>
          </div>
        </Link>

        {/* Simulation Link */}
        <Link 
          href="/electron-simulation"
          className="group relative bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
        >
          <div className="h-2 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
          <div className="p-8 flex flex-col h-full items-center text-center">
            <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300 bg-cyan-100 dark:bg-cyan-900/20 rounded-full p-6">⚡</div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Simulator</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
              Visualize voltage, current, and resistance in real-time.
            </p>
            <div className="mt-auto px-8 py-3 bg-cyan-500 text-white rounded-full font-bold group-hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/30">
              Launch Sim &rarr;
            </div>
          </div>
        </Link>

      </div>

      <footer className="mt-16 text-slate-500 dark:text-slate-400 text-sm">
        © 2025 Electrical Learning Hub
      </footer>
    </div>
  );
}
