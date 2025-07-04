import { useMemo, useContext, useState, useEffect } from "react";

import { _ } from "~/lib/i18n";
import { ManagerContext, PageContext } from "~/contexts";

import TitleBar from "~/components/TitleBar";
import PostItem from "~/components/PostItem";
import RepliesList from "~/components/RepliesList";
import ReplyDraft from "~/components/ReplyDraft";
import SecondaryButton from "~/components/SecondaryButton";

interface Props {
  post: Post;
}

export default function PostComments({ post }: Props) {
  const manager = useContext(ManagerContext);
  const { setPage } = useContext(PageContext);
  const [replies, setReplies] = useState<Reply[]>([]);

  const titleBarM = useMemo(() => {
    const onClick = () => setPage({ key: "home" });
    return (
      <TitleBar>
        <SecondaryButton onClick={onClick}>{_("Back")}</SecondaryButton>
      </TitleBar>
    );
  }, [setPage]);

  useEffect(() => {
    (async () => {
      setReplies(await manager.getReplies(post.id));
    })();
  }, [post.id, post.replies]);

  const RepliesM = useMemo(() => <RepliesList replies={replies} />, [replies]);

  const PostM = useMemo(() => <PostItem key={post.id} post={post} />, [post]);

  const ReplyDraftM = useMemo(() => <ReplyDraft postId={post.id} />, [post.id]);

  return (
    <div>
      {titleBarM}
      {PostM}
      {RepliesM}
      {ReplyDraftM}
    </div>
  );
}
