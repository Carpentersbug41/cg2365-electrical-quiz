'use client';

/**
 * Debug Panel for Phase 10 Refinement
 * 
 * Displays comprehensive debug information about a refinement run:
 * - Timeline of phases
 * - Score comparisons
 * - Issues targeted
 * - Patches applied with validation and isolation results
 * - JSON diffs
 * - Postmortem analysis
 */

import React, { useState } from 'react';
import { GenerationDebugBundle, PatchDebug } from '@/lib/generation/types';

interface DebugPanelProps {
  debugBundle: GenerationDebugBundle;
}

export function DebugPanel({ debugBundle }: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (!debugBundle || !debugBundle.phase10?.triggered) {
    return null; // Don't show panel if Phase 10 wasn't triggered
  }

  const { baseline, phase10, diffs, postmortem } = debugBundle;
  const baselineScore = baseline.score?.total || 0;
  const refinedScore = phase10?.refined?.score?.total || 0;
  const scoreDelta = refinedScore - baselineScore;

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(debugBundle, null, 2));
    alert('Debug bundle copied to clipboard!');
  };

  const downloadMarkdown = () => {
    const markdown = generateMarkdownReport(debugBundle);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-${debugBundle.runId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg border-2 border-purple-400 dark:border-purple-600">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-6 text-purple-600 dark:text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-bold text-purple-900 dark:text-purple-200">
            Phase 10 Debug Report
          </h3>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded ${
              scoreDelta > 0
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : scoreDelta < 0
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
            }`}
          >
            {scoreDelta > 0 ? '+' : ''}{scoreDelta} points
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-6 py-4 border-t border-purple-200 dark:border-purple-800">
          {/* Action Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy JSON
            </button>
            <button
              onClick={downloadMarkdown}
              className="px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download .md
            </button>
          </div>

          {/* Collapsible Sections */}
          <div className="space-y-2">
            {/* Timeline */}
            <CollapsibleSection
              title="Timeline"
              isOpen={activeSection === 'timeline'}
              onToggle={() => toggleSection('timeline')}
            >
              <TimelineSection bundle={debugBundle} />
            </CollapsibleSection>

            {/* Score Comparison */}
            <CollapsibleSection
              title="Score Comparison"
              isOpen={activeSection === 'scores'}
              onToggle={() => toggleSection('scores')}
            >
              <ScoreComparisonSection baseline={baseline} phase10={phase10} />
            </CollapsibleSection>

            {/* Issues Targeted */}
            <CollapsibleSection
              title={`Issues Targeted (${phase10?.extractedIssues?.length || 0})`}
              isOpen={activeSection === 'issues'}
              onToggle={() => toggleSection('issues')}
            >
              <IssuesSection issues={phase10?.extractedIssues || []} />
            </CollapsibleSection>

            {/* Patches Table */}
            <CollapsibleSection
              title={`Patches Applied (${phase10?.patches?.length || 0})`}
              isOpen={activeSection === 'patches'}
              onToggle={() => toggleSection('patches')}
            >
              <PatchesTable patches={phase10?.patches || []} />
            </CollapsibleSection>

            {/* Patch Isolation View */}
            <CollapsibleSection
              title="Patch Isolation Scoring"
              isOpen={activeSection === 'isolation'}
              onToggle={() => toggleSection('isolation')}
            >
              <IsolationView patches={phase10?.patches || []} />
            </CollapsibleSection>

            {/* JSON Diff Viewer */}
            <CollapsibleSection
              title={`Changed Paths (${diffs?.changedPaths?.length || 0})`}
              isOpen={activeSection === 'diffs'}
              onToggle={() => toggleSection('diffs')}
            >
              <DiffsSection diffs={diffs} />
            </CollapsibleSection>

            {/* Postmortem Summary */}
            {postmortem && (
              <CollapsibleSection
                title="Postmortem Analysis"
                isOpen={activeSection === 'postmortem'}
                onToggle={() => toggleSection('postmortem')}
              >
                <PostmortemSection postmortem={postmortem} />
              </CollapsibleSection>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({ title, isOpen, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div className="border border-gray-300 dark:border-slate-600 rounded">
      <button
        onClick={onToggle}
        className="w-full px-4 py-2 flex items-center justify-between bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors rounded-t"
      >
        <span className="font-semibold text-sm text-gray-900 dark:text-white">{title}</span>
        <svg
          className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="p-4 bg-white dark:bg-slate-800">{children}</div>}
    </div>
  );
}

function TimelineSection({ bundle }: { bundle: GenerationDebugBundle }) {
  const baselineScore = bundle.baseline.score?.total || 0;
  const refinedScore = bundle.phase10?.refined?.score?.total || 0;
  const patchesCount = bundle.phase10?.patches?.length || 0;
  const acceptedCount = bundle.phase10?.patches?.filter(p => p.applyStatus === 'applied').length || 0;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span className="text-gray-700 dark:text-gray-300">Phases 1-9 completed</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        <span className="text-gray-700 dark:text-gray-300">
          Baseline score: {baselineScore}/100
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
        <span className="text-gray-700 dark:text-gray-300">
          Phase 10 triggered (score below {bundle.config.phase10Threshold})
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
        <span className="text-gray-700 dark:text-gray-300">
          Generated {patchesCount} patches ({acceptedCount} accepted)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        <span className="text-gray-700 dark:text-gray-300">
          Refined score: {refinedScore}/100
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            bundle.phase10?.accepted ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></span>
        <span className="text-gray-700 dark:text-gray-300">
          {bundle.phase10?.accepted ? 'Accepted' : 'Rejected'} (
          {refinedScore > baselineScore ? '+' : ''}
          {refinedScore - baselineScore} points)
        </span>
      </div>
    </div>
  );
}

function ScoreComparisonSection({ baseline, phase10 }: any) {
  if (!baseline.score || !phase10?.refined?.score) {
    return <div className="text-sm text-gray-500">No score data available</div>;
  }

  const baselineDetails = baseline.score.details || [];
  const refinedDetails = phase10.refined.score.details || [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-300 dark:border-slate-600">
            <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">
              Section
            </th>
            <th className="text-right py-2 px-2 font-semibold text-gray-900 dark:text-white">
              Before
            </th>
            <th className="text-right py-2 px-2 font-semibold text-gray-900 dark:text-white">
              After
            </th>
            <th className="text-right py-2 px-2 font-semibold text-gray-900 dark:text-white">
              Delta
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200 dark:border-slate-700 font-bold">
            <td className="py-2 px-2 text-gray-900 dark:text-white">Total</td>
            <td className="py-2 px-2 text-right text-gray-900 dark:text-white">
              {baseline.score.total}
            </td>
            <td className="py-2 px-2 text-right text-gray-900 dark:text-white">
              {phase10.refined.score.total}
            </td>
            <td
              className={`py-2 px-2 text-right font-bold ${
                phase10.refined.score.total - baseline.score.total > 0
                  ? 'text-green-600 dark:text-green-400'
                  : phase10.refined.score.total - baseline.score.total < 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {phase10.refined.score.total - baseline.score.total > 0 ? '+' : ''}
              {phase10.refined.score.total - baseline.score.total}
            </td>
          </tr>
          {baselineDetails.map((detail: any, idx: number) => {
            const refDetail = refinedDetails[idx];
            if (!refDetail) return null;
            const delta = refDetail.score - detail.score;
            return (
              <tr key={idx} className="border-b border-gray-200 dark:border-slate-700">
                <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{detail.section}</td>
                <td className="py-2 px-2 text-right text-gray-700 dark:text-gray-300">
                  {detail.score}/{detail.maxScore}
                </td>
                <td className="py-2 px-2 text-right text-gray-700 dark:text-gray-300">
                  {refDetail.score}/{refDetail.maxScore}
                </td>
                <td
                  className={`py-2 px-2 text-right ${
                    delta > 0
                      ? 'text-green-600 dark:text-green-400'
                      : delta < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {delta > 0 ? '+' : ''}
                  {delta}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function IssuesSection({ issues }: { issues: any[] }) {
  if (issues.length === 0) {
    return <div className="text-sm text-gray-500">No issues targeted</div>;
  }

  return (
    <div className="space-y-3">
      {issues.map((issue, idx) => (
        <div key={idx} className="border-l-4 border-yellow-500 pl-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-900 dark:text-white">
                {idx + 1}. [{issue.section}] {issue.issue}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Suggestion: {issue.suggestion}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Points lost: {issue.pointsLost}, Severity: {issue.severity.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PatchesTable({ patches }: { patches: PatchDebug[] }) {
  if (patches.length === 0) {
    return <div className="text-sm text-gray-500">No patches applied</div>;
  }

  return (
    <div className="space-y-4">
      {patches.map((patch, idx) => (
        <div
          key={idx}
          className={`border rounded p-3 ${
            patch.applyStatus === 'applied'
              ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10'
              : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="font-semibold text-sm text-gray-900 dark:text-white">
              Patch {idx + 1} - {patch.applyStatus.toUpperCase()}
            </div>
            <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
              {patch.op}
            </span>
          </div>
          <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
            <div>
              <span className="font-semibold">Path:</span> <code>{patch.path}</code>
            </div>
            <div>
              <span className="font-semibold">Reason:</span> {patch.reason || 'N/A'}
            </div>
            <div>
              <span className="font-semibold">Validation:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {patch.validation.targetExists ? (
                  <span className="px-1 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                    ✓ target exists
                  </span>
                ) : (
                  <span className="px-1 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded text-xs">
                    ✗ target missing
                  </span>
                )}
                {!patch.validation.wouldCreateStructure && (
                  <span className="px-1 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                    ✓ safe structure
                  </span>
                )}
                {patch.validation.allowedOp && (
                  <span className="px-1 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                    ✓ valid op
                  </span>
                )}
              </div>
            </div>
            {patch.scoreDeltaSequential !== undefined && (
              <div>
                <span className="font-semibold">Sequential Impact:</span>
                <span
                  className={
                    patch.scoreDeltaSequential > 0
                      ? 'text-green-600 dark:text-green-400'
                      : patch.scoreDeltaSequential < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }
                >
                  {' '}
                  {patch.scoreDeltaSequential > 0 ? '+' : ''}
                  {patch.scoreDeltaSequential} points
                </span>
              </div>
            )}
            {patch.scoreDeltaIndependent !== undefined && (
              <div>
                <span className="font-semibold">Independent Impact:</span>
                <span
                  className={
                    patch.scoreDeltaIndependent > 0
                      ? 'text-green-600 dark:text-green-400'
                      : patch.scoreDeltaIndependent < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }
                >
                  {' '}
                  {patch.scoreDeltaIndependent > 0 ? '+' : ''}
                  {patch.scoreDeltaIndependent} points
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function IsolationView({ patches }: { patches: PatchDebug[] }) {
  if (patches.length === 0 || !patches[0].scoreDeltaSequential) {
    return <div className="text-sm text-gray-500">No isolation data available</div>;
  }

  const harmfulPatches = patches.filter(
    p => (p.scoreDeltaSequential || 0) <= -2 || (p.scoreDeltaIndependent || 0) <= -2
  );

  return (
    <div className="space-y-4">
      {harmfulPatches.length > 0 && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded">
          <h4 className="font-semibold text-sm text-red-900 dark:text-red-200 mb-2">
            ⚠️ Harmful Patches Detected ({harmfulPatches.length})
          </h4>
          {harmfulPatches.map(p => (
            <div key={p.index} className="text-xs text-red-800 dark:text-red-300">
              Patch {p.index + 1}: {p.scoreDeltaSequential} points (sequential), {p.scoreDeltaIndependent} points (independent)
            </div>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-gray-300 dark:border-slate-600">
              <th className="text-left py-2 px-2 font-semibold">Patch</th>
              <th className="text-right py-2 px-2 font-semibold">Sequential</th>
              <th className="text-right py-2 px-2 font-semibold">Independent</th>
            </tr>
          </thead>
          <tbody>
            {patches.map(p => (
              <tr key={p.index} className="border-b border-gray-200 dark:border-slate-700">
                <td className="py-2 px-2">{p.index + 1}</td>
                <td
                  className={`py-2 px-2 text-right ${
                    (p.scoreDeltaSequential || 0) > 0
                      ? 'text-green-600 dark:text-green-400'
                      : (p.scoreDeltaSequential || 0) < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {(p.scoreDeltaSequential || 0) > 0 ? '+' : ''}
                  {p.scoreDeltaSequential || 0}
                </td>
                <td
                  className={`py-2 px-2 text-right ${
                    (p.scoreDeltaIndependent || 0) > 0
                      ? 'text-green-600 dark:text-green-400'
                      : (p.scoreDeltaIndependent || 0) < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {(p.scoreDeltaIndependent || 0) > 0 ? '+' : ''}
                  {p.scoreDeltaIndependent || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DiffsSection({ diffs }: any) {
  if (!diffs || diffs.changedPaths.length === 0) {
    return <div className="text-sm text-gray-500">No changes detected</div>;
  }

  return (
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
          Changed Paths ({diffs.changedPaths.length})
        </h4>
        <div className="max-h-60 overflow-y-auto">
          <ul className="space-y-1">
            {diffs.changedPaths.slice(0, 50).map((path: string, idx: number) => (
              <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 font-mono">
                • {path}
              </li>
            ))}
            {diffs.changedPaths.length > 50 && (
              <li className="text-xs text-gray-500 dark:text-gray-500">
                ... and {diffs.changedPaths.length - 50} more
              </li>
            )}
          </ul>
        </div>
      </div>

      {(diffs.idAudit.invalidIds.length > 0 || diffs.idAudit.duplicateIds.length > 0) && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded">
          <h4 className="font-semibold text-sm text-yellow-900 dark:text-yellow-200 mb-2">
            ID Audit Issues
          </h4>
          {diffs.idAudit.invalidIds.length > 0 && (
            <div className="mb-2">
              <span className="text-xs font-semibold text-yellow-800 dark:text-yellow-300">
                Invalid IDs:
              </span>
              <div className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                {diffs.idAudit.invalidIds.slice(0, 5).join(', ')}
              </div>
            </div>
          )}
          {diffs.idAudit.duplicateIds.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-yellow-800 dark:text-yellow-300">
                Duplicate IDs:
              </span>
              <div className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                {diffs.idAudit.duplicateIds.slice(0, 5).join(', ')}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PostmortemSection({ postmortem }: any) {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Root Cause</h4>
        <p className="text-gray-700 dark:text-gray-300">{postmortem.rootCause}</p>
      </div>

      {postmortem.harmfulPatches && postmortem.harmfulPatches.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Harmful Patches ({postmortem.harmfulPatches.length})
          </h4>
          <ul className="space-y-2">
            {postmortem.harmfulPatches.map((hp: any, idx: number) => (
              <li key={idx} className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Patch {hp.patchIndex + 1}:</span> {hp.why} (
                {hp.pointsLost} points)
              </li>
            ))}
          </ul>
        </div>
      )}

      {postmortem.recommendations && postmortem.recommendations.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Recommendations ({postmortem.recommendations.length})
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {postmortem.recommendations.map((rec: string, idx: number) => (
              <li key={idx} className="text-gray-700 dark:text-gray-300">
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Helper function to generate markdown report (for download)
function generateMarkdownReport(bundle: GenerationDebugBundle): string {
  const lines: string[] = [];
  lines.push('# Phase 10 Debug Report\n');
  lines.push(`**Run ID:** ${bundle.runId}`);
  lines.push(`**Lesson:** ${bundle.lessonMeta.id}`);
  lines.push(`**Timestamp:** ${bundle.timestampISO}\n`);
  
  const baselineScore = bundle.baseline.score?.total || 0;
  const refinedScore = bundle.phase10?.refined?.score?.total || 0;
  lines.push('## Outcome\n');
  lines.push(`- Baseline Score: ${baselineScore}/100`);
  lines.push(`- Refined Score: ${refinedScore}/100`);
  lines.push(`- Delta: ${refinedScore - baselineScore} points`);
  lines.push(`- Accepted: ${bundle.phase10?.accepted ? 'Yes' : 'No'}\n`);
  
  return lines.join('\n');
}
