import { useState, useMemo, useEffect, useContext } from "react";
import PixelarticonsPlus from "~icons/pixelarticons/plus";

import { _ } from "~/lib/i18n";
import { ManagerContext, PageContext } from "~/contexts";

import TitleBar from "~/components/TitleBar";
import TabNavigation from "~/components/TabNavigation";
import Feed from "~/components/Feed";
import RepliesList from "~/components/RepliesList";
import SecondaryButton from "~/components/SecondaryButton";

interface Props {
  posts: Post[];
  showComments: boolean;
}

export default function Home({ posts, showComments }: Props) {
  const manager = useContext(ManagerContext);
  const { setPage } = useContext(PageContext);
  const [replies, setReplies] = useState<Reply[]>([]);

  useEffect(() => {
    (async () => {
      if (showComments) {
        setReplies(await manager.getAllReplies());
      }
    })();
  }, [posts, showComments]); // posts is required so replies are refreshed

  const TitleBarM = useMemo(() => {
    const onClick = () => setPage({ key: "newpost" });
    return (
      <TitleBar>
        <SecondaryButton onClick={onClick} style={{ padding: "5px 10px" }}>
          <PixelarticonsPlus style={{ verticalAlign: "middle" }} />
        </SecondaryButton>
      </TitleBar>
    );
  }, [setPage]);
  const TabNavigationM = useMemo(() => <TabNavigation />, []);
  const FeedM = useMemo(() => {
    return showComments ? (
      <RepliesList replies={replies} showOpen={true} />
    ) : (
      <Feed posts={posts} />
    );
  }, [posts, replies, showComments]);

  return (
    <div>
      {TitleBarM}
      {TabNavigationM}
      {FeedM}
    </div>
  );
}
