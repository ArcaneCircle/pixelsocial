import { useMemo, useContext } from "react";
import PixelarticonsPlus from "~icons/pixelarticons/plus";

import { _ } from "~/lib/i18n";
import { PageContext } from "~/contexts";

import TitleBar from "~/components/TitleBar";
import TabNavigation from "~/components/TabNavigation";
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
        <SecondaryButton onClick={onClick} style={{ padding: "5px 10px" }}>
          <PixelarticonsPlus style={{ verticalAlign: "middle" }} />
        </SecondaryButton>
      </TitleBar>
    );
  }, [setPage]);
  const TabNavigationM = useMemo(() => <TabNavigation />, []);
  const FeedM = useMemo(() => <Feed posts={posts} />, [posts]);

  return (
    <div>
      {TitleBarM}
      {TabNavigationM}
      {FeedM}
    </div>
  );
}
