import { useState, useCallback, useContext } from "react";

import PixelarticonsExternalLink from "~icons/pixelarticons/external-link";

import {
  TEXT_TRUNCATE_SIZE,
  TEXT_TRUNCATE_LINES,
  ACCENT_COLOR,
  REPLY_BG_COLOR,
  BORDER_COLOR,
} from "~/constants";
import { ManagerContext, PageContext } from "~/contexts";
import { _ } from "~/lib/i18n";

import BasePostItem from "~/components/BasePostItem";
import IconButton from "~/components/IconButton";

const linkStyle = {
  color: ACCENT_COLOR,
  cursor: "pointer",
};

interface Props {
  reply: Reply;
}

export default function AllReplyItem({ reply }: Props) {
  const [showMore, setShowMore] = useState(false);
  const manager = useContext(ManagerContext);
  const { setPage } = useContext(PageContext);

  const deleteReply = useCallback(
    () => manager.deleteReply(reply.postId, reply.id),
    [reply.id],
  );

  const onShowMore = useCallback(() => {
    setShowMore(true);
  }, [reply.id]);

  const openInContext = useCallback(() => {
    setPage({ key: "comments", postId: reply.postId, focusReplyId: reply.id });
  }, [reply.postId, reply.id]);

  let truncated = false;
  let text = reply.text;
  if (!showMore) {
    if (text.length > TEXT_TRUNCATE_SIZE) {
      truncated = true;
      text = text.substring(0, TEXT_TRUNCATE_SIZE);
    }
    const lines = text.split("\n");
    if (lines.length > TEXT_TRUNCATE_LINES) {
      truncated = true;
      text = lines.slice(0, TEXT_TRUNCATE_LINES).join("\n");
    }
    if (truncated) {
      text += "... ";
    }
  }

  const extraMenuItems = (
    <IconButton
      onClick={openInContext}
      style={{
        padding: "0.5em 0",
        borderBottom: "1px solid " + BORDER_COLOR,
      }}
    >
      <PixelarticonsExternalLink />
      {_("Open in context")}
    </IconButton>
  );

  return (
    <BasePostItem
      authorId={reply.authorId}
      authorName={reply.authorName}
      isAdmin={!!reply.isAdmin}
      date={reply.date}
      deletePost={deleteReply}
      style={{ backgroundColor: REPLY_BG_COLOR }}
      extraMenuItems={extraMenuItems}
    >
      <div className="hpad08">
        {text}
        {truncated && (
          <span style={linkStyle} onClick={onShowMore}>
            {_("Show More...")}
          </span>
        )}
      </div>
    </BasePostItem>
  );
}
