export interface ToolLink {
  title: string;
  url: string;
  icon?: string;
}

export interface Tool {
  title: string;
  body: string;
  tags?: string[];
  url: string;
  "date-added": string;
  slug?: string;
  github_url?: string;
  open_source?: boolean;
  links?: ToolLink[];
  author?: string;
}

export interface Category {
  category: string;
  title: string;
  content: Tool[];
}

export interface ToolsConfig {
  tools: Category[];
}

export interface MetadataEntry {
  slug: string;
  title?: string | undefined;
  description?: string | undefined;
  ogImage?: string | undefined;
  twitterHandle?: string | undefined;
  githubUrl?: string | undefined;
}

export type MetadataMap = Record<string, MetadataEntry>;

export type SlugMap = Record<string, string[]>;
