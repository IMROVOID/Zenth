import { siteMeta, type HeroConfig, type SiteMetaConfig, type WhatIsZenthConfig } from './site';
import { navItems, exchanges, type NavItem, type ExchangeItem } from './navigation';
import { themeConfig, type ThemeConfig } from './theme';
import {
  quickStartConfig,
  type QuickStartConfig,
  type InstallTabItem,
  type QuickStartStepItem,
  type DocsCalloutConfig,
} from './quickStart';
import {
  footerConfig,
  type FooterConfig,
  type FooterLinkItem,
  type FooterColumnItem,
} from './footer';
import { faqConfig, type FaqConfig, type FaqItem } from './faq';

export type {
  NavItem,
  ExchangeItem,
  HeroConfig,
  SiteMetaConfig,
  ThemeConfig,
  WhatIsZenthConfig,
  QuickStartConfig,
  InstallTabItem,
  QuickStartStepItem,
  DocsCalloutConfig,
  FooterConfig,
  FooterLinkItem,
  FooterColumnItem,
  FaqConfig,
  FaqItem,
};
export {
  siteMeta,
  navItems,
  exchanges,
  themeConfig,
  quickStartConfig,
  footerConfig,
  faqConfig,
};

export const siteConfig = {
  ...siteMeta,
  quickStart: quickStartConfig,
  faq: faqConfig,
  footer: footerConfig,
  navItems,
  exchanges,
  theme: themeConfig,
};

export default siteConfig;
