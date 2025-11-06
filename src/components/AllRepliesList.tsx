import { useMemo } from "react";

import { GRAY_COLOR } from "~/constants";
import { _ } from "~/lib/i18n";
import AllReplyItem from "~/components/AllReplyItem";

interface Props {
  replies: Reply[];
}

export default function AllRepliesList({ replies }: Props) {
  const items = replies.map((r) =>
    useMemo(() => <AllReplyItem key={r.id} reply={r} />, [r.id]),
  );

  return (
    <div style={{ marginBottom: "3em" }}>
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
