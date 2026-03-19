import type { Metadata } from 'next';
import Concept20411BShowcase from '../Concept20411BShowcase';

export const metadata: Metadata = {
  title: '204-11B Readiness Concept',
};

export default function Lesson20411BReadinessPage() {
  return <Concept20411BShowcase variant="readiness" />;
}
