import Dexie, { type EntityTable } from "dexie";

export const db = new Dexie("appdb") as Dexie & {
  posts: EntityTable<Post, "id">;
  likes: EntityTable<Like, "userId">;
  replies: EntityTable<Reply, "id">;
};
db.version(1).stores({
  posts: "id, date",
  likes: "[postId+userId]",
  replies: "[postId+id]",
});
