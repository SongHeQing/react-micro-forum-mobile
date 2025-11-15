const DESIGN_WIDTH = 1260;
const DESIGN_HEIGHT = 1260;

export function vw(px: number): number {
  return (px / DESIGN_WIDTH) * window.innerWidth;
}

export function vh(px: number): number {
  return (px / DESIGN_HEIGHT) * window.innerHeight * 0.60;
}

export function rfs(px: number, min = 0): number {
  return Math.max(min, Math.min(vw(px), vh(px)));
}