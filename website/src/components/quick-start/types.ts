import { InstallTabItem, QuickStartStepItem, DocsCalloutConfig } from '@/config/quickStart';

export interface QuickStartProps {
  className?: string;
}

export interface QuickStartHeadingProps {
  className?: string;
}

export interface QuickStartPillProps {
  text: string;
  className?: string;
}

export interface InstallCommandTabsProps {
  tabs?: InstallTabItem[];
  className?: string;
}

export interface StepCardProps {
  step: QuickStartStepItem;
  index: number;
  className?: string;
}

export interface QuickStartStepsGridProps {
  steps?: QuickStartStepItem[];
  className?: string;
}

export interface DocsCtaCardProps {
  config?: DocsCalloutConfig;
  className?: string;
}
