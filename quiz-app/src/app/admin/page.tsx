import Link from 'next/link';
import { headers } from 'next/headers';
import { getCoursePrefixFromHeader } from '@/lib/routing/curricula';

type AdminLink = {
  title: string;
  description: string;
  href: string;
  badge: string;
  absolute?: boolean;
  scope?: 'all' | 'cg2365' | 'biology';
};

const workspaceLinks: AdminLink[] = [
  {
    title: 'Module Planner',
    description: 'Run the staged M0-M6 module pipeline, inspect artifacts, and generate lessons by blueprint.',
    href: '/admin/module',
    badge: 'Planner',
  },
  {
    title: 'Question Operations',
    description: 'Manage drafts, approvals, duplicate resolution, quality runs, and question bank workflows.',
    href: '/admin/questions',
    badge: 'Questions',
    scope: 'all',
  },
  {
    title: 'Microbreak Games',
    description: 'Generate game content tied to lesson concepts and vocabulary.',
    href: '/admin/generate-games',
    badge: 'Games',
    scope: 'all',
  },
  {
    title: 'Simulations',
    description: 'Clone GitHub simulations into src/simulations and attach them to lesson iframes.',
    href: '/admin/simulations',
    badge: 'Sim',
    scope: 'all',
  },
  {
    title: 'Explanation Visuals',
    description: 'Generate 1-2 visual prompts from explanation blocks and place embeds under that block or in the main diagram area.',
    href: '/admin/simulations',
    badge: 'Visuals',
    scope: 'all',
  },
  {
    title: 'User Profiles',
    description: 'Edit per-user tutor profile injection text used for personalized tone and pacing.',
    href: '/admin/users',
    badge: 'Users',
    scope: 'all',
  },
  {
    title: 'Prompt Profiles',
    description: 'Edit global profile injections used by lesson generation and tutor/marking/socratic responses.',
    href: '/admin/prompt-profiles',
    badge: 'Prompts',
    scope: 'all',
  },
  {
    title: 'Guided Chunk Runtime',
    description: 'Run Biology batch generation, inspect generated frames, and launch guided tutor lessons for review.',
    href: '/admin/guided-chunk',
    badge: 'Guided',
    scope: 'biology',
  },
  {
    title: 'Guided Biology Planner',
    description: 'Guided lesson planning and generation for GCSE Biology using the module-planner workflow.',
    href: '/gcse/science/biology/admin/guided-module',
    badge: 'Guided',
    absolute: true,
    scope: 'biology',
  },
  {
    title: 'Guided 2365 Planner',
    description: 'Guided lesson planning and generation for C&G 2365 using the module-planner workflow.',
    href: '/2365/admin/guided-module',
    badge: 'Guided',
    absolute: true,
    scope: 'cg2365',
  },
  {
    title: 'Dynamic Module Planner',
    description: 'Run the staged 2365 module planner, inspect LO and lesson artifacts, then generate native dynamic lesson drafts from the lesson matrix.',
    href: '/admin/dynamic-module',
    badge: 'Dynamic',
    scope: 'cg2365',
  },
];

const generatorLinks: AdminLink[] = [
  {
    title: 'Lesson Generator',
    description: 'Generate a single lesson and quiz pair with full validation and git integration.',
    href: '/generate',
    badge: 'Lessons',
    scope: 'all',
  },
  {
    title: 'Quiz Generator',
    description: 'Generate or regenerate question sets for lessons.',
    href: '/generate-quiz',
    badge: 'Quiz',
    scope: 'all',
  },
  {
    title: 'Test Generation',
    description: 'Low-level generation test page for debugging prompts and output behavior.',
    href: '/test-generation',
    badge: 'Debug',
    scope: 'all',
  },
  {
    title: 'Dynamic Lesson Generator',
    description: 'Generate one native 2365 dynamic lesson draft directly from grounded source text.',
    href: '/admin/dynamic-generate',
    badge: 'Dynamic',
    scope: 'cg2365',
  },
];

const apiLinks: AdminLink[] = [
  {
    title: 'Module Runs API',
    description: 'Inspect module runs and stage artifacts as raw JSON.',
    href: '/api/admin/module/runs',
    badge: 'API',
  },
  {
    title: 'Question Runs API',
    description: 'Inspect question generation run records and statuses.',
    href: '/api/admin/questions/runs',
    badge: 'API',
  },
  {
    title: 'Lessons Status API',
    description: 'Quick backend health/status view for lesson assets.',
    href: '/api/lessons-status',
    badge: 'API',
  },
];

function LinkGrid({ title, subtitle, items }: { title: string; subtitle: string; items: AdminLink[] }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-[#132033]">{title}</h2>
        <p className="mt-1 text-sm text-[#46566d]">{subtitle}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group rounded-2xl border border-[#d3deee] bg-white/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#92a9ce] hover:shadow-lg"
          >
            <span className="inline-block rounded-full bg-[#e8f0ff] px-3 py-1 text-xs font-semibold tracking-wide text-[#2a4678]">
              {item.badge}
            </span>
            <h3 className="mt-3 text-lg font-semibold text-[#162746] group-hover:text-[#234a8f]">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#46566d]">{item.description}</p>
            <span className="mt-4 inline-block text-sm font-medium text-[#21467f]">Open</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function prefixHref(prefix: string, path: string): string {
  if (!path.startsWith('/')) return path;
  if (path.startsWith('/api')) return path;
  if (path === '/') return prefix;
  return `${prefix}${path}`;
}

function filterLinksForScope(links: AdminLink[], prefix: string): AdminLink[] {
  const scope = prefix === '/2365' ? 'cg2365' : prefix === '/gcse/science/biology' ? 'biology' : 'all';
  return links.filter((link) => {
    if (!link.scope || link.scope === 'all') return true;
    return link.scope === scope;
  });
}

export default async function AdminHomePage() {
  const requestHeaders = await headers();
  const currentPrefix = getCoursePrefixFromHeader(requestHeaders.get('x-course-prefix'));
  const withPrefix = (links: AdminLink[]): AdminLink[] =>
    filterLinksForScope(links, currentPrefix).map((link) => ({
      ...link,
      href: link.absolute || link.href.startsWith('/api') ? link.href : prefixHref(currentPrefix, link.href),
    }));

  return (
    <main
      className="min-h-screen bg-[#f1f6ff] px-6 py-10"
      style={{
        fontFamily: '"Trebuchet MS","Avenir Next","Segoe UI Variable Text",sans-serif',
        backgroundImage:
          'radial-gradient(circle at 10% 10%, rgba(145,177,233,0.35), transparent 42%), radial-gradient(circle at 90% 20%, rgba(255,214,163,0.28), transparent 36%), linear-gradient(180deg, #f7fbff 0%, #eff5ff 100%)',
      }}
    >
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="rounded-3xl border border-[#d3deee] bg-white/80 p-8 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#315186]">Admin Console</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#132033]">Control Center</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#46566d]">
            Central entry point for lesson generation, module planning, question operations, and backend inspection tools.
          </p>
        </header>

        <LinkGrid
          title="Workspace Tools"
          subtitle="Primary admin workflows for planning, curation, and game content."
          items={withPrefix(workspaceLinks)}
        />

        <LinkGrid
          title="Generation Tools"
          subtitle="Direct generation utilities for lessons, quizzes, and debug flows."
          items={withPrefix(generatorLinks)}
        />

        <LinkGrid
          title="Backend Endpoints"
          subtitle="Raw JSON views for operational checks and troubleshooting."
          items={apiLinks}
        />
      </div>
    </main>
  );
}
