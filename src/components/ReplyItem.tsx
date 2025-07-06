import { useState, useCallback, useContext } from "react";

import {
  TEXT_TRUNCATE_SIZE,
  TEXT_TRUNCATE_LINES,
  ACCENT_COLOR,
  REPLY_BG_COLOR,
} from "~/constants";
import { ManagerContext } from "~/contexts";
import { _ } from "~/lib/i18n";

import BasePostItem from "~/components/BasePostItem";

const linkStyle = {
  color: ACCENT_COLOR,
  cursor: "pointer",
};

interface Props {
  reply: Reply;
}

export default function ReplyItem({ reply }: Props) {
  const [showMore, setShowMore] = useState(false);
  const manager = useContext(ManagerContext);
  const deleteReply = useCallback(
    () => manager.deleteReply(reply.postId, reply.id),
    [reply.id],
  );
  const onShowMore = useCallback(() => {
    setShowMore(true);
  }, [reply.id]);

  let truncated = false;
  let text = reply.text;
  if (!showMore) {
    if (text.length > TEXT_TRUNCATE_SIZE) {
      truncated = true;
      text = text.substr(0, TEXT_TRUNCATE_SIZE);
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

  return (
    <BasePostItem
      authorId={reply.authorId}
      authorName={reply.authorName}
      isAdmin={!!reply.isAdmin}
      date={reply.date}
      deletePost={deleteReply}
      style={{ backgroundColor: REPLY_BG_COLOR }}
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
