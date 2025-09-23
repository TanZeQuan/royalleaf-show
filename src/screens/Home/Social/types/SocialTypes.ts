export interface Reply {
  id: string;
  user: string;
  text: string;
  isDesigner: boolean;
  replyTo: string | null;
  timestamp: string;
  replies: Reply[];
  likes: number;
  isLiked: boolean;
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  isDesigner: boolean;
  replyTo: string | null;
  replies: Reply[];
  likes: number;
  isLiked: boolean;
}

export interface Post {
  id: string;
  username: string;
  avatar: string;
  image: any;
  caption: string;
  likes: number;
  comments: number;
  timeAgo: string;
  isLiked: boolean;
  isSaved: boolean;
  commentsList: Comment[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  posts: number;
  participants: number;
  isHot: boolean;
  color?: string;
  icon?: string;
  trending?: boolean;
}