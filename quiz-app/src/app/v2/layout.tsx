import { ReactNode } from 'react';
import V2AuthGate from '@/components/v2/V2AuthGate';

interface V2LayoutProps {
  children: ReactNode;
}

export default function V2Layout({ children }: V2LayoutProps) {
  return <V2AuthGate>{children}</V2AuthGate>;
}

