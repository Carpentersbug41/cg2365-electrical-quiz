'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './styles.module.css';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  buildDynamicGuidedV2SectionAttachmentFromLesson,
  loadDynamicGuidedV2Lesson,
} from '@/lib/dynamicGuidedV2/loader';
import type { DynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/types';

type ThreadTurn = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  stepId?: string;
};

type DebugPayload = {
  mode: 'baseline' | 'lesson';
  runtimeVariant?: 'control' | 'lean_feedback_v1' | null;
  replyClass?: 'correct' | 'partial' | 'misconception' | 'unclear' | null;
  userId?: string | null;
  profileFound?: boolean;
  finishReason?: string | null;
  attachment?: {
    filename: string;
    chars: number;
  } | null;
  systemInstruction: string;
  attachmentText?: string | null;
  lessonTurnInstruction?: string | null;
  geminiRequest?: unknown;
  geminiRequestRaw?: string | null;
  conversationHistory: Array<{ role: string; text: string }>;
  latestUserMessage: string | null;
  lessonCode?: string;
  lessonStepIndex?: number | null;
  lessonSectionPhase?:
    | 'teach'
    | 'feedback_basic'
    | 'feedback_deeper'
    | 'worked_example_feedback'
    | 'integrative_feedback'
    | null;
  feedbackPhase?: 'feedback_basic' | 'feedback_deeper' | 'worked_example_feedback' | 'integrative_feedback' | null;
  feedbackDeeperTurnCount?: number | null;
  progressionGate?: boolean | null;
  lessonStepTitle?: string | null;
  lessonStepStage?: string | null;
  lessonStepRole?: string | null;
  lessonCompletionMode?: 'continue' | 'respond' | null;
  lessonStepTotal?: number | null;
  autoAdvance?: boolean | null;
  nextStepId?: string | null;
  nextStepIndex?: number | null;
  nextStepRole?: string | null;
  nextStepStage?: string | null;
  feedbackResolved?: boolean | null;
  feedbackNext?: 'baseline' | 'feedback' | 'teach' | null;
  responseAssistantMessage?: string | null;
  dynamicVersionId?: string | null;
};

type ConversationHistoryTurn = { role: 'assistant' | 'user'; text: string };

type AssistantRequestResult = {
  systemInstruction: string;
  lessonStepIndexHeader: number;
  lessonStepStageHeader: string;
  lessonStepRoleHeader: string;
  lessonCompletionModeHeader: string;
  lessonStepTotalHeader: number;
  feedbackPhaseHeader: string | null;
  feedbackDeeperTurnCountHeader: number;
  progressionGateHeader: string | null;
  feedbackResolvedHeader: string | null;
  feedbackNextHeader: string | null;
  assistantText: string;
  autoAdvance: boolean;
  nextStepId: string | null;
  nextStepIndex: number | null;
  nextStepRole: string | null;
  nextStepStage: string | null;
};

function formatLessonConsoleLabel(params: {
  lessonCode: string;
  stepIndex: number | null;
  stepTitle: string | null;
  stepStage: string | null;
  stepRole: string | null;
  phase: string | null;
}) {
  const stepNumber = params.stepIndex !== null && Number.isFinite(params.stepIndex) ? params.stepIndex + 1 : '?';
  const stepTitle = params.stepTitle || 'Unknown step';
  const stepStage = params.stepStage || 'unknown_stage';
  const stepRole = params.stepRole || 'unknown_role';
  const phase = params.phase || 'unknown_phase';
  return `${params.lessonCode} | step ${stepNumber} | ${stepTitle} | stage=${stepStage} | role=${stepRole} | phase=${phase}`;
}

function formatFullModelInput(geminiRequest: unknown): string {
  if (!geminiRequest || typeof geminiRequest !== 'object') return '';

  const request = geminiRequest as {
    systemInstruction?: unknown;
    contents?: Array<{ role?: string; parts?: Array<{ text?: string }> }>;
    generationConfig?: unknown;
  };

  const blocks: string[] = [];

  if (typeof request.systemInstruction === 'string' && request.systemInstruction.trim()) {
    blocks.push(`SYSTEM INSTRUCTION\n\n${request.systemInstruction}`);
  }

  if (Array.isArray(request.contents)) {
    request.contents.forEach((content, index) => {
      const role = typeof content?.role === 'string' ? content.role : 'unknown';
      const text = Array.isArray(content?.parts)
        ? content.parts
            .map((part) => (typeof part?.text === 'string' ? part.text : ''))
            .filter(Boolean)
            .join('\n\n')
        : '';

      blocks.push(`CONTENTS[${index}] role=${role}\n\n${text || '[no text part]'}`);
    });
  }

  if (request.generationConfig) {
    blocks.push(`GENERATION CONFIG\n\n${JSON.stringify(request.generationConfig, null, 2)}`);
  }

  return blocks.join('\n\n-----\n\n');
}

type AttachedDocument = {
  filename: string;
  fileType: 'pdf' | 'docx' | 'txt';
  extractedChars: number;
  text: string;
};

type LoadingBarState = {
  offset: number;
  durationMs: number;
  width: number;
  shimmerDurationMs: number;
  shimmerDelayMs: number;
  shimmerOpacity: number;
  shimmerScale: number;
};

const INITIAL_LOADING_BARS: LoadingBarState[] = [
  { offset: -82, durationMs: 1600, width: 82, shimmerDurationMs: 1480, shimmerDelayMs: 0, shimmerOpacity: 0.58, shimmerScale: 1.02 },
  { offset: -78, durationMs: 2100, width: 78, shimmerDurationMs: 1710, shimmerDelayMs: 120, shimmerOpacity: 0.46, shimmerScale: 0.94 },
  { offset: -86, durationMs: 1800, width: 86, shimmerDurationMs: 1390, shimmerDelayMs: 260, shimmerOpacity: 0.64, shimmerScale: 1.08 },
];

const LESSON_OPTIONS = [
  { code: '203-4A', label: '203-4A Earthing Systems and ADS Components' },
  { code: '203-4C', label: '203-4C Earth Loop Impedance Path' },
  { code: '203-4L1E', label: '203-4L1E Earthing Systems (Noob): TT, TN-S, TN-C-S' },
] as const;

const THINKING_MESSAGES = [
  'Thinking...',
  'Retrieving context...',
  'Checking the thread...',
  'Working through that...',
  'Shaping a reply...',
  'Pulling the right context...',
  'Organising the answer...',
  'Checking what matters here...',
  'Preparing the next step...',
  'Finalising the reply...',
];

export default function SimpleChatbotPage() {
  const searchParams = useSearchParams();
  const [thread, setThread] = useState<ThreadTurn[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [debugPayload, setDebugPayload] = useState<DebugPayload | null>(null);
  const [attachment, setAttachment] = useState<AttachedDocument | null>(null);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [lessonMode, setLessonMode] = useState(false);
  const [runtimeVariant, setRuntimeVariant] = useState<'control' | 'lean_feedback_v1'>('lean_feedback_v1');
  const [selectedLessonCode, setSelectedLessonCode] = useState<string>('203-4C');
  const [dynamicVersionId, setDynamicVersionId] = useState<string | null>(null);
  const [dynamicLessonData, setDynamicLessonData] = useState<DynamicGuidedV2Lesson | null>(null);
  const [lessonStepIndex, setLessonStepIndex] = useState(0);
  const [jumpStepIndex, setJumpStepIndex] = useState(0);
  const [jumpPhase, setJumpPhase] = useState<
    'teach' | 'feedback_basic' | 'feedback_deeper' | 'worked_example_feedback' | 'integrative_feedback'
  >('teach');
  const [lessonSectionPhase, setLessonSectionPhase] = useState<
    'teach' | 'feedback_basic' | 'feedback_deeper' | 'worked_example_feedback' | 'integrative_feedback'
  >('teach');
  const [lessonDeeperTurnCount, setLessonDeeperTurnCount] = useState(0);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [loadingBars, setLoadingBars] = useState<LoadingBarState[]>(INITIAL_LOADING_BARS);
  const threadRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentLessonData = useMemo(
    () =>
      lessonMode
        ? dynamicLessonData ?? loadDynamicGuidedV2Lesson(selectedLessonCode)
        : null,
    [dynamicLessonData, lessonMode, selectedLessonCode]
  );
  const currentLessonAttachment = useMemo(
    () =>
      lessonMode && currentLessonData
        ? buildDynamicGuidedV2SectionAttachmentFromLesson(
            currentLessonData,
            lessonStepIndex,
            lessonSectionPhase === 'teach' ? 'teach' : 'feedback'
          )
        : null,
    [currentLessonData, lessonMode, lessonStepIndex, lessonSectionPhase]
  );
  const lessonOptions = useMemo(() => {
    if (currentLessonData && !LESSON_OPTIONS.some((option) => option.code === currentLessonData.lessonCode)) {
      return [
        ...LESSON_OPTIONS,
        {
          code: currentLessonData.lessonCode,
          label: `${currentLessonData.lessonCode} ${currentLessonData.title}`,
        },
      ];
    }
    return LESSON_OPTIONS;
  }, [currentLessonData]);
  const jumpStep = useMemo(
    () => (currentLessonData ? currentLessonData.steps[jumpStepIndex] ?? null : null),
    [currentLessonData, jumpStepIndex]
  );
  const availableJumpPhases = useMemo(() => {
    if (!jumpStep) {
      return [{ value: 'teach', label: 'teach' }] as Array<{
        value: 'teach' | 'feedback_basic' | 'feedback_deeper' | 'worked_example_feedback' | 'integrative_feedback';
        label: string;
      }>;
    }

    if (jumpStep.stage === 'teach_check') {
      return [
        { value: 'teach', label: 'teach_check prompt' },
        { value: 'feedback_basic', label: 'feedback_basic' },
        { value: 'feedback_deeper', label: 'feedback_deeper' },
      ] as const;
    }

    if (jumpStep.role === 'worked_example') {
      return [
        { value: 'teach', label: 'worked_example prompt' },
        { value: 'worked_example_feedback', label: 'worked_example_feedback' },
      ] as const;
    }

    if (jumpStep.role === 'integrative') {
      return [
        { value: 'teach', label: 'integrative prompt' },
        { value: 'integrative_feedback', label: 'integrative_feedback' },
      ] as const;
    }

    return [{ value: 'teach', label: `${jumpStep.stage} prompt` }] as const;
  }, [jumpStep]);

  useEffect(() => {
    setJumpStepIndex(0);
    setJumpPhase('teach');
  }, [selectedLessonCode, lessonMode]);

  useEffect(() => {
    const lessonModeParam = searchParams?.get('lessonMode') ?? null;
    const lessonCodeParam = searchParams?.get('lessonCode') ?? null;
    const dynamicVersionIdParam = searchParams?.get('dynamicVersionId') ?? null;
    const runtimeVariantParam = searchParams?.get('runtimeVariant') ?? null;

    if (lessonModeParam === '1') {
      setLessonMode(true);
    }

    if (lessonCodeParam?.trim()) {
      setSelectedLessonCode(lessonCodeParam.trim().toUpperCase());
    }

    setDynamicVersionId(dynamicVersionIdParam?.trim() ? dynamicVersionIdParam.trim() : null);
    setRuntimeVariant(runtimeVariantParam === 'control' ? 'control' : 'lean_feedback_v1');
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function loadDynamicLessonVersion(versionId: string) {
      try {
        const response = await fetch(`/api/dynamic-guided-v2/versions/${encodeURIComponent(versionId)}`);
        const data = (await response.json()) as { lesson?: DynamicGuidedV2Lesson; error?: string };
        if (!response.ok || !data.lesson) {
          throw new Error(data.error || 'Unable to load generated dynamic lesson.');
        }
        if (cancelled) return;
        setDynamicLessonData(data.lesson);
        setSelectedLessonCode(data.lesson.lessonCode);
      } catch (error) {
        if (cancelled) return;
        setDynamicLessonData(null);
        setError(error instanceof Error ? error.message : 'Unable to load generated dynamic lesson.');
      }
    }

    if (dynamicVersionId) {
      void loadDynamicLessonVersion(dynamicVersionId);
      return () => {
        cancelled = true;
      };
    }

    setDynamicLessonData(null);
    return () => {
      cancelled = true;
    };
  }, [dynamicVersionId]);

  useEffect(() => {
    if (!availableJumpPhases.some((phase) => phase.value === jumpPhase)) {
      setJumpPhase(availableJumpPhases[0]?.value ?? 'teach');
    }
  }, [availableJumpPhases, jumpPhase]);

  function showStatusNotice(text: string) {
    setStatusNotice(text);
    window.setTimeout(() => {
      setStatusNotice((current) => (current === text ? null : current));
    }, 2200);
  }

  async function authedFetch(path: string, init?: RequestInit): Promise<Response> {
    const client = getSupabaseBrowserClient();
    const session = client ? await client.auth.getSession() : null;
    const token = session?.data.session?.access_token ?? null;

    const headers = new Headers(init?.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return fetch(path, {
      ...init,
      headers,
    });
  }

  function applyLessonResponseState(
    result: AssistantRequestResult,
    currentStepIndexValue: number,
    currentPhaseValue: 'teach' | 'feedback_basic' | 'feedback_deeper' | 'worked_example_feedback' | 'integrative_feedback'
  ) {
    if (!lessonMode) return;

    if (currentStepIndexValue === 0) {
      setLessonStepIndex(1);
      setLessonSectionPhase('teach');
      setLessonDeeperTurnCount(0);
      return;
    }

    if (currentPhaseValue === 'teach') {
      if (result.lessonStepStageHeader === 'teach_check') {
        setLessonSectionPhase('feedback_basic');
        setLessonDeeperTurnCount(0);
      } else if (result.lessonStepRoleHeader === 'worked_example') {
        setLessonSectionPhase('worked_example_feedback');
        setLessonDeeperTurnCount(0);
      } else if (result.lessonStepRoleHeader === 'integrative') {
        setLessonSectionPhase('integrative_feedback');
        setLessonDeeperTurnCount(0);
      } else if (result.lessonCompletionModeHeader === 'continue') {
        const totalSteps = Number.isFinite(result.lessonStepTotalHeader) ? result.lessonStepTotalHeader : 0;
        if (totalSteps > 0 && currentStepIndexValue + 1 >= totalSteps) {
          setLessonComplete(true);
          setThread((current) => [
            ...current,
            {
              id: `system-${Date.now()}`,
              role: 'system',
              text: 'Lesson complete. Refresh chat to start again.',
            },
          ]);
        } else {
          setLessonStepIndex((current) => current + 1);
          setLessonSectionPhase('teach');
          setLessonDeeperTurnCount(0);
        }
      } else {
        setLessonSectionPhase('feedback_deeper');
        setLessonDeeperTurnCount(1);
      }
      return;
    }

    if (currentPhaseValue === 'feedback_basic') {
      setLessonSectionPhase('feedback_deeper');
      setLessonDeeperTurnCount(1);
      return;
    }

    const shouldAdvance =
      result.feedbackResolvedHeader === 'true' &&
      (result.feedbackNextHeader === 'baseline' || result.feedbackNextHeader === 'teach');
    const totalSteps = Number.isFinite(result.lessonStepTotalHeader) ? result.lessonStepTotalHeader : 0;

    if (shouldAdvance && totalSteps > 0 && currentStepIndexValue + 1 >= totalSteps) {
      setLessonComplete(true);
      setThread((current) => [
        ...current,
        {
          id: `system-${Date.now()}`,
          role: 'system',
          text: 'Lesson complete. Refresh chat to start again.',
        },
      ]);
    } else if (shouldAdvance) {
      setLessonStepIndex((current) => current + 1);
      setLessonSectionPhase('teach');
      setLessonDeeperTurnCount(0);
    } else {
      setLessonSectionPhase((current) => current);
      setLessonDeeperTurnCount((current) =>
        currentPhaseValue === 'feedback_deeper' ? current + 1 : current
      );
    }
  }

  async function requestAssistantTurn(params: {
    message: string;
    conversationHistory: ConversationHistoryTurn[];
    lessonStepIndexValue: number;
    lessonSectionPhaseValue: 'teach' | 'feedback_basic' | 'feedback_deeper' | 'worked_example_feedback' | 'integrative_feedback';
    lessonDeeperTurnCountValue: number;
    appendVisibleAssistant: boolean;
    latestUserMessageForDebug: string | null;
  }): Promise<AssistantRequestResult> {
    const response = await authedFetch('/api/simple-chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: params.message,
        thread: params.conversationHistory,
        lessonCode: lessonMode && !lessonComplete ? selectedLessonCode : '',
        dynamicVersionId: lessonMode && !lessonComplete ? dynamicVersionId : null,
        lessonStepIndex: lessonMode ? params.lessonStepIndexValue : 0,
        lessonSectionPhase: lessonMode ? params.lessonSectionPhaseValue : 'teach',
        lessonDeeperTurnCount: lessonMode ? params.lessonDeeperTurnCountValue : 0,
        runtimeVariant,
        attachment: attachment
          ? {
              filename: attachment.filename,
              text: attachment.text,
            }
          : null,
      }),
    });
    if (!response.ok || !response.body) {
      throw new Error('Unable to get a response.');
    }

    const systemInstruction = decodeURIComponent(
      response.headers.get('x-simple-chatbot-system-instruction') ?? ''
    );
    const userIdHeader = decodeURIComponent(response.headers.get('x-simple-chatbot-user-id') ?? '');
    const profileFound = response.headers.get('x-simple-chatbot-profile-found') === 'true';
    const finishReasonHeader = decodeURIComponent(response.headers.get('x-simple-chatbot-finish-reason') ?? '');
    const attachmentFilename = decodeURIComponent(
      response.headers.get('x-simple-chatbot-attachment-filename') ?? ''
    );
    const attachmentChars = Number(response.headers.get('x-simple-chatbot-attachment-chars') ?? '0');
    const attachmentTextHeader = decodeURIComponent(
      response.headers.get('x-simple-chatbot-attachment-text') ?? ''
    );
    const lessonStepIndexHeader = Number(response.headers.get('x-simple-chatbot-lesson-step-index') ?? '');
    const lessonStepTitleHeader = decodeURIComponent(
      response.headers.get('x-simple-chatbot-lesson-step-title') ?? ''
    );
    const lessonStepStageHeader = decodeURIComponent(
      response.headers.get('x-simple-chatbot-lesson-step-stage') ?? ''
    );
    const lessonStepRoleHeader = decodeURIComponent(
      response.headers.get('x-simple-chatbot-lesson-step-role') ?? ''
    );
    const lessonCompletionModeHeader = decodeURIComponent(
      response.headers.get('x-simple-chatbot-lesson-completion-mode') ?? ''
    );
    const lessonStepTotalHeader = Number(response.headers.get('x-simple-chatbot-lesson-step-total') ?? '');
    const lessonTurnInstructionHeader = decodeURIComponent(
      response.headers.get('x-simple-chatbot-lesson-turn-instruction') ?? ''
    );
    const runtimeVariantHeader = response.headers.get('x-simple-chatbot-runtime-variant');
    const replyClassHeader = response.headers.get('x-simple-chatbot-reply-class');
    const geminiRequestHeader = decodeURIComponent(
      response.headers.get('x-simple-chatbot-gemini-request') ?? ''
    );
    const feedbackPhaseHeader = response.headers.get('x-simple-chatbot-feedback-phase');
    const feedbackDeeperTurnCountHeader = Number(
      response.headers.get('x-simple-chatbot-feedback-deeper-turn-count') ?? '0'
    );
    const progressionGateHeader = response.headers.get('x-simple-chatbot-progression-gate');
    const feedbackResolvedHeader = response.headers.get('x-simple-chatbot-feedback-resolved');
    const feedbackNextHeader = response.headers.get('x-simple-chatbot-feedback-next');
    const autoAdvanceHeader = response.headers.get('x-simple-chatbot-auto-advance');
    const nextStepIdHeader = decodeURIComponent(response.headers.get('x-simple-chatbot-next-step-id') ?? '');
    const nextStepIndexHeader = Number(response.headers.get('x-simple-chatbot-next-step-index') ?? '');
    const nextStepRoleHeader = decodeURIComponent(response.headers.get('x-simple-chatbot-next-step-role') ?? '');
    const nextStepStageHeader = decodeURIComponent(response.headers.get('x-simple-chatbot-next-step-stage') ?? '');

    let parsedGeminiRequest: unknown = null;
    if (geminiRequestHeader) {
      try {
        parsedGeminiRequest = JSON.parse(geminiRequestHeader);
      } catch {
        parsedGeminiRequest = geminiRequestHeader;
      }
    }

    const nextDebugPayload: DebugPayload = {
      mode: lessonMode ? 'lesson' : 'baseline',
      runtimeVariant:
        runtimeVariantHeader === 'lean_feedback_v1' || runtimeVariantHeader === 'control'
          ? runtimeVariantHeader
          : null,
      replyClass:
        replyClassHeader === 'correct' ||
        replyClassHeader === 'partial' ||
        replyClassHeader === 'misconception' ||
        replyClassHeader === 'unclear'
          ? replyClassHeader
          : null,
      userId: userIdHeader || null,
      profileFound,
      finishReason: finishReasonHeader || null,
      attachment: attachmentFilename
        ? {
            filename: attachmentFilename,
            chars: Number.isFinite(attachmentChars) ? attachmentChars : 0,
          }
        : null,
      systemInstruction,
      attachmentText: attachmentTextHeader || null,
      lessonTurnInstruction: lessonTurnInstructionHeader || null,
      geminiRequest: parsedGeminiRequest,
      geminiRequestRaw: geminiRequestHeader || null,
      conversationHistory: params.conversationHistory,
      latestUserMessage: params.latestUserMessageForDebug,
      lessonCode: lessonMode ? selectedLessonCode : undefined,
      lessonStepIndex: Number.isFinite(lessonStepIndexHeader) ? lessonStepIndexHeader : null,
      lessonSectionPhase: lessonMode ? params.lessonSectionPhaseValue : null,
      feedbackPhase:
        feedbackPhaseHeader === 'feedback_basic' ||
        feedbackPhaseHeader === 'feedback_deeper' ||
        feedbackPhaseHeader === 'worked_example_feedback' ||
        feedbackPhaseHeader === 'integrative_feedback'
          ? feedbackPhaseHeader
          : null,
      feedbackDeeperTurnCount: Number.isFinite(feedbackDeeperTurnCountHeader)
        ? feedbackDeeperTurnCountHeader
        : null,
      progressionGate:
        progressionGateHeader === 'true'
          ? true
          : progressionGateHeader === 'false'
            ? false
            : null,
      lessonStepTitle: lessonStepTitleHeader || null,
      lessonStepStage: lessonStepStageHeader || null,
      lessonStepRole: lessonStepRoleHeader || null,
      lessonCompletionMode:
        lessonCompletionModeHeader === 'continue' || lessonCompletionModeHeader === 'respond'
          ? lessonCompletionModeHeader
          : null,
      lessonStepTotal: Number.isFinite(lessonStepTotalHeader) ? lessonStepTotalHeader : null,
      autoAdvance:
        autoAdvanceHeader === 'true' ? true : autoAdvanceHeader === 'false' ? false : null,
      nextStepId: nextStepIdHeader || null,
      nextStepIndex: Number.isFinite(nextStepIndexHeader) ? nextStepIndexHeader : null,
      nextStepRole: nextStepRoleHeader || null,
      nextStepStage: nextStepStageHeader || null,
      feedbackResolved:
        feedbackResolvedHeader === 'true'
          ? true
          : feedbackResolvedHeader === 'false'
            ? false
            : null,
      feedbackNext:
        feedbackNextHeader === 'baseline' || feedbackNextHeader === 'feedback' || feedbackNextHeader === 'teach'
          ? feedbackNextHeader
          : null,
      responseAssistantMessage: null,
      dynamicVersionId: lessonMode ? dynamicVersionId : null,
    };

    setDebugPayload(nextDebugPayload);
    console.groupCollapsed(
      '[simple-chatbot][lesson]',
      formatLessonConsoleLabel({
        lessonCode: lessonMode ? selectedLessonCode : 'baseline',
        stepIndex: Number.isFinite(lessonStepIndexHeader) ? lessonStepIndexHeader : null,
        stepTitle: lessonStepTitleHeader || null,
        stepStage: lessonStepStageHeader || null,
        stepRole: lessonStepRoleHeader || null,
        phase: lessonMode ? params.lessonSectionPhaseValue : null,
      })
    );
    console.log('summary', {
      lessonCode: lessonMode ? selectedLessonCode : null,
      dynamicVersionId: lessonMode ? dynamicVersionId : null,
      runtimeVariant,
      stepIndex: Number.isFinite(lessonStepIndexHeader) ? lessonStepIndexHeader : null,
      stepTitle: lessonStepTitleHeader || null,
      stepStage: lessonStepStageHeader || null,
      stepRole: lessonStepRoleHeader || null,
      lessonSectionPhase: lessonMode ? params.lessonSectionPhaseValue : null,
      feedbackPhase: feedbackPhaseHeader,
      progressionGate: progressionGateHeader,
      autoAdvance: autoAdvanceHeader,
      nextStepId: nextStepIdHeader || null,
      nextStepIndex: Number.isFinite(nextStepIndexHeader) ? nextStepIndexHeader : null,
      nextStepRole: nextStepRoleHeader || null,
      nextStepStage: nextStepStageHeader || null,
      replyClass:
        replyClassHeader === 'correct' ||
        replyClassHeader === 'partial' ||
        replyClassHeader === 'misconception' ||
        replyClassHeader === 'unclear'
          ? replyClassHeader
          : null,
    });
    console.log('payload', nextDebugPayload);
    console.groupEnd();

    const shouldSuppressAssistant = autoAdvanceHeader === 'true' || !params.appendVisibleAssistant;
    const assistantId =
      shouldSuppressAssistant
        ? null
        : `assistant-${Date.now()}`;

    if (assistantId) {
      setThread((current) => [
        ...current,
        {
          id: assistantId,
          role: 'assistant',
          text: '',
        },
      ]);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let assistantText = '';

    while (!done) {
      const result = await reader.read();
      done = result.done;
      if (result.value) {
        const chunk = decoder.decode(result.value, { stream: !done });
        assistantText += chunk;
        if (assistantId) {
          setThread((current) =>
            current.map((turn) =>
              turn.id === assistantId
                ? {
                    ...turn,
                    text: turn.text + chunk,
                  }
                : turn
            )
          );
        }
      }
    }

    setDebugPayload((current) =>
      current
        ? {
            ...current,
            responseAssistantMessage: assistantText,
          }
        : current
    );

    return {
      systemInstruction,
      lessonStepIndexHeader,
      lessonStepStageHeader,
      lessonStepRoleHeader,
      lessonCompletionModeHeader,
      lessonStepTotalHeader,
      feedbackPhaseHeader,
      feedbackDeeperTurnCountHeader,
      progressionGateHeader,
      feedbackResolvedHeader,
      feedbackNextHeader,
      assistantText,
      autoAdvance: autoAdvanceHeader === 'true',
      nextStepId: nextStepIdHeader || null,
      nextStepIndex: Number.isFinite(nextStepIndexHeader) ? nextStepIndexHeader : null,
      nextStepRole: nextStepRoleHeader || null,
      nextStepStage: nextStepStageHeader || null,
    };
  }

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [thread]);

  useEffect(() => {
    if (thread.length === 0) return;
    const latestTurn = thread[thread.length - 1];
    if (latestTurn.role !== 'assistant') return;
    console.log('[simple-chatbot][client] latest_reply', {
      stepId: latestTurn.stepId ?? null,
      text: latestTurn.text,
    });
  }, [thread]);

  useEffect(() => {
    if (!loading) return;

    let timeoutId: number;

    const scheduleNext = () => {
      timeoutId = window.setTimeout(() => {
        setThinkingIndex((current) => (current + 1) % THINKING_MESSAGES.length);
        scheduleNext();
      }, 2000 + Math.floor(Math.random() * 3000));
    };

    scheduleNext();

    return () => window.clearTimeout(timeoutId);
  }, [loading]);

  useEffect(() => {
    if (!loading) {
      setLoadingBars(INITIAL_LOADING_BARS);
      return;
    }

    const timeoutIds: number[] = [];

    const scheduleBar = (index: number) => {
      const tick = () => {
        setLoadingBars((current) =>
          current.map((bar, barIndex) => {
            if (barIndex !== index) return bar;

            const shouldPause = Math.random() < 0.28;
            if (shouldPause) {
              return {
                ...bar,
                durationMs: 900 + Math.floor(Math.random() * 1800),
              };
            }

            const step = 2.4 + Math.random() * 5.2;
            const nextOffset = bar.offset > 112 ? -bar.width - (4 + Math.random() * 14) : bar.offset + step;
            return {
              ...bar,
              offset: nextOffset,
              durationMs: 900 + Math.floor(Math.random() * 2200),
            };
          })
        );

        const nextDelay = 700 + Math.floor(Math.random() * 2200);
        timeoutIds[index] = window.setTimeout(tick, nextDelay);
      };

      timeoutIds[index] = window.setTimeout(tick, 220 + index * 260);
    };

    scheduleBar(0);
    scheduleBar(1);
    scheduleBar(2);

    return () => {
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, [loading]);

  useEffect(() => {
    if (!loading) return;

    const timeoutIds: number[] = [];

    const scheduleShimmer = (index: number) => {
      const tick = () => {
        setLoadingBars((current) =>
          current.map((bar, barIndex) => {
            if (barIndex !== index) return bar;

            return {
              ...bar,
              shimmerDurationMs: 1180 + Math.floor(Math.random() * 1150),
              shimmerDelayMs: Math.floor(Math.random() * 420),
              shimmerOpacity: 0.34 + Math.random() * 0.38,
              shimmerScale: 0.82 + Math.random() * 0.48,
            };
          })
        );

        timeoutIds[index] = window.setTimeout(tick, 900 + Math.floor(Math.random() * 2200));
      };

      timeoutIds[index] = window.setTimeout(tick, 280 + index * 170);
    };

    scheduleShimmer(0);
    scheduleShimmer(1);
    scheduleShimmer(2);

    return () => {
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, [loading]);

  function handleResetChat() {
    setThread([]);
    setDraft('');
    setError(null);
    setLoading(false);
    setThinkingIndex(0);
    setDebugPayload(null);
    setAttachment(null);
    setLessonStepIndex(0);
    setLessonSectionPhase('teach');
    setLessonDeeperTurnCount(0);
    setLessonComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showStatusNotice('Chat reset.');
  }

  async function handleAttachmentUpload(file: File | null) {
    if (!file) return;
    setUploadingAttachment(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await authedFetch('/api/simple-chatbot/source-upload', {
        method: 'POST',
        body: formData,
      });
      const payload = (await response.json()) as
        | ({ success: true; filename: string; fileType: 'pdf' | 'docx' | 'txt'; extractedChars: number; text: string })
        | { error?: string };

      if (!response.ok || !('success' in payload)) {
        throw new Error(('error' in payload && payload.error) || 'Failed to extract attached document.');
      }

      setAttachment({
        filename: payload.filename,
        fileType: payload.fileType,
        extractedChars: payload.extractedChars,
        text: payload.text,
      });
      showStatusNotice(`Attached ${payload.filename}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract attached document.');
    } finally {
      setUploadingAttachment(false);
    }
  }

  async function submitCurrentMessage(message: string) {
    if (!message || loading) return;
    if (lessonMode && lessonComplete) {
      showStatusNotice('Lesson complete. Refresh chat to start again.');
      return;
    }

    const userTurn: ThreadTurn = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: message,
    };
    const nextThread = [...thread, userTurn];
    setThread(nextThread);
    setDraft('');
    setLoading(true);
    setThinkingIndex(0);
    setError(null);

    try {
      const conversationHistory = thread
        .filter((turn) => turn.role !== 'system')
        .map((turn): ConversationHistoryTurn => ({
          role: turn.role === 'assistant' ? 'assistant' : 'user',
          text: turn.text,
        }));

      console.log('[simple-chatbot][client] submit', {
        lessonCode: lessonMode ? selectedLessonCode : null,
        attachment: attachment
          ? { filename: attachment.filename, chars: attachment.text.length }
          : null,
        conversationHistory,
        latestUserMessage: message,
      });
      const firstResult = await requestAssistantTurn({
        message,
        conversationHistory,
        lessonStepIndexValue: lessonStepIndex,
        lessonSectionPhaseValue: lessonSectionPhase,
        lessonDeeperTurnCountValue: lessonDeeperTurnCount,
        appendVisibleAssistant: true,
        latestUserMessageForDebug: message,
      });

      if (lessonMode && firstResult.autoAdvance && firstResult.nextStepIndex !== null) {
        console.log('[simple-chatbot][lesson][auto-advance]', {
          lessonCode: selectedLessonCode,
          fromStepIndex: lessonStepIndex,
          toStepIndex: firstResult.nextStepIndex,
          toStepRole: firstResult.nextStepRole,
          toStepStage: firstResult.nextStepStage,
        });
        setLessonStepIndex(firstResult.nextStepIndex);
        setLessonSectionPhase('teach');
        setLessonDeeperTurnCount(0);

        const autoConversationHistory = nextThread
          .filter((turn) => turn.role !== 'system')
          .map((turn) => ({ role: turn.role === 'assistant' ? 'assistant' : 'user', text: turn.text } satisfies ConversationHistoryTurn));

        const secondResult = await requestAssistantTurn({
          message: '',
          conversationHistory: autoConversationHistory,
          lessonStepIndexValue: firstResult.nextStepIndex,
          lessonSectionPhaseValue: 'teach',
          lessonDeeperTurnCountValue: 0,
          appendVisibleAssistant: true,
          latestUserMessageForDebug: null,
        });
        applyLessonResponseState(secondResult, firstResult.nextStepIndex, 'teach');
      } else {
        applyLessonResponseState(firstResult, lessonStepIndex, lessonSectionPhase);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to get a response.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await submitCurrentMessage(draft.trim());
  }

  function downloadTextFile(filename: string, text: string, mimeType = 'text/plain;charset=utf-8') {
    const blob = new Blob([text], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function handleDownloadLessonData() {
    if (!currentLessonData) return;
    downloadTextFile(
      `${currentLessonData.lessonCode}-lesson-data.json`,
      JSON.stringify(currentLessonData, null, 2),
      'application/json;charset=utf-8'
    );
  }

  function handleDownloadCurrentAttachment() {
    if (!currentLessonAttachment) return;
    downloadTextFile(currentLessonAttachment.filename, currentLessonAttachment.text);
  }

  function handleJumpToLessonStep() {
    if (!currentLessonData) return;
    const boundedStepIndex =
      jumpStepIndex >= 0 && jumpStepIndex < currentLessonData.steps.length ? jumpStepIndex : 0;
    const boundedPhase = availableJumpPhases.some((phase) => phase.value === jumpPhase)
      ? jumpPhase
      : availableJumpPhases[0]?.value ?? 'teach';

    setThread([]);
    setDebugPayload(null);
    setDraft('');
    setError(null);
    setLessonComplete(false);
    setLessonStepIndex(boundedStepIndex);
    setLessonSectionPhase(boundedPhase);
    setLessonDeeperTurnCount(boundedPhase === 'feedback_deeper' ? 1 : 0);
    showStatusNotice(
      `Jumped to step ${boundedStepIndex + 1}: ${
        currentLessonData.steps[boundedStepIndex]?.title ?? 'Unknown step'
      } (${boundedPhase}).`
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.eyebrow}>Baseline chatbot</div>
          <h1 className={styles.title}>Simple Chatbot</h1>
          <p className={styles.subtle}>
            Main experiment surface for prompt, attachment, and staged lesson testing.
          </p>
          <div className={styles.headerActions}>
            <button className={styles.resetButton} type="button" onClick={handleResetChat}>
              Refresh chat
            </button>
          </div>
        </header>

        <section className={styles.attachPanel}>
          <div>
            <div className={styles.debugTitle}>Mode</div>
            <p className={styles.subtle}>Switch between baseline chat and lesson-with-attachment mode.</p>
          </div>
          <div className={styles.modeRow}>
            <label className={styles.modeOption}>
              <input
                type="radio"
                checked={!lessonMode}
                onChange={() => {
                  handleResetChat();
                  setLessonMode(false);
                }}
              />
              <span>Baseline chat</span>
            </label>
            <label className={styles.modeOption}>
              <input
                type="radio"
                checked={lessonMode}
                onChange={() => {
                  handleResetChat();
                  setLessonMode(true);
                }}
              />
              <span>Lesson mode</span>
            </label>
          </div>
          {lessonMode ? (
            <div className={styles.lessonControls}>
              <select
                className={styles.select}
                data-testid="runtime-variant-select"
                value={runtimeVariant}
                onChange={(event) =>
                  setRuntimeVariant(event.target.value === 'lean_feedback_v1' ? 'lean_feedback_v1' : 'control')
                }
              >
                <option value="control">Runtime: control</option>
                <option value="lean_feedback_v1">Runtime: lean feedback v1</option>
              </select>
              <select
                className={styles.select}
                data-testid="lesson-select"
                value={selectedLessonCode}
                onChange={(event) => {
                  setSelectedLessonCode(event.target.value);
                  setLessonStepIndex(0);
                  setLessonSectionPhase('teach');
                  setLessonDeeperTurnCount(0);
                  setLessonComplete(false);
                  setThread([]);
                  setDebugPayload(null);
                }}
              >
                {lessonOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
              {currentLessonData ? (
                <div className={styles.lessonJumpPanel}>
                  <div className={styles.debugTitle}>Dev Jump</div>
                  <div className={styles.lessonJumpControls}>
                    <label className={styles.jumpField}>
                      <span className={styles.jumpLabel}>Step</span>
                      <select
                        className={styles.select}
                        data-testid="jump-step-select"
                        value={jumpStepIndex}
                        onChange={(event) => setJumpStepIndex(Number(event.target.value))}
                      >
                        {currentLessonData.steps.map((step, index) => (
                          <option key={step.id} value={index}>
                            {index + 1}. {step.title} [{step.stage}]
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className={styles.jumpField}>
                      <span className={styles.jumpLabel}>Phase</span>
                      <select
                        className={styles.select}
                        data-testid="jump-phase-select"
                        value={jumpPhase}
                        onChange={(event) =>
                          setJumpPhase(
                            event.target.value as
                              | 'teach'
                              | 'feedback_basic'
                              | 'feedback_deeper'
                              | 'worked_example_feedback'
                              | 'integrative_feedback'
                          )
                        }
                      >
                        {availableJumpPhases.map((phase) => (
                          <option key={phase.value} value={phase.value}>
                            {phase.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button className={styles.downloadButton} type="button" onClick={handleJumpToLessonStep}>
                      Jump
                    </button>
                  </div>
                </div>
              ) : null}
              <div className={styles.lessonDownloads}>
                <button
                  className={styles.downloadButton}
                  type="button"
                  onClick={handleDownloadLessonData}
                  disabled={!currentLessonData}
                >
                  Download lesson data
                </button>
                <button
                  className={styles.downloadButton}
                  type="button"
                  onClick={handleDownloadCurrentAttachment}
                  disabled={!currentLessonAttachment}
                >
                  Download current attachment
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <div className={styles.debugTitle}>Attachment</div>
                <p className={styles.subtle}>
                  Attach PDF, DOCX, or TXT and use it as grounding context for comparison tests.
                </p>
              </div>
              <input
                ref={fileInputRef}
                className={styles.fileInput}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(event) => void handleAttachmentUpload(event.target.files?.[0] ?? null)}
              />
              {uploadingAttachment ? <p className={styles.helper}>Extracting text...</p> : null}
              {attachment ? (
                <div className={styles.attachMeta}>
                  <span>{attachment.filename}</span>
                  <span>{attachment.fileType.toUpperCase()}</span>
                  <span>{attachment.extractedChars} chars</span>
                  <button
                    className={styles.clearButton}
                    type="button"
                    onClick={() => {
                      setAttachment(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                      showStatusNotice('Attachment cleared.');
                    }}
                  >
                    Clear
                  </button>
                </div>
              ) : null}
            </>
          )}
        </section>

        {statusNotice ? <div className={styles.statusNotice}>{statusNotice}</div> : null}

        {debugPayload ? (
          <section className={styles.debugPanel}>
            <div className={styles.debugTitle}>Live payload</div>
            <div className={styles.debugStack}>
              <div className={styles.debugSection}>
                <div className={styles.debugTitle}>System Instruction</div>
                <pre className={styles.debugText}>{debugPayload.systemInstruction}</pre>
              </div>
              {debugPayload.attachmentText ? (
                <div className={`${styles.debugSection} ${styles.debugAttachment}`}>
                  <div className={styles.debugTitle}>Injected Attachment Section</div>
                  <pre className={styles.debugText}>{debugPayload.attachmentText}</pre>
                </div>
              ) : null}
              {debugPayload.lessonTurnInstruction ? (
                <div className={`${styles.debugSection} ${styles.debugInstruction}`}>
                  <div className={styles.debugTitle}>Lesson Turn Instruction</div>
                  <pre className={styles.debugText}>{debugPayload.lessonTurnInstruction}</pre>
                </div>
              ) : null}
              {debugPayload.geminiRequest ? (
                <div className={`${styles.debugSection} ${styles.debugInstruction}`}>
                  <div className={styles.debugTitle}>Gemini Request (Exact)</div>
                  <pre className={styles.debugText}>
                    {typeof debugPayload.geminiRequest === 'string'
                      ? debugPayload.geminiRequest
                      : JSON.stringify(debugPayload.geminiRequest, null, 2)}
                  </pre>
                </div>
              ) : null}
              {debugPayload.geminiRequestRaw ? (
                <div className={`${styles.debugSection} ${styles.debugInstruction}`}>
                  <div className={styles.debugTitle}>Gemini Request (Raw JSON Sent)</div>
                  <pre className={styles.debugText}>{debugPayload.geminiRequestRaw}</pre>
                </div>
              ) : null}
              {debugPayload.geminiRequest ? (
                <div className={`${styles.debugSection} ${styles.debugAttachment}`}>
                  <div className={styles.debugTitle}>Full Model Input (In Order)</div>
                  <pre className={styles.debugText}>
                    {formatFullModelInput(debugPayload.geminiRequest)}
                  </pre>
                </div>
              ) : null}
              <div className={styles.debugSection}>
                <div className={styles.debugTitle}>Payload Meta</div>
                <pre className={styles.debugText}>
                  {JSON.stringify(
                    {
                      mode: debugPayload.mode,
                      runtimeVariant: debugPayload.runtimeVariant,
                      replyClass: debugPayload.replyClass,
                      userId: debugPayload.userId,
                      profileFound: debugPayload.profileFound,
                      finishReason: debugPayload.finishReason,
                      attachment: debugPayload.attachment,
                      latestUserMessage: debugPayload.latestUserMessage,
                      lessonCode: debugPayload.lessonCode,
                      dynamicVersionId: debugPayload.dynamicVersionId,
                      lessonStepIndex: debugPayload.lessonStepIndex,
                      lessonSectionPhase: debugPayload.lessonSectionPhase,
                      feedbackPhase: debugPayload.feedbackPhase,
                      feedbackDeeperTurnCount: debugPayload.feedbackDeeperTurnCount,
                      progressionGate: debugPayload.progressionGate,
                      lessonStepTitle: debugPayload.lessonStepTitle,
                      lessonStepStage: debugPayload.lessonStepStage,
                      lessonStepRole: debugPayload.lessonStepRole,
                      lessonStepTotal: debugPayload.lessonStepTotal,
                      feedbackResolved: debugPayload.feedbackResolved,
                      feedbackNext: debugPayload.feedbackNext,
                      conversationHistory: debugPayload.conversationHistory,
                      responseAssistantMessage: debugPayload.responseAssistantMessage,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </section>
        ) : null}

        <div ref={threadRef} className={styles.thread}>
          {thread.map((turn) => (
            <article
              key={turn.id}
              className={
                turn.role === 'user' ? styles.userTurn : turn.role === 'system' ? styles.systemTurn : styles.assistantTurn
              }
            >
              <div className={styles.turnRole}>
                {turn.role === 'user' ? 'You' : turn.role === 'system' ? 'Progression' : 'Assistant'}
              </div>
              <div className={styles.turnText}>{turn.text}</div>
            </article>
          ))}
          {loading ? (
            <div className={styles.loadingCard}>
              <div className={styles.loadingBars} aria-hidden="true">
                {loadingBars.map((bar, index) => (
                  <span key={index} className={styles.loadingBar}>
                    <span
                      className={styles.loadingBarFill}
                      style={{
                        width: `${bar.width}%`,
                        transform: `translateX(${bar.offset}%)`,
                        transitionDuration: `${bar.durationMs}ms`,
                        ['--loading-bar-shimmer-duration' as string]: `${bar.shimmerDurationMs}ms`,
                        ['--loading-bar-shimmer-delay' as string]: `${bar.shimmerDelayMs}ms`,
                        ['--loading-bar-shimmer-opacity' as string]: String(bar.shimmerOpacity),
                        ['--loading-bar-shimmer-scale' as string]: String(bar.shimmerScale),
                      }}
                    />
                  </span>
                ))}
              </div>
              <div className={styles.loading}>{THINKING_MESSAGES[thinkingIndex]}</div>
            </div>
          ) : null}
        </div>

        {error ? <div className={styles.error}>{error}</div> : null}

        {lessonMode ? (
          <div className={styles.composer}>
            <textarea
              className={styles.input}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
                placeholder={
                  thread.length === 0
                    ? 'Type a reply or leave blank and press Send to start the lesson...'
                    : 'Type a reply, question, or leave blank and press Send to continue...'
                }
                rows={3}
              />
              <div className={styles.lessonActions}>
                <button
                  className={styles.button}
                  disabled={loading}
                  type="button"
                  onClick={() =>
                    void submitCurrentMessage(
                      draft.trim() || (thread.length === 0 ? 'Start this lesson.' : 'Continue.')
                    )
                  }
                >
                  Send
                </button>
            </div>
          </div>
        ) : (
          <form className={styles.composer} onSubmit={handleSubmit}>
            <textarea
              className={styles.input}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type a message..."
              rows={3}
            />
            <button className={styles.button} disabled={loading || !draft.trim()} type="submit">
              Send
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
