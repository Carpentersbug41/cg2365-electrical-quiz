export type Vector2 = {
  x: number;
  y: number;
};

export interface Electron {
  id: number;
  pos: Vector2;
  vel: Vector2; // Direction normalized * speed
}

export interface Atom {
  id: number;
  pos: Vector2; // 0-1 normalized coordinates relative to wire bounds
  lastHitTime: number;
}

export enum AppMode {
  CURRENT = 'current',
  VOLTAGE = 'voltage',
  RESISTANCE = 'resistance',
  REAL = 'real',
}

export interface SimulationParams {
  electronCount: number;
  driftStrength: number; // 0 to ~3.0 relative multiplier
  atomCount: number;
  wireThickness: number; // 0 to 1 normalized
  temperature: number; // For color/vibration
  isRealMode: boolean;
}



