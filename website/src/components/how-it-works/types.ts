export interface StatItem {
  label: string;
  value: string;
  subtext?: string;
}

export interface ChartMarker {
  type: 'BUY' | 'SELL';
  x: number;
  y: number;
  label: string;
  metric: string;
  color: string;
}

export interface HowItWorksProps {
  className?: string;
}
