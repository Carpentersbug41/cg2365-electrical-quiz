import Link from 'next/link';
import V2Shell from '@/components/v2/V2Shell';

export default function V2HomePage() {
  return (
    <V2Shell title="V2 Runtime" subtitle="Clean V2-only surface. No V1 fallback.">
      <p>This area is isolated from V1 routes and V1 content fallback.</p>
      <ul>
        <li><Link href="/v2/learn">V2 Lessons</Link></li>
        <li><Link href="/v2/review">V2 Review Queue</Link></li>
        <li><Link href="/v2/progress">V2 Progress</Link></li>
        <li><Link href="/v2/admin">V2 Admin</Link></li>
      </ul>
    </V2Shell>
  );
}
