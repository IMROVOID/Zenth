import { siteMeta, type HeroConfig, type SiteMetaConfig, type WhatIsZenthConfig } from './site';
import { navItems, exchanges, type NavItem, type ExchangeItem } from './navigation';
import { themeConfig, type ThemeConfig } from './theme';

export type { NavItem, ExchangeItem, HeroConfig, SiteMetaConfig, ThemeConfig, WhatIsZenthConfig };
export { siteMeta, navItems, exchanges, themeConfig };

export const siteConfig = {
  ...siteMeta,
  navItems,
  exchanges,
  theme: themeConfig,
};

export default siteConfig;
