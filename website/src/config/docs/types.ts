export interface DocSection {
  id: string;
  title: string;
  badge?: string;
  content: string;
  codeBlock?: {
    language: string;
    code: string;
    filename?: string;
  };
  callout?: {
    type: 'invariant' | 'math' | 'telemetry' | 'tip' | 'warning' | 'schema';
    title: string;
    body: string;
  };
  statGrid?: {
    label: string;
    value: string;
    badge: string;
  }[];
  matrixTable?: {
    headers: string[];
    rows: string[][];
  };
  taxonomyCards?: {
    tag: string;
    description: string;
  }[];
}

export interface DocPage {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  categorySlug: string;
  statusTag: string;
  badges: string[];
  lastUpdated: string;
  sections: DocSection[];
  prevPage?: { title: string; slug: string };
  nextPage?: { title: string; slug: string };
}

export interface DocCategory {
  id: string;
  title: string;
  badge: string;
  pages: {
    slug: string;
    title: string;
    badge?: string;
    summary?: string;
  }[];
}

export interface DocSearchResult {
  slug: string;
  title: string;
  category: string;
  sectionId?: string;
  sectionTitle?: string;
  matchSnippet: string;
  type: 'page' | 'section' | 'formula' | 'code' | 'schema';
}
