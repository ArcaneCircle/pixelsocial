import { useMemo, useContext, useState, useEffect } from "react";

import { _ } from "~/lib/i18n";
import { ManagerContext, PageContext } from "~/contexts";

import TopBar from "~/components/TopBar";
import PostItem from "~/components/PostItem";
import RepliesList from "~/components/RepliesList";
import ReplyDraft from "~/components/ReplyDraft";

interface Props {
  post: Post;
  focusReplyId?: string;
}

export default function PostComments({ post, focusReplyId }: Props) {
  const manager = useContext(ManagerContext);
  const { setPage } = useContext(PageContext);
  const [replies, setReplies] = useState<Reply[]>([]);

  const fromAllComments = !!focusReplyId;
  const TopBarM = useMemo(() => {
    const onClick = () =>
      setPage({ key: "home", showComments: fromAllComments });
    return <TopBar onClick={onClick} />;
  }, [setPage, fromAllComments]);

  useEffect(() => {
    (async () => {
      setReplies(await manager.getReplies(post.id));
    })();
  }, [post.id, post.replies]);

  useEffect(() => {
    if (focusReplyId) {
      const element = document.getElementById(`reply-${focusReplyId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [focusReplyId, replies]);

  const RepliesM = useMemo(
    () => <RepliesList replies={replies} focusReplyId={focusReplyId} />,
    [replies, focusReplyId],
  );

  const PostM = useMemo(() => <PostItem key={post.id} post={post} />, [post]);

  const ReplyDraftM = useMemo(() => <ReplyDraft postId={post.id} />, [post.id]);

  return (
    <div>
      {TopBarM}
      {PostM}
      {RepliesM}
      {ReplyDraftM}
    </div>
  );
}
