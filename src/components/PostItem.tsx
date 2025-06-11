import UserItem from "~/components/UserItem";

import { formatDateShort } from "~/lib/util";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  flexWrap: "nowrap" as "nowrap",
  gap: "0.5em",
  borderBottom: "1px solid hsl(240, 16%, 23%)",
  padding: "0.5em 0.8em",
};
const contentStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  gap: "0.3em",
  overflowWrap: "break-word" as "break-word",
  wordBreak: "break-word" as "break-word",
  whiteSpace: "pre-wrap",
};
const imgStyle = {
  display: "block",
  maxHeight: "40vh",
  width: "fit-content",
  maxWidth: "100%",
  alignSelf: "center",
};

interface Props {
  post: Post;
}

export default function PostItem({ post }: Props) {
  return (
    <div style={containerStyle}>
      <UserItem
        userId={post.authorId}
        name={post.authorName}
        subtitle={formatDateShort(post.date)}
      />
      <div style={contentStyle}>
        <span>{post.text}</span>
        {post.image && <img src={post.image} style={imgStyle} />}
      </div>
    </div>
  );
}
