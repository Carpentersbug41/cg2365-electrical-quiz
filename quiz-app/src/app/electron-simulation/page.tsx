'use client';

import ElectronApp from '@/components/electron/ElectronApp';
import Link from 'next/link';

export default function ElectronPage() {
  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-50">
         <Link href="/" className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-white/80 dark:bg-slate-900/50 p-2 rounded-lg backdrop-blur-sm border border-slate-300 dark:border-slate-700">
            &larr; Home
         </Link>
      </div>
      <ElectronApp />
    </div>
  );
}




