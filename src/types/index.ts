export interface DocumentFile {
  file: File;
  text: string;
  pages: string[];
  images: string[];
}

export interface ComparisonResult {
  changedValues: Change[];
  addedContent: Change[];
  removedContent: Change[];
  movedSections: MovedSection[];
  summary: string;
}

export interface Change {
  original?: string;
  new?: string;
  section?: string;
  description?: string;
  type?: 'time' | 'value' | 'currency' | 'format';
}

export interface MovedSection {
  content: string;
  originalLocation: string;
  newLocation: string;
}

export interface VisualDifference {
  pageNumber: number;
  overlayImage?: string;
  sideBySideImage?: {
    original: string;
    new: string;
    diff: string;
  };
}

export type VisualComparisonType = 'magenta-overlay' | 'side-by-side';