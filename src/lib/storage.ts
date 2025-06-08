import Dexie, { type EntityTable } from "dexie";

export const db = new Dexie("appdb") as Dexie & {
  posts: EntityTable<Post, "id">;
};
db.version(1).stores({ posts: "id, date" });
