import Link from 'next/link';
import { ReactNode } from 'react';

interface V2ShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function V2Shell({ title, subtitle, children }: V2ShellProps) {
  return (
    <main>
      <header>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
        <nav>
          <Link href="/v2">V2 Home</Link> | <Link href="/v2/learn">Lessons</Link> |{' '}
          <Link href="/v2/review">Review</Link> | <Link href="/v2/progress">Progress</Link> |{' '}
          <Link href="/v2/admin">Admin</Link>
        </nav>
      </header>
      <section>{children}</section>
    </main>
  );
}
