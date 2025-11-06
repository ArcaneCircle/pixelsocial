import { useMemo, useContext, useState, useEffect } from "react";

import { _ } from "~/lib/i18n";
import { ManagerContext } from "~/contexts";

import TitleBar from "~/components/TitleBar";
import TabNavigation from "~/components/TabNavigation";
import AllRepliesList from "~/components/AllRepliesList";

interface Props {
  posts: Post[];
}

export default function AllComments({ posts }: Props) {
  const manager = useContext(ManagerContext);
  const [replies, setReplies] = useState<Reply[]>([]);

  useEffect(() => {
    (async () => {
      setReplies(await manager.getAllReplies());
    })();
  }, [posts]);

  const TitleBarM = useMemo(() => {
    return <TitleBar>{_("Comments")}</TitleBar>;
  }, []);

  const TabNavigationM = useMemo(() => <TabNavigation />, []);

  const RepliesM = useMemo(
    () => <AllRepliesList replies={replies} />,
    [replies],
  );

  return (
    <div>
      {TitleBarM}
      {TabNavigationM}
      {RepliesM}
    </div>
  );
}
