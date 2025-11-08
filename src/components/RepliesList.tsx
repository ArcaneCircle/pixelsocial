import { useMemo } from "react";

import { GRAY_COLOR } from "~/constants";
import { _ } from "~/lib/i18n";
import ReplyItem from "~/components/ReplyItem";

interface Props {
  replies: Reply[];
  focusReplyId?: string;
  showOpen?: boolean;
}

export default function RepliesList({
  replies,
  focusReplyId,
  showOpen,
}: Props) {
  const items = replies.map((r) =>
    useMemo(
      () => (
        <ReplyItem
          key={r.id}
          reply={r}
          isFocused={focusReplyId === r.id}
          showOpen={showOpen}
        />
      ),
      [r.id, focusReplyId, showOpen],
    ),
  );

  return (
    <div style={showOpen ? undefined : { marginBottom: "5em" }}>
      {replies.length ? (
        items
      ) : (
        <p
          style={{
            textAlign: "center",
            fontSize: "1.5em",
            color: GRAY_COLOR,
            paddingLeft: "0.5em",
            paddingRight: "0.5em",
          }}
        >
          {_("No comments yet")}
        </p>
      )}
    </div>
  );
}
