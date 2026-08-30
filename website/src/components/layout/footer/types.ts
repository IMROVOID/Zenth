import { FooterConfig, FooterColumnItem, FooterLinkItem } from '@/config/footer';

export type LegalDocType = 'privacy' | 'terms';

export interface FooterProps {
  className?: string;
  config?: FooterConfig;
}

export interface FooterBrandProps {
  name?: string;
  logoSrc?: string;
  tagline?: string;
  statusBadge?: string;
  statusText?: string;
  badges?: string[];
  repoUrl?: string;
  className?: string;
}

export interface FooterNavGridProps {
  columns: FooterColumnItem[];
  onOpenLegalModal: (docType: LegalDocType) => void;
  className?: string;
}

export interface FooterLegalDisclaimerProps {
  title: string;
  description: string;
  notionalCapText: string;
  className?: string;
}

export interface FooterBottomBarProps {
  attribution: FooterConfig['attribution'];
  onOpenLegalModal: (docType: LegalDocType) => void;
  className?: string;
}

export interface LegalModalProps {
  isOpen: boolean;
  activeDoc: LegalDocType;
  onClose: () => void;
  onSwitchDoc: (docType: LegalDocType) => void;
  config: FooterConfig['legalModal'];
}

export type { FooterConfig, FooterColumnItem, FooterLinkItem };
