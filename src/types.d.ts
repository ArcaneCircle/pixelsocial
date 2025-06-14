declare type Payload =
  | {
      init: () => void;
    }
  | {
      post: Post;
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

declare type PageKey = "home" | "newpost";

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
