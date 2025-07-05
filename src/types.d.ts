declare type Payload =
  | {
      init: () => void;
    }
  | {
      post: Post;
    }
  | {
      reply: Reply;
    }
  | {
      like: Like;
    }
  | {
      unlike: Like;
    }
  | {
      deleteAll: string;
    }
  | {
      deleteP: string;
    }
  | {
      deleteR: { postId: string; replyId: string };
    }
  // bot special commands:
  | {
      botMode: { selfId: string; selfName: string; isAdmin: boolean };
    };

declare type PageData =
  | { key: "home" | "newpost" }
  | { key: "comments"; postId: string };

declare interface Post {
  id: string;
  authorName: string;
  authorId: string;
  isAdmin: boolean;
  date: number;
  active: number;
  text: string;
  image: string;
  style: number;
  likes: number;
  liked?: boolean;
  replies: number;
}

declare interface Like {
  postId: string;
  userId: string;
}

declare interface Reply {
  id: string;
  postId: string;
  authorName: string;
  authorId: string;
  isAdmin: boolean;
  date: number;
  text: string;
}
