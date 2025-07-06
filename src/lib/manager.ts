import { ReceivedStatusUpdate } from "@webxdc/types";
import throttle from "lodash/throttle";

import { getRandomUUID } from "~/lib/util";
import { db } from "~/lib/storage";

export class Manager {
  private onPostsChanged: () => void;
  private queue: ReceivedStatusUpdate<Payload>[];
  public selfName: string;
  public selfId: string;
  public isAdmin: boolean;

  constructor() {
    this.onPostsChanged = () => {};
    this.queue = [];
    this.selfName = localStorage.selfName || window.webxdc.selfName;
    this.selfId = localStorage.selfId || window.webxdc.selfAddr;
    this.isAdmin = localStorage.isAdmin === "true";
  }

  async init(setPosts: (posts: Post[]) => void) {
    const workerLoop = async () => {
      while (this.queue.length > 0) {
        try {
          await this.processUpdate(this.queue.shift()!);
        } catch (ex) {
          console.error(ex);
        }
      }
      setTimeout(workerLoop, 100);
    };
    workerLoop();

    await window.webxdc.setUpdateListener(
      (update: ReceivedStatusUpdate<Payload>) => this.queue.push(update),
      parseInt(localStorage.maxSerial || "0"),
    );
    const today = new Date().setHours(0, 0, 0, 0);
    const oldDate = new Date(today).setDate(new Date(today).getDate() - 360);
    await db.posts.where("active").below(oldDate).delete();

    const onPostsChanged = throttle(async () => {
      setPosts(await db.posts.orderBy("active").reverse().limit(500).toArray());
    }, 500);
    this.queue.push({
      payload: {
        init: onPostsChanged,
      },
      serial: -1,
      max_serial: 0,
    });
  }

  like(postId: string) {
    window.webxdc.sendUpdate(
      { payload: { like: { postId, userId: this.selfId } } },
      "",
    );
  }

  unlike(postId: string) {
    window.webxdc.sendUpdate(
      { payload: { unlike: { postId, userId: this.selfId } } },
      "",
    );
  }

  deleteAll(userId: string) {
    window.webxdc.sendUpdate({ payload: { deleteAll: userId } }, "");
  }

  deletePost(postId: string) {
    window.webxdc.sendUpdate({ payload: { deleteP: postId } }, "");
  }

  deleteReply(postId: string, replyId: string) {
    window.webxdc.sendUpdate({ payload: { deleteR: { postId, replyId } } }, "");
  }

  sendPost(text: string, image: string, style: number) {
    const now = Date.now();
    const post = {
      id: getRandomUUID(),
      date: now,
      active: now,
      authorName: this.selfName,
      authorId: this.selfId,
      isAdmin: this.isAdmin,
      text,
      image,
      style,
      likes: 0,
      replies: 0,
    };
    const info = `${this.selfName} created a post`;
    window.webxdc.sendUpdate({ payload: { post }, info }, "");
  }

  reply(postId: string, text: string) {
    const reply = {
      postId,
      id: getRandomUUID(),
      authorName: this.selfName,
      authorId: this.selfId,
      isAdmin: this.isAdmin,
      date: Date.now(),
      text,
    };
    const info = `${this.selfName} replied a post`;
    window.webxdc.sendUpdate({ payload: { reply }, info }, "");
  }

  async getReplies(postId: string): Promise<Reply[]> {
    return (await db.replies.where({ postId }).reverse().sortBy("date")).slice(
      -500,
    );
  }

  private async processUpdate(update: ReceivedStatusUpdate<Payload>) {
    const payload = update.payload;
    if ("init" in payload) {
      this.onPostsChanged = payload.init;
      this.onPostsChanged();
      return;
    }

    if ("post" in payload) {
      await db.posts.put(payload.post);
      this.onPostsChanged();
    } else if ("reply" in payload) {
      const reply = payload.reply;
      await db.transaction("rw", db.posts, db.replies, async () => {
        await db.replies.put(reply);
        const post = (await db.posts.where({ id: reply.postId }).first())!;
        post.replies = await db.replies.where({ postId: reply.postId }).count();
        post.active = Math.max(post.active, reply.date);
        await db.posts.put(post);
      });
      this.onPostsChanged();
    } else if ("like" in payload) {
      const { postId, userId } = payload.like;
      await db.transaction("rw", db.posts, db.likes, async () => {
        await db.likes.put({ postId, userId });
        const post = (await db.posts.where({ id: postId }).first())!;
        post.likes = await db.likes.where({ postId }).count();
        if (userId === this.selfId) post.liked = true;
        await db.posts.put(post);
      });
      this.onPostsChanged();
    } else if ("unlike" in payload) {
      const { postId, userId } = payload.unlike;
      await db.transaction("rw", db.posts, db.likes, async () => {
        await db.likes.where({ postId, userId }).delete();
        const post = (await db.posts.where({ id: postId }).first())!;
        post.likes = await db.likes.where({ postId }).count();
        if (userId === this.selfId) post.liked = false;
        await db.posts.put(post);
      });
      this.onPostsChanged();
    } else if ("deleteAll" in payload) {
      const userId = payload.deleteAll;
      await db.transaction("rw", db.posts, db.replies, db.likes, async () => {
        const posts = await db.posts.where({ authorId: userId }).toArray();
        for (const post of posts) {
          await db.replies.where({ postId: post.id }).delete();
          await db.likes.where({ postId: post.id }).delete();
        }
        await db.posts.where({ authorId: userId }).delete();

        const postIds = new Set();
        const replies = await db.replies.where({ authorId: userId }).toArray();
        for (const reply of replies) {
          postIds.add(reply.postId);
        }
        await db.replies.where({ authorId: userId }).delete();
        for (const postId of postIds) {
          const post = (await db.posts.where({ id: postId }).first())!;
          post.replies = await db.replies.where({ postId }).count();
          const reply = await db.replies.where({ postId }).reverse().first();
          post.active = Math.max(post.date, reply ? reply.date : post.date);
          await db.posts.put(post);
        }
      });
      this.onPostsChanged();
    } else if ("deleteP" in payload) {
      const postId = payload.deleteP;
      await db.transaction("rw", db.posts, db.replies, db.likes, async () => {
        await db.posts.where({ id: postId }).delete();
        await db.replies.where({ postId }).delete();
        await db.likes.where({ postId }).delete();
      });
      this.onPostsChanged();
    } else if ("deleteR" in payload) {
      const { postId, replyId } = payload.deleteR;
      await db.transaction("rw", db.posts, db.replies, async () => {
        await db.replies.where({ postId, id: replyId }).delete();
        const post = (await db.posts.where({ id: postId }).first())!;
        post.replies = await db.replies.where({ postId }).count();
        const reply = await db.replies.where({ postId }).reverse().first();
        post.active = Math.max(post.date, reply ? reply.date : post.date);
        await db.posts.put(post);
      });
      this.onPostsChanged();
    } else if ("botMode" in payload) {
      const { selfId, isAdmin, selfName } = payload.botMode;
      localStorage.selfId = this.selfId = selfId;
      if (selfName) {
        localStorage.selfName = this.selfName = selfName;
      }
      localStorage.isAdmin = this.isAdmin = isAdmin;
    }

    if (update.serial === update.max_serial) {
      localStorage.maxSerial = update.serial;
    }
  }
}
