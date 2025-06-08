import { useMemo } from "react";

import TitleBar from "~/components/TitleBar";
import Feed from "~/components/Feed";
import Button from "~/components/Button";

const btnStyle = {
  background: "none",
  border: "1px solid #ccae3a",
  color: "#ccae3a",
};

interface Props {
  posts: Post[];
  setPage: (page: PageKey) => void;
}

export default function Home({ posts, setPage }: Props) {
  const TitleBarM = useMemo(() => {
    const onClick = () => setPage("newpost");
    return (
      <TitleBar>
        <Button style={btnStyle} onClick={onClick}>
          New post
        </Button>
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
