export interface TopicPost {
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
  commentsList: TopicComment[];
}

export interface TopicComment {
  id: string;
  user: string;
  text: string;
  isDesigner: boolean;
  replyTo: string | null;
  replies: TopicComment[];
  timestamp: string;
  likes: number;
  isLiked: boolean;
}
 
export interface TopicData {
  id: string;
  title: string;
  description: string;
  posts: number;
  participants: number;
  isHot: boolean;
  posts_list: TopicPost[];
}

export interface TopicDetailRouteParams {
  topicId: string;
  topicTitle: string;
  topicDescription: string;
}

export const mockTopicData: Record<string, TopicData> = {
  t1: {
    id: "t1",
    title: "#你最爱的共创饮品理由",
    description: "分享你对创意茶饮的独特见解",
    posts: 42,
    participants: 28,
    isHot: true,
    posts_list: [
      {
        id: "p1",
        username: "TeaMaster_Lin",
        avatar: "👩‍🍳",
        image: require("assets/images/mock.jpg"),
        caption: "我最爱的是抹茶奶盖！传统抹茶的苦涩和现代奶盖的甜腻完美融合，每一口都是东西方文化的碰撞 🍵✨ #共创饮品 #抹茶控",
        likes: 15,
        comments: 3,
        timeAgo: "30分钟前",
        isLiked: false,
        isSaved: false,
        topicTag: "#你最爱的共创饮品理由",
        commentsList: [
          {
            id: "c1",
            user: "MatcharLover",
            text: "同款！抹茶奶盖真的绝了！",
            isDesigner: false,
            replyTo: null,
            replies: [],
            likes: 2,
            isLiked: false,
            timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          },
          {
            id: "c2",
            user: "CreativeTea",
            text: "这个搭配确实很有创意",
            isDesigner: false,
            replyTo: null,
            replies: [],
            likes: 0,
            isLiked: false,
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          },
        ],
      },
      {
        id: "p2",
        username: "BubbleFan_88",
        avatar: "🧑‍💼",
        image: require("assets/images/mock.jpg"),
        caption: "芋泥波波茶是我的心头好！紫色的颜值加上Q弹的口感，还有浓郁的芋香，简直是视觉和味觉的双重享受 🟣🧋 #共创饮品",
        likes: 23,
        comments: 5,
        timeAgo: "1小时前",
        isLiked: true,
        isSaved: false,
        topicTag: "#你最爱的共创饮品理由",
        commentsList: [
          {
            id: "c3",
            user: "PurpleLover",
            text: "芋泥控举手！💜",
            isDesigner: false,
            replyTo: null,
            replies: [],
            likes: 5,
            isLiked: false,
            timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          },
          {
            id: "c4",
            user: "RoyalLeaf_Designer",
            text: "感谢分享！我们会考虑推出更多芋泥系列",
            isDesigner: true,
            replyTo: null,
            replies: [],
            likes: 8,
            isLiked: false,
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          },
        ],
      },
    ],
  },
  t2: {
    id: "t2",
    title: "#双文化元素怎么融合才好看",
    description: "探讨传统与现代的完美结合",
    posts: 38,
    participants: 22,
    isHot: true,
    posts_list: [
      {
        id: "p3",
        username: "DesignGuru",
        avatar: "🎨",
        image: require("assets/images/mock.jpg"),
        caption: "中式花纹 + 现代极简包装 = 完美！看看这个设计，既保留了传统美学又符合现代审美 🎋🎯 #文化融合",
        likes: 31,
        comments: 8,
        timeAgo: "2小时前",
        isLiked: false,
        isSaved: true,
        topicTag: "#双文化元素怎么融合才好看",
        commentsList: [],
      },
    ],
  },
};