import path from 'node:path';

export function getStaticSimulationsRoot(): string {
  return path.join(process.cwd(), 'src', 'simulations');
}

export function getStaticSimulationDir(simulation: string): string {
  return path.join(getStaticSimulationsRoot(), simulation);
}
