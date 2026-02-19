import { NextRequest, NextResponse } from 'next/server';
import { listApprovedQuestionsByScope } from '@/lib/questions/bankRepo';
import { findNearDuplicate, questionSimilarityScore, toSimilarityLike } from '@/lib/questions/similarity';
import { guardQuestionAdminAccess, toQuestionAdminError } from '../_utils';

interface DuplicateCluster {
  key: string;
  size: number;
  ids: string[];
  keep_id: string;
  lo_codes: string[];
  ac_codes: string[];
  sample_stem: string;
  strongest_pair_score: number;
}

function buildClusters(ids: string[], edges: Array<[string, string]>): string[][] {
  const graph = new Map<string, Set<string>>();
  for (const id of ids) graph.set(id, new Set());
  for (const [a, b] of edges) {
    graph.get(a)?.add(b);
    graph.get(b)?.add(a);
  }

  const visited = new Set<string>();
  const clusters: string[][] = [];
  for (const id of ids) {
    if (visited.has(id)) continue;
    visited.add(id);
    const queue = [id];
    const component: string[] = [id];
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;
      for (const next of graph.get(current) ?? []) {
        if (visited.has(next)) continue;
        visited.add(next);
        queue.push(next);
        component.push(next);
      }
    }
    if (component.length > 1) {
      clusters.push(component);
    }
  }
  return clusters;
}

export async function GET(request: NextRequest) {
  const denied = await guardQuestionAdminAccess(request);
  if (denied) return denied;

  try {
    const unitCode = String(request.nextUrl.searchParams.get('unit_code') ?? '').trim();
    const levelParam = String(request.nextUrl.searchParams.get('level') ?? '').trim();
    const loParam = String(request.nextUrl.searchParams.get('lo_codes') ?? '').trim();
    if (!unitCode) {
      return NextResponse.json({ success: false, message: 'unit_code query param is required.' }, { status: 400 });
    }
    const level = levelParam ? Number(levelParam) : 2;
    if (level !== 2 && level !== 3) {
      return NextResponse.json({ success: false, message: 'level must be 2 or 3.' }, { status: 400 });
    }
    const loCodes = loParam
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
    const maxPairsParam = Number(request.nextUrl.searchParams.get('max_items') ?? 500);
    const maxItems = Number.isFinite(maxPairsParam) && maxPairsParam > 0 ? Math.min(1000, Math.floor(maxPairsParam)) : 500;

    const approved = await listApprovedQuestionsByScope({
      unit_code: unitCode,
      level,
      lo_codes: loCodes.length > 0 ? loCodes : undefined,
    });
    const rows = approved
      .slice(0, maxItems)
      .map((item) => ({ raw: item, sim: toSimilarityLike(item) }));
    const ids = rows.map((item) => item.raw.id);
    const edges: Array<[string, string]> = [];
    const strongestPairScoreByClusterKey = new Map<string, number>();

    for (let i = 0; i < rows.length; i += 1) {
      for (let j = i + 1; j < rows.length; j += 1) {
        const a = rows[i];
        const b = rows[j];
        const near = findNearDuplicate(a.sim, [b.sim]);
        if (!near) continue;
        edges.push([a.raw.id, b.raw.id]);
        const pairKey = [a.raw.id, b.raw.id].sort().join('|');
        strongestPairScoreByClusterKey.set(pairKey, questionSimilarityScore(a.sim, b.sim));
      }
    }

    const rawClusters = buildClusters(ids, edges);
    const clusters: DuplicateCluster[] = rawClusters
      .map((clusterIds) => {
        const items = rows.filter((row) => clusterIds.includes(row.raw.id));
        let strongest = 0;
        for (let i = 0; i < items.length; i += 1) {
          for (let j = i + 1; j < items.length; j += 1) {
            const pairKey = [items[i].raw.id, items[j].raw.id].sort().join('|');
            const score = strongestPairScoreByClusterKey.get(pairKey) ?? questionSimilarityScore(items[i].sim, items[j].sim);
            if (score > strongest) strongest = score;
          }
        }

        return {
          key: clusterIds.slice().sort().join('|'),
          size: clusterIds.length,
          ids: clusterIds,
          keep_id: items
            .slice()
            .sort((a, b) => a.raw.created_at.localeCompare(b.raw.created_at))[0]
            .raw.id,
          lo_codes: Array.from(new Set(items.map((item) => item.raw.lo_code ?? '').filter((value) => value.length > 0))),
          ac_codes: Array.from(new Set(items.map((item) => item.raw.ac_code ?? '').filter((value) => value.length > 0))),
          sample_stem: items[0]?.raw.stem ?? '',
          strongest_pair_score: Number(strongest.toFixed(3)),
        };
      })
      .sort((a, b) => b.size - a.size || b.strongest_pair_score - a.strongest_pair_score);

    return NextResponse.json({
      success: true,
      scope: {
        unit_code: unitCode,
        level,
        lo_codes: loCodes,
      },
      total_approved: rows.length,
      total_approved_in_scope: approved.length,
      analyzed_items: rows.length,
      duplicate_cluster_count: clusters.length,
      clusters,
    });
  } catch (error) {
    return toQuestionAdminError(error);
  }
}
