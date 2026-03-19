'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { listCg2365GuidedLessonProfiles } from '@/data/guided-chunk/2365/lessonProfiles';
import { listGcseBiologyPhase1LessonProfiles } from '@/data/v2/gcse/biology/phase1LessonProfiles';
import { authedFetch } from '@/lib/api/authedFetch';
import type { GuidedChunkFrame } from '@/lib/guidedChunk/types';
import type { GuidedChunkVersionSummary } from '@/lib/guidedChunk/versionStore';
import type { GuidedChunkGenerationPhaseArtifact } from '@/lib/generation/guidedChunk';
import styles from './styles.module.css';

const defaultElectricalSourceText = `LO1: Understand what a 3-plate ceiling rose is and what loop-in means.
A 3-plate ceiling rose in a loop-in lighting circuit acts as both the lamp connection point and a small junction point. Loop-in means the supply is joined at each light point and then continues to the next one. A mid-circuit rose may contain supply in, supply out, switch drop conductors, and the lamp flex.

LO2: Sort conductors into the neutral, permanent live loop, and switched live groups.
Neutral conductors are grouped together. Permanent lives, including the feed down to the switch, are grouped in the loop terminals. The switched live return from the switch is grouped with the lamp live so the switch controls the lamp correctly.

LO3: Explain switched control and compare end-of-circuit with mid-circuit roses.
The switch interrupts and returns the live path to the lamp through the switched live. An end-of-circuit rose is usually less crowded because it does not need to feed onward to another light point, although the switch relationship and lamp connections still remain.`;

type GenerateResponse = {
  frame: GuidedChunkFrame;
  artifacts: GuidedChunkGenerationPhaseArtifact[];
  version: GuidedChunkVersionSummary;
  score?: {
    total: number;
    grade: string;
    summary: string;
  };
};

type VersionsResponse = {
  versions: GuidedChunkVersionSummary[];
};

type UploadResponse = {
  success: boolean;
  filename: string;
  fileType: 'pdf' | 'docx' | 'txt';
  extractedChars: number;
  text: string;
};

const biologyProfiles = listGcseBiologyPhase1LessonProfiles();
const electricalProfiles = listCg2365GuidedLessonProfiles();

export default function GuidedChunkLabClient() {
  const [curriculum, setCurriculum] = useState<'gcse-science-biology' | 'cg2365'>('gcse-science-biology');
  const [selectedBiologyCode, setSelectedBiologyCode] = useState<string>(biologyProfiles[0]?.lessonCode ?? '');
  const [selectedElectricalCode, setSelectedElectricalCode] = useState<string>(electricalProfiles[0]?.lessonCode ?? '');
  const [lessonCode, setLessonCode] = useState('BIO-101-1A');
  const [title, setTitle] = useState('Cell Structure Basics');
  const [unit, setUnit] = useState('BIO-101');
  const [topic, setTopic] = useState('Cell Structure Basics');
  const [sourceText, setSourceText] = useState('');
  const [uploadingSource, setUploadingSource] = useState(false);
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loadingFrames, setLoadingFrames] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [storedFrames, setStoredFrames] = useState<GuidedChunkVersionSummary[]>([]);

  const loCount = result?.frame.loSequence.length ?? 0;
  const chunkCount = useMemo(
    () => result?.frame.loSequence.reduce((sum, lo) => sum + lo.chunkPlan.length, 0) ?? 0,
    [result]
  );

  async function refreshFrames() {
    setLoadingFrames(true);
    try {
      const response = await authedFetch('/api/admin/guided-chunk/versions');
      const payload = (await response.json()) as VersionsResponse;
      if (response.ok) {
        setStoredFrames(payload.versions);
      }
    } finally {
      setLoadingFrames(false);
    }
  }

  useEffect(() => {
    void refreshFrames();
  }, []);

  useEffect(() => {
    if (curriculum === 'gcse-science-biology') {
      const profile = biologyProfiles.find((entry) => entry.lessonCode === selectedBiologyCode) ?? biologyProfiles[0];
      if (!profile) return;

      setLessonCode(profile.lessonCode);
      setTitle(profile.topic);
      setUnit(profile.lessonCode.split('-').slice(0, 2).join('-'));
      setTopic(profile.topic);
      setSourceText(`${profile.mustHaveTopics}

${profile.additionalInstructions}`);
      return;
    }

    const profile = electricalProfiles.find((entry) => entry.lessonCode === selectedElectricalCode) ?? electricalProfiles[0];
    if (!profile) {
      setLessonCode('204-13A-lab');
      setTitle('3-plate ceiling rose (generated)');
      setUnit('Unit 204');
      setTopic('3-plate ceiling rose (loop-in)');
      setSourceText(defaultElectricalSourceText);
      return;
    }

    setLessonCode(profile.lessonCode);
    setTitle(profile.topic);
    setUnit(profile.unit);
    setTopic(profile.topic);
    setSourceText(`${profile.sourceText}\n\n${profile.additionalInstructions}`);
  }, [curriculum, selectedBiologyCode, selectedElectricalCode]);

  async function handleSourceUpload(file: File | null) {
    if (!file) return;
    setUploadingSource(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await authedFetch('/api/guided-chunk/source-upload', {
        method: 'POST',
        body: formData,
      });
      const payload = (await response.json()) as UploadResponse & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to extract source text.');
      }
      setSourceText(payload.text);
      setUploadedFilename(payload.filename);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Failed to extract source text.');
    } finally {
      setUploadingSource(false);
    }
  }

  async function handleGenerate() {
    setBusy(true);
    setError(null);

    try {
      const biologyProfile = biologyProfiles.find((entry) => entry.lessonCode === selectedBiologyCode) ?? null;
      const response = await authedFetch('/api/guided-chunk/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonCode,
          title,
          unit,
          topic,
          sourceText,
          sourceRefs: ['guided-chunk-lab'],
          targetAudience: curriculum === 'gcse-science-biology' ? 'GCSE Biology learner' : 'Total beginner',
          curriculum,
          lessonProfileNotes: curriculum === 'gcse-science-biology' ? biologyProfile?.additionalInstructions : undefined,
        }),
      });

      const payload = (await response.json()) as GenerateResponse & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to generate guided chunk frame.');
      }

      setResult(payload);
      await refreshFrames();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Generation failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <div>
            <Link href="/lesson-style-lab" className={styles.backLink}>
              Lesson Style Lab
            </Link>
            <p className={styles.eyebrow}>Guided chunk generator</p>
          </div>
          <p className={styles.meta}>Generate, score, save, and launch guided lessons</p>
        </header>

        <div className={styles.grid}>
          <section className={styles.panel}>
            <p className={styles.eyebrow}>Authoring</p>
            <h1 className={styles.title}>Generate a guided-chunk lesson frame</h1>
            <p className={styles.subtitle}>
              This supports uploaded source text, subject presets, and guided scoring. Use Biology or 2365 presets, or upload a syllabus file and generate from that.
            </p>

            <div className={styles.form}>
              <div className={styles.row}>
                <label className={styles.field}>
                  <span className={styles.label}>Curriculum</span>
                  <select className={styles.input} value={curriculum} onChange={(e) => setCurriculum(e.target.value as 'gcse-science-biology' | 'cg2365')}>
                    <option value="gcse-science-biology">GCSE Biology</option>
                    <option value="cg2365">C&amp;G 2365 Electrical</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>{curriculum === 'gcse-science-biology' ? 'Biology preset' : '2365 preset'}</span>
                  {curriculum === 'gcse-science-biology' ? (
                    <select className={styles.input} value={selectedBiologyCode} onChange={(e) => setSelectedBiologyCode(e.target.value)}>
                      {biologyProfiles.map((profile) => (
                        <option key={profile.lessonCode} value={profile.lessonCode}>
                          {profile.lessonCode} - {profile.topic}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select className={styles.input} value={selectedElectricalCode} onChange={(e) => setSelectedElectricalCode(e.target.value)}>
                      {electricalProfiles.map((profile) => (
                        <option key={profile.lessonCode} value={profile.lessonCode}>
                          {profile.lessonCode} - {profile.topic}
                        </option>
                      ))}
                    </select>
                  )}
                </label>
              </div>

              <div className={styles.row}>
                <label className={styles.field}>
                  <span className={styles.label}>Lesson code</span>
                  <input className={styles.input} value={lessonCode} onChange={(e) => setLessonCode(e.target.value)} />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Unit</span>
                  <input className={styles.input} value={unit} onChange={(e) => setUnit(e.target.value)} />
                </label>
              </div>

              <div className={styles.row}>
                <label className={styles.field}>
                  <span className={styles.label}>Title</span>
                  <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Topic</span>
                  <input className={styles.input} value={topic} onChange={(e) => setTopic(e.target.value)} />
                </label>
              </div>

              <label className={styles.field}>
                <span className={styles.label}>Upload syllabus/source file</span>
                <input
                  className={styles.input}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(event) => void handleSourceUpload(event.target.files?.[0] ?? null)}
                />
                <span className={styles.helper}>
                  {uploadingSource
                    ? 'Extracting text from upload...'
                    : uploadedFilename
                      ? `Loaded from ${uploadedFilename}`
                      : 'Upload PDF, DOCX, or TXT to replace the source text below.'}
                </span>
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Grounded source text</span>
                <textarea className={styles.textarea} value={sourceText} onChange={(e) => setSourceText(e.target.value)} />
              </label>

              <div className={styles.actions}>
                <button type="button" className={styles.buttonPrimary} disabled={busy} onClick={() => void handleGenerate()}>
                  {busy ? 'Generating...' : 'Generate frame'}
                </button>
                {result ? (
                  <Link
                    href={`/guided-chunk/${encodeURIComponent(result.frame.lessonCode)}?versionId=${encodeURIComponent(result.version.id)}&sourceContext=guided_chunk_lab_preview`}
                    className={styles.buttonSecondary}
                  >
                    Launch lesson
                  </Link>
                ) : null}
              </div>

              {error ? <p className={`${styles.status} ${styles.error}`}>{error}</p> : null}
            </div>
          </section>

          <aside className={styles.panel}>
            <div className={styles.resultCard}>
              <div>
                <p className={styles.eyebrow}>Result</p>
                <h2 className={styles.title}>Generated frame status</h2>
                <p className={styles.helper}>
                  {result
                    ? 'The frame has been saved into the runtime store and can be opened immediately.'
                    : 'Generate a frame to inspect lesson shape, score, and saved outputs.'}
                </p>
              </div>

              <div className={styles.statGrid}>
                <div className={styles.stat}>
                  <p className={styles.label}>LOs</p>
                  <p className={styles.statValue}>{loCount}</p>
                </div>
                <div className={styles.stat}>
                  <p className={styles.label}>Chunks</p>
                  <p className={styles.statValue}>{chunkCount}</p>
                </div>
              </div>

              {result ? (
                <>
                  <p className={styles.status}>Saved lesson code: {result.frame.lessonCode}</p>
                  <p className={styles.helper}>
                    Draft version {result.version.versionNo} · {result.version.status}
                  </p>
                  {result.score ? (
                    <div className={styles.statGrid}>
                      <div className={styles.stat}>
                        <p className={styles.label}>Score</p>
                        <p className={styles.statValue}>{result.score.total}</p>
                      </div>
                      <div className={styles.stat}>
                        <p className={styles.label}>Grade</p>
                        <p className={styles.statValue}>{result.score.grade}</p>
                      </div>
                    </div>
                  ) : null}
                  {result.score ? <p className={styles.helper}>{result.score.summary}</p> : null}
                  <div className={styles.artifactList}>
                    {result.artifacts.map((artifact) => (
                      <article key={`${artifact.phase}-${artifact.name}`} className={styles.artifact}>
                        <p className={styles.label}>Phase {artifact.phase}</p>
                        <p className={styles.artifactTitle}>{artifact.name}</p>
                        <p className={styles.artifactText}>
                          {artifact.name === 'plan'
                            ? 'High-level LO and chunk planning artifact'
                            : artifact.name === 'score'
                              ? 'Guided runtime quality score with subject-aware heuristics'
                              : 'Normalized guided chunk frame ready for runtime loading'}
                        </p>
                      </article>
                    ))}
                  </div>
                </>
              ) : null}

              <div className={styles.artifactList}>
                <div>
                  <p className={styles.eyebrow}>Saved frames</p>
                  <p className={styles.helper}>
                    {loadingFrames ? 'Refreshing saved frames...' : 'Open a generated guided lesson without regenerating it.'}
                  </p>
                </div>
                {storedFrames.map((frame) => (
                  <article key={frame.id} className={styles.artifact}>
                    <p className={styles.label}>
                      {frame.lessonCode} · v{frame.versionNo}
                    </p>
                    <p className={styles.artifactTitle}>{frame.title}</p>
                    <p className={styles.artifactText}>
                      {frame.loCount} LOs | {frame.chunkCount} chunks | {frame.unit} | {frame.status}
                    </p>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.buttonSecondary}
                        onClick={() => {
                          setLessonCode(frame.lessonCode);
                          setTitle(frame.title);
                          setUnit(frame.unit);
                          setTopic(frame.topic);
                        }}
                      >
                        Load metadata
                      </button>
                      <Link
                        href={`/guided-chunk/${encodeURIComponent(frame.lessonCode)}?versionId=${encodeURIComponent(frame.id)}&sourceContext=guided_chunk_lab_preview`}
                        className={styles.buttonSecondary}
                      >
                        Open lesson
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
