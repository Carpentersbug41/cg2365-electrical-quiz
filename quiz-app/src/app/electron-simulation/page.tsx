'use client';

import ElectronApp from '@/components/electron/ElectronApp';
import Link from 'next/link';

export default function ElectronPage() {
  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-50">
         <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors bg-slate-900/50 p-2 rounded-lg backdrop-blur-sm">
            &larr; Home
         </Link>
      </div>
      <ElectronApp />
    </div>
  );
}

