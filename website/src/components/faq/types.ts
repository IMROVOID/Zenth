import { FaqConfig, FaqItem } from '@/config/faq';

export interface FaqProps {
  className?: string;
  config?: FaqConfig;
}

export interface FaqHeaderProps {
  pillText: string;
  title: string;
  subtitle: string;
  supportCard: FaqConfig['supportCard'];
  className?: string;
}

export interface FaqPillProps {
  text: string;
  className?: string;
}

export interface FaqAccordionListProps {
  items: FaqItem[];
  className?: string;
}

export interface FaqAccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}
