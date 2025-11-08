import { useState, useMemo, useEffect, useContext } from "react";

import { _ } from "~/lib/i18n";
import { ManagerContext } from "~/contexts";

import TabNavigation from "~/components/TabNavigation";
import Feed from "~/components/Feed";
import RepliesList from "~/components/RepliesList";
import BottomBar from "~/components/BottomBar";

interface Props {
  posts: Post[];
  showComments: boolean;
}

export default function Home({ posts, showComments }: Props) {
  const manager = useContext(ManagerContext);
  const [replies, setReplies] = useState<Reply[]>([]);

  useEffect(() => {
    (async () => {
      if (showComments) {
        setReplies(await manager.getAllReplies());
      }
    })();
  }, [posts, showComments]); // posts is required so replies are refreshed

  const TabNavigationM = useMemo(() => <TabNavigation />, []);
  const FeedM = useMemo(() => {
    return showComments ? (
      <RepliesList replies={replies} showOpen={true} />
    ) : (
      <Feed posts={posts} />
    );
  }, [posts, replies, showComments]);
  const BottomBarM = useMemo(() => <BottomBar />, []);

  return (
    <div>
      {TabNavigationM}
      <div style={{ paddingBottom: "4em" }}>{FeedM}</div>
      {BottomBarM}
    </div>
  );
}
