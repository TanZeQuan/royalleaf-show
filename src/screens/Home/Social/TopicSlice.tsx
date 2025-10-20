// types/topic.ts
export interface Topic {
  id: string;
  title: string;
  description: string;
  posts: number;
  participants: number;
  isHot: boolean;
  posts_list: Post[];
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
  topicTag: string;
  commentsList: Comment[];
}

export interface Comment {
  username: ReactNode;
  logs: any;
  logs: any;
  comment: any;
  message: any;
  body: any;
  comment_desc: any;
  content: any;
  desc: any;
  createdAt: string;
  avatar: any;
  likes: number;
  isLiked: any;
  id: string;
  user: string;
  text: string;
  isDesigner: boolean;
  replyTo: string | null;
  replies?: string;
}

export interface TopicDetailRouteParams {
  topicId: string;
  topicTitle: string;
  topicDescription: string;
}