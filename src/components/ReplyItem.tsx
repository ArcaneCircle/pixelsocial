import { formatDateShort } from "~/lib/util";

import UserItem from "~/components/UserItem";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  flexWrap: "nowrap" as "nowrap",
  gap: "0.5em",
  borderBottom: "1px solid hsl(240, 16%, 23%)",
  padding: "0.5em 0",
};
const contentStyle = {
  overflowWrap: "break-word" as "break-word",
  wordBreak: "break-word" as "break-word",
  whiteSpace: "pre-wrap",
};

interface Props {
  reply: Reply;
}

export default function ReplyItem({ reply }: Props) {
  return (
    <div style={containerStyle}>
      <UserItem
        className="hpad08"
        userId={reply.authorId}
        name={reply.authorName}
        subtitle={formatDateShort(reply.date)}
      />
      <div className="hpad08" style={contentStyle}>
        {reply.text}
      </div>
    </div>
  );
}
