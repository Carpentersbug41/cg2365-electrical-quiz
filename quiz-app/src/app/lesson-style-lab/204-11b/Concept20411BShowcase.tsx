import Image from 'next/image';
import Link from 'next/link';
import { Fraunces, Manrope, Space_Mono, Sora } from 'next/font/google';
import styles from './styles.module.css';
import { conceptIdeas, lesson20411B, type ConceptVariant } from './lesson20411B';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-space-mono' });

type Props = {
  variant: ConceptVariant;
};

const imageByVariant: Record<ConceptVariant, string> = {
  identity: '/images/lesson-style-lab/tester-works-overview.svg',
  readiness: '/images/lesson-style-lab/tester-works-readiness.svg',
};

const subtitleByVariant: Record<ConceptVariant, string> = {
  identity: 'Page concept 01: the lesson as a polished course-intro spread',
  readiness: 'Page concept 02: the lesson as a proving routine / readiness dashboard',
};

export default function Concept20411BShowcase({ variant }: Props) {
  const isIdentity = variant === 'identity';

  return (
    <main
      className={[
        styles.page,
        isIdentity ? styles.pageIdentity : styles.pageReadiness,
        fraunces.variable,
        manrope.variable,
        sora.variable,
        spaceMono.variable,
      ].join(' ')}
    >
      <div className={styles.ambientGlowA} />
      <div className={styles.ambientGlowB} />

      <div className={styles.shell}>
        <header className={styles.topbar}>
          <div>
            <Link href="/lesson-style-lab" className={styles.backLink}>
              Lesson Style Lab
            </Link>
            <p className={styles.kicker}>{subtitleByVariant[variant]}</p>
          </div>

          <nav className={styles.viewSwitch} aria-label="204-11B concept pages">
            <Link
              href="/lesson-style-lab/204-11b"
              className={`${styles.viewLink} ${isIdentity ? styles.viewLinkActive : ''}`}
            >
              Identity Page
            </Link>
            <Link
              href="/lesson-style-lab/204-11b/readiness"
              className={`${styles.viewLink} ${!isIdentity ? styles.viewLinkActive : ''}`}
            >
              Readiness Page
            </Link>
          </nav>
        </header>

        {isIdentity ? <IdentityLayout /> : <ReadinessLayout />}

        <section className={styles.ideaStrip}>
          <div className={styles.ideaIntro}>
            <span className={styles.sectionLabel}>Next page ideas</span>
            <h2 className={styles.ideaTitle}>Other lesson JSON aspects worth turning into separate pages</h2>
            <p className={styles.ideaText}>
              This lesson has enough structure to split into multiple art-directed surfaces instead of one giant generic
              page.
            </p>
          </div>

          <div className={styles.ideaGrid}>
            {conceptIdeas.map((idea) => (
              <article key={idea.title} className={styles.ideaCard}>
                <h3>{idea.title}</h3>
                <p>{idea.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function IdentityLayout() {
  return (
    <>
      <section className={styles.identityHero}>
        <div className={styles.identityLead}>
          <span className={styles.sectionLabel}>Lesson identity</span>
          <h1 className={styles.mainTitle}>{lesson20411B.title}</h1>
          <p className={styles.description}>{lesson20411B.description}</p>

          <div className={styles.metaRow}>
            <div className={styles.metaCard}>
              <span>Unit</span>
              <strong>{lesson20411B.unit}</strong>
            </div>
            <div className={styles.metaCard}>
              <span>Topic</span>
              <strong>{lesson20411B.topic}</strong>
            </div>
            <div className={styles.metaCard}>
              <span>Layout</span>
              <strong>{lesson20411B.layout}</strong>
            </div>
          </div>

          <div className={styles.lessonPromise}>
            <span className={styles.sectionLabel}>Design intent</span>
            <p>
              This version treats the JSON heading fields like a premium landing section: one strong promise, clear learning
              arc, and the outcomes presented as the headline features of the lesson.
            </p>
          </div>
        </div>

        <div className={styles.identityArtStage}>
          <div className={styles.imageFrame}>
            <Image
              src={imageByVariant.identity}
              alt="Abstract editorial artwork for proving your tester works"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className={styles.heroImage}
              priority
            />
          </div>

          <article className={styles.signalPanel}>
            <span className={styles.sectionLabel}>Core message</span>
            <p>Before trusting a circuit reading, prove the tester, trust the process, then read the result.</p>
          </article>
        </div>

        <aside className={styles.prerequisiteRail}>
          <div className={styles.railCard}>
            <span className={styles.sectionLabel}>Prerequisites</span>
            <ul className={styles.tagList}>
              {lesson20411B.prerequisites.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.railQuote}>
            <p>
              “Proving is about the tester; testing is about the circuit.” This layout makes that mindset the headline
              rather than burying it in body copy.
            </p>
          </div>
        </aside>
      </section>

      <section className={styles.outcomesShowcase}>
        <div className={styles.outcomesIntro}>
          <span className={styles.sectionLabel}>Learning outcomes</span>
          <h2>What the learner should leave able to do</h2>
        </div>

        <div className={styles.outcomeGrid}>
          {lesson20411B.learningOutcomes.map((outcome, index) => (
            <article key={outcome} className={styles.outcomeCard}>
              <span className={styles.outcomeNumber}>0{index + 1}</span>
              <p>{outcome}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function ReadinessLayout() {
  return (
    <>
      <section className={styles.readinessHero}>
        <div className={styles.readinessPitch}>
          <span className={styles.sectionLabel}>Pre-lab readiness</span>
          <h1 className={styles.mainTitle}>{lesson20411B.title}</h1>
          <p className={styles.description}>{lesson20411B.description}</p>

          <div className={styles.sequenceBand}>
            <div>
              <span>01</span>
              <strong>Prove</strong>
            </div>
            <div>
              <span>02</span>
              <strong>Test</strong>
            </div>
            <div>
              <span>03</span>
              <strong>Re-prove</strong>
            </div>
          </div>
        </div>

        <div className={styles.readinessStage}>
          <div className={styles.readinessImagePanel}>
            <Image
              src={imageByVariant.readiness}
              alt="Technical artwork for a proving routine dashboard"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className={styles.heroImage}
              priority
            />
          </div>

          <div className={styles.readinessStats}>
            <article className={styles.statCard}>
              <span>Topic</span>
              <strong>{lesson20411B.topic}</strong>
            </article>
            <article className={styles.statCard}>
              <span>Unit</span>
              <strong>{lesson20411B.unit}</strong>
            </article>
            <article className={styles.statCard}>
              <span>JSON layout</span>
              <strong>{lesson20411B.layout}</strong>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.readinessBoard}>
        <article className={styles.pathPanel}>
          <span className={styles.sectionLabel}>Prerequisite chain</span>
          <h2>What the learner should already know before this lesson starts</h2>
          <div className={styles.pathSteps}>
            {lesson20411B.prerequisites.map((item, index) => (
              <div key={item} className={styles.pathStep}>
                <span className={styles.pathIndex}>0{index + 1}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.outcomeBoard}>
          <span className={styles.sectionLabel}>Outcome map</span>
          <h2>The same JSON outcomes, but framed as a session control board</h2>
          <div className={styles.checklist}>
            {lesson20411B.learningOutcomes.map((outcome) => (
              <div key={outcome} className={styles.checkRow}>
                <span className={styles.checkDot} />
                <p>{outcome}</p>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.triggerPanel}>
          <span className={styles.sectionLabel}>Why this second page works</span>
          <p>
            The first concept sells the lesson. This one behaves more like a training rig briefing board: darker, tighter,
            more operational, and more focused on whether the learner is ready to begin.
          </p>
        </article>
      </section>
    </>
  );
}
