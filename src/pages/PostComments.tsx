import { useMemo, useContext, useState, useEffect } from "react";
import PixelarticonsArrowLeft from "~icons/pixelarticons/arrow-left";

import { ACCENT_COLOR } from "~/constants";
import { _ } from "~/lib/i18n";
import { ManagerContext, PageContext } from "~/contexts";

import TopBar from "~/components/TopBar";
import PostItem from "~/components/PostItem";
import RepliesList from "~/components/RepliesList";
import ReplyDraft from "~/components/ReplyDraft";
import Draft from "~/components/Draft";
import IconButton from "~/components/IconButton";

interface Props {
  post: Post;
  focusReplyId?: string;
}

export default function PostComments({ post, focusReplyId }: Props) {
  const manager = useContext(ManagerContext);
  const { setPage } = useContext(PageContext);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showDraft, setShowDraft] = useState<boolean>(false);

  const fromAllComments = !!focusReplyId;
  const TopBarM = useMemo(() => {
    const onBack = () =>
      setPage({ key: "home", showComments: fromAllComments });
    const btnStyle = {
      paddingTop: "0.5em",
      paddingBottom: "0.5em",
      color: ACCENT_COLOR,
    };
    const backBtn = (
      <IconButton className="hpad08" style={btnStyle} onClick={onBack}>
        <PixelarticonsArrowLeft style={{ fontSize: "1.2em" }} />
        {_("Back")}
      </IconButton>
    );
    return <TopBar>{backBtn}</TopBar>;
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

  const ReplyDraftM = useMemo(
    () => (
      <ReplyDraft postId={post.id} onExpand={() => setShowDraft(true)} />
    ),
    [post.id],
  );

  const DraftM = useMemo(
    () => (
      <Draft replyToPostId={post.id} onReplySubmitted={() => setShowDraft(false)} />
    ),
    [post.id],
  );

  return (
    <div>
      {TopBarM}
      {PostM}
      {RepliesM}
      {showDraft ? DraftM : ReplyDraftM}
    </div>
  );
}
