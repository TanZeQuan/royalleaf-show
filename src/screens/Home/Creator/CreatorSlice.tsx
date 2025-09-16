export interface ContestEntry {
  id: string;
  category: string;
  categoryName: string;
  image: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  feedback?: string;
  likes: number;
  views: number;
  isPublic: boolean;
  authorName?: string;
  authorId?: string;
}

export interface RouteParams {
  entries?: ContestEntry[];
  selectedCategory?: string;
  categoryName?: string;
}