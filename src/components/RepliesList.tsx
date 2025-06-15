import { useMemo } from "react";

import ReplyItem from "~/components/ReplyItem";

interface Props {
  replies: Reply[];
}

export default function RepliesList({ replies }: Props) {
  const items = replies.map((r) =>
    useMemo(() => <ReplyItem key={r.id} reply={r} />, [r.id]),
  );

  return (
    <div style={{ marginBottom: "3em" }}>
      {replies.length ? (
        items
      ) : (
        <p style={{ textAlign: "center", fontSize: "1.5em", color: "#737373" }}>
          No comments yet.
        </p>
      )}
    </div>
  );
}
