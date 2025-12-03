import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-4 text-center">
        Electrical Learning Hub
      </h1>
      <p className="text-slate-400 text-xl mb-12 text-center max-w-2xl">
        Master electrical concepts with interactive quizzes and real-time circuit simulations.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
        
        {/* Quiz Link */}
        <Link 
          href="/quiz"
          className="group relative bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
        >
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <div className="p-8 flex flex-col h-full items-center text-center">
            <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300 bg-blue-50 rounded-full p-6">📝</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">2365 Quiz</h2>
            <p className="text-gray-600 text-lg mb-8">
              Comprehensive practice questions for Health & Safety, Communication, and Science levels.
            </p>
            <div className="mt-auto px-8 py-3 bg-blue-600 text-white rounded-full font-bold group-hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
              Start Quiz &rarr;
            </div>
          </div>
        </Link>

        {/* Simulation Link */}
        <Link 
          href="/electron-simulation"
          className="group relative bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
        >
          <div className="h-2 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
          <div className="p-8 flex flex-col h-full items-center text-center">
            <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300 bg-cyan-900/20 rounded-full p-6">⚡</div>
            <h2 className="text-3xl font-bold text-white mb-4">Circuit Simulator</h2>
            <p className="text-slate-400 text-lg mb-8">
              Visualize voltage, current, and resistance. Watch electrons flow and collide in real-time.
            </p>
            <div className="mt-auto px-8 py-3 bg-cyan-500 text-white rounded-full font-bold group-hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/30">
              Launch Sim &rarr;
            </div>
          </div>
        </Link>

      </div>

      <footer className="mt-16 text-slate-500 text-sm">
        © 2025 Electrical Learning Hub
      </footer>
    </div>
  );
}
