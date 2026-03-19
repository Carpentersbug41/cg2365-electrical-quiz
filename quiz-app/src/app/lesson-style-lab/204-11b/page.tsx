import type { Metadata } from 'next';
import Concept20411BShowcase from './Concept20411BShowcase';

export const metadata: Metadata = {
  title: '204-11B Identity Concept',
};

export default function Lesson20411BIdentityPage() {
  return <Concept20411BShowcase variant="identity" />;
}
