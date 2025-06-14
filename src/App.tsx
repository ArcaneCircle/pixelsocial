import { useState, useMemo } from "react";

import { Manager, ManagerContext } from "~/lib/manager.ts";

import Home from "~/pages/Home";
import NewPost from "~/pages/NewPost";

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
  const [pageKey, setPage] = useState<PageKey>("home");

  if (!posts) return;

  let page: any = null;
  if (pageKey === "home") {
    page = useMemo(
      () => <Home posts={posts} setPage={setPage} />,
      [posts, setPage],
    );
  } else if (pageKey === "newpost") {
    page = useMemo(() => <NewPost setPage={setPage} />, [setPage]);
  }

  return (
    <ManagerContext.Provider value={manager}>{page}</ManagerContext.Provider>
  );
}
