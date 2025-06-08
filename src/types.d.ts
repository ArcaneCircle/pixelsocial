declare type Payload =
  | {
      init: () => void;
    }
  | {
      post: Post;
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
}
