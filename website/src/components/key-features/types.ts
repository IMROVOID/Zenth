export type FeatureIconType = 'analytics' | 'security' | 'ecosystem' | 'multicurrency';

export interface KeyFeatureData {
  id: string;
  icon: FeatureIconType;
  title: string;
  description: string;
}

export interface KeyFeaturesProps {
  className?: string;
}

export interface KeyFeaturesHeadingProps {
  className?: string;
}

export interface KeyFeaturesPillProps {
  text: string;
  className?: string;
}

export interface FeatureCardProps {
  feature: KeyFeatureData;
  index: number;
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

export interface IllustrationProps {
  className?: string;
}
