export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  reference?: string; // e.g., "Matthew 13:1-9", "Josephus Antiquities"
  type: 'historical' | 'theological' | 'linguistic' | 'application';
}

export interface GeminiInsightResponse {
  insights: Array<{
    title: string;
    description: string;
    reference: string;
    type: string;
  }>;
}