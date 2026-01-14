import { Vector2 } from '../types';

export const vecAdd = (a: Vector2, b: Vector2): Vector2 => ({ x: a.x + b.x, y: a.y + b.y });
export const vecSub = (a: Vector2, b: Vector2): Vector2 => ({ x: a.x - b.x, y: a.y - b.y });
export const vecScale = (v: Vector2, s: number): Vector2 => ({ x: v.x * s, y: v.y * s });
export const vecLen = (v: Vector2): number => Math.sqrt(v.x * v.x + v.y * v.y);
export const vecNorm = (v: Vector2): Vector2 => {
  const len = vecLen(v);
  return len === 0 ? { x: 0, y: 0 } : { x: v.x / len, y: v.y / len };
};

export const randomUnitVector = (): Vector2 => {
  const angle = Math.random() * 2 * Math.PI;
  return { x: Math.cos(angle), y: Math.sin(angle) };
};

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const clamp = (x: number, min: number, max: number): number => Math.min(Math.max(x, min), max);








