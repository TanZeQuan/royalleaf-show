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
  id: string;
  user: string;
  text: string;
  isDesigner: boolean;
  replyTo: string | null;
}

export interface TopicDetailRouteParams {
  topicId: string;
  topicTitle: string;
  topicDescription: string;
}