import { useCallback, useContext } from "react";

import { ManagerContext } from "~/contexts.ts";

import BasePostItem from "~/components/BasePostItem";

interface Props {
  reply: Reply;
}

export default function ReplyItem({ reply }: Props) {
  const manager = useContext(ManagerContext);
  const deleteReply = useCallback(
    () => manager.deleteReply(reply.postId, reply.id),
    [reply.id],
  );

  return (
    <BasePostItem
      authorId={reply.authorId}
      authorName={reply.authorName}
      date={reply.date}
      deletePost={deleteReply}
      style={{ backgroundColor: "#23232f" }}
    >
      <span className="hpad08">{reply.text}</span>
    </BasePostItem>
  );
}
