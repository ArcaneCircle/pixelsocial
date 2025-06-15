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
      delete: string;
    };

declare type PageData =
  | { key: "home" | "newpost" }
  | { key: "comments"; postId: string };

declare interface Post {
  id: string;
  authorName: string;
  authorId: string;
  date: number;
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
  postId: string;
  id: string;
  authorName: string;
  authorId: string;
  date: number;
  text: string;
}
