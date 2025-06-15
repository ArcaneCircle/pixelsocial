import { ReceivedStatusUpdate } from "@webxdc/types";
import throttle from "lodash/throttle";

import { getRandomUUID } from "~/lib/util";
import { db } from "~/lib/storage";

export class Manager {
  private onPostsChanged: () => void;
  private queue: ReceivedStatusUpdate<Payload>[];
  public selfName: string;
  public selfId: string;

  constructor() {
    this.onPostsChanged = () => {};
    this.queue = [];
    this.selfName = window.webxdc.selfName;
    this.selfId = window.webxdc.selfAddr;
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
    await db.posts.where("date").below(oldDate).delete();

    const onPostsChanged = throttle(async () => {
      setPosts(await db.posts.orderBy("date").reverse().limit(500).toArray());
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

  sendPost(text: string, image: string, style: number) {
    const post = {
      id: getRandomUUID(),
      date: Date.now(),
      authorName: this.selfName,
      authorId: this.selfId,
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
      date: Date.now(),
      text,
    };
    const info = `${this.selfName} replied a post`;
    window.webxdc.sendUpdate({ payload: { reply }, info }, "");
  }

  async getReplies(postId: string): Promise<Reply[]> {
    return await db.replies
      .where({ postId })
      .reverse()
      .limit(500)
      .sortBy("date");
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
    }

    if (update.serial === update.max_serial) {
      localStorage.maxSerial = update.serial;
    }
  }
}
