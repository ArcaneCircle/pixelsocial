import { useMemo, useContext } from "react";

import { PageContext } from "~/contexts.ts";

import TitleBar from "~/components/TitleBar";
import Feed from "~/components/Feed";
import SecondaryButton from "~/components/SecondaryButton";

interface Props {
  posts: Post[];
}

export default function Home({ posts }: Props) {
  const { setPage } = useContext(PageContext);
  const TitleBarM = useMemo(() => {
    const onClick = () => setPage({ key: "newpost" });
    return (
      <TitleBar>
        <SecondaryButton onClick={onClick}>New post</SecondaryButton>
      </TitleBar>
    );
  }, [setPage]);
  const FeedM = useMemo(() => <Feed posts={posts} />, [posts]);

  return (
    <div>
      {TitleBarM}
      {FeedM}
    </div>
  );
}
