import { useMemo } from "react";

import { _ } from "~/lib/i18n";
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
        <p style={{ textAlign: "center", fontSize: "1.5em", color: "#737373", paddingLeft: "0.5em", paddingRight: "0.5em" }}>
          {_("No comments yet")}
        </p>
      )}
    </div>
  );
}
