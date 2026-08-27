// Exact mathematical model of the HeroChart SVG spline
interface BezierSegment {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
}

interface LineSegment {
  x0: number;
  x1: number;
  y: number;
}

type SplineSegment =
  | ({ isBezier: false } & LineSegment)
  | ({ isBezier: true } & BezierSegment);

const SPLINE_SEGMENTS: SplineSegment[] = [
  { isBezier: false, x0: 0, x1: 120, y: 280 },
  { isBezier: true, x0: 120, y0: 280, x1: 155, y1: 280, x2: 175, y2: 195, x3: 210, y3: 195 },
  { isBezier: false, x0: 210, x1: 255, y: 195 },
  { isBezier: true, x0: 255, y0: 195, x1: 285, y1: 195, x2: 305, y2: 270, x3: 335, y3: 270 },
  { isBezier: false, x0: 335, x1: 355, y: 270 },
  { isBezier: true, x0: 355, y0: 270, x1: 385, y1: 270, x2: 405, y2: 135, x3: 435, y3: 135 },
  { isBezier: false, x0: 435, x1: 485, y: 135 },
  { isBezier: true, x0: 485, y0: 135, x1: 515, y1: 135, x2: 530, y2: 85, x3: 560, y3: 85 },
  { isBezier: false, x0: 560, x1: 615, y: 85 },
  { isBezier: true, x0: 615, y0: 85, x1: 645, y1: 85, x2: 665, y2: 210, x3: 695, y3: 210 },
  { isBezier: false, x0: 695, x1: 715, y: 210 },
  { isBezier: true, x0: 715, y0: 210, x1: 735, y1: 210, x2: 748, y2: 290, x3: 765, y3: 290 },
  { isBezier: false, x0: 765, x1: 780, y: 290 },
  { isBezier: true, x0: 780, y0: 290, x1: 795, y1: 290, x2: 804, y2: 22, x3: 816, y3: 22 },
  { isBezier: true, x0: 816, y0: 22, x1: 824, y1: 22, x2: 835, y2: 165, x3: 846, y3: 165 },
  { isBezier: false, x0: 846, x1: 865, y: 165 },
  { isBezier: true, x0: 865, y0: 165, x1: 880, y1: 165, x2: 892, y2: 26, x3: 908, y3: 26 },
  { isBezier: false, x0: 908, x1: 970, y: 26 },
  { isBezier: true, x0: 970, y0: 26, x1: 990, y1: 26, x2: 1005, y2: 95, x3: 1025, y3: 95 },
  { isBezier: false, x0: 1025, x1: 1065, y: 95 },
  { isBezier: true, x0: 1065, y0: 95, x1: 1085, y1: 95, x2: 1100, y2: 160, x3: 1120, y3: 160 },
  { isBezier: false, x0: 1120, x1: 1155, y: 160 },
  { isBezier: true, x0: 1155, y0: 160, x1: 1175, y1: 160, x2: 1190, y2: 275, x3: 1210, y3: 275 },
  { isBezier: false, x0: 1210, x1: 1235, y: 275 },
  { isBezier: true, x0: 1235, y0: 275, x1: 1255, y1: 275, x2: 1270, y2: 125, x3: 1295, y3: 125 },
  { isBezier: false, x0: 1295, x1: 1345, y: 125 },
  { isBezier: true, x0: 1345, y0: 125, x1: 1370, y1: 125, x2: 1390, y2: 210, x3: 1415, y3: 210 },
  { isBezier: false, x0: 1415, x1: 1445, y: 210 },
  { isBezier: true, x0: 1445, y0: 210, x1: 1470, y1: 210, x2: 1490, y2: 280, x3: 1520, y3: 280 },
  { isBezier: false, x0: 1520, x1: 1600, y: 280 },
];

function solveBezierT(x: number, seg: BezierSegment): number {
  let low = 0;
  let high = 1;
  for (let i = 0; i < 14; i++) {
    const mid = (low + high) * 0.5;
    const inv = 1 - mid;
    const bx =
      inv * inv * inv * seg.x0 +
      3 * inv * inv * mid * seg.x1 +
      3 * inv * mid * mid * seg.x2 +
      mid * mid * mid * seg.x3;
    if (bx < x) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) * 0.5;
}

function evalBezierY(t: number, seg: BezierSegment): number {
  const inv = 1 - t;
  return (
    inv * inv * inv * seg.y0 +
    3 * inv * inv * t * seg.y1 +
    3 * inv * t * t * seg.y2 +
    t * t * t * seg.y3
  );
}

export function getChartCurveY(x: number): number {
  if (x <= 0) return 280;
  if (x >= 1600) return 280;

  for (const seg of SPLINE_SEGMENTS) {
    const xEnd = seg.isBezier ? seg.x3 : seg.x1;
    if (x >= seg.x0 && x <= xEnd) {
      if (!seg.isBezier) {
        return seg.y;
      }
      const t = solveBezierT(x, seg);
      return evalBezierY(t, seg);
    }
  }
  return 280;
}

export function isUnderChartCurve(x: number, y: number): boolean {
  return y >= getChartCurveY(x);
}
