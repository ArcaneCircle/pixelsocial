import { useState, useMemo } from "react";

import { Manager } from "~/lib/manager.ts";
import { ManagerContext, PageContext } from "~/contexts.ts";

import Home from "~/pages/Home";
import NewPost from "~/pages/NewPost";
import PostComments from "~/pages/PostComments";

// @ts-ignore
import "@fontsource/jersey-10";
import "./App.css";

export default function App() {
  const [posts, setPosts] = useState<Post[] | null>(null as Post[] | null);
  const manager = useMemo(() => {
    const manager = new Manager();
    manager.init(setPosts);
    return manager;
  }, []);
  const [pageData, setPage] = useState<PageData>({ key: "home" });

  if (!posts) return;

  let page: any = null;
  if (pageData.key === "home") {
    page = useMemo(() => <Home posts={posts} />, [posts]);
  } else if (pageData.key === "newpost") {
    page = useMemo(() => <NewPost />, []);
  } else if (pageData.key === "comments") {
    const post = posts.find((p) => pageData.postId === p.id);
    if (post) {
      page = useMemo(() => <PostComments post={post} />, [post]);
    }
  }

  return (
    <ManagerContext.Provider value={manager}>
      <PageContext.Provider value={{ pageData, setPage }}>
        {page}
      </PageContext.Provider>
    </ManagerContext.Provider>
  );
}
