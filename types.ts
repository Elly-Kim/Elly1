
export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  approach: string;
  result: string;
  overview: string;
}

export type SectionId = 'home' | 'portfolio' | 'why-me' | 'process' | 'contact';
