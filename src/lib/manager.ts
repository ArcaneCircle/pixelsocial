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
        await this.processUpdate(this.queue.shift()!);
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

  sendPost(text: string, image: string, style: number) {
    const post = {
      id: getRandomUUID(),
      date: Date.now(),
      authorName: this.selfName,
      authorId: this.selfId,
      text,
      image,
      style,
    };
    const info = `${this.selfName} created a post`;
    window.webxdc.sendUpdate({ payload: { post }, info }, "");
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
    }
    if (update.serial === update.max_serial) {
      localStorage.maxSerial = update.serial;
    }
  }
}
