import { useState, useMemo } from "react";

import { Manager } from "~/lib/manager";
import { ManagerContext, PageContext } from "~/contexts";

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
  const [pageData, setPage] = useState<PageData>({
    key: "home",
    showComments: false,
  });

  if (!posts) return;

  let page: any = useMemo(() => {
    if (pageData.key === "home") {
      return <Home posts={posts} showComments={pageData.showComments} />;
    } else if (pageData.key === "newpost") {
      return <NewPost />;
    } else if (pageData.key === "comments") {
      const post = posts.find((p) => pageData.postId === p.id);
      if (post) {
        const focusReplyId = pageData.focusReplyId;
        return <PostComments post={post} focusReplyId={focusReplyId} />;
      } else {
        // post deleted, go home
        setPage({ key: "home", showComments: false });
        return null;
      }
    }
  }, [pageData, posts]);

  return (
    <ManagerContext.Provider value={manager}>
      <PageContext.Provider value={{ pageData, setPage }}>
        {page}
      </PageContext.Provider>
    </ManagerContext.Provider>
  );
}
