import { useRef, useCallback, useContext } from "react";
import { toJpeg } from "html-to-image";

import { ManagerContext } from "~/lib/manager.ts";
import { formatDateShort } from "~/lib/util";

import UserItem from "~/components/UserItem";
import PostActionsBar from "~/components/PostActionsBar";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  flexWrap: "nowrap" as "nowrap",
  gap: "0.5em",
  borderBottom: "1px solid hsl(240, 16%, 23%)",
  padding: "0.5em 0",
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
  const manager = useContext(ManagerContext);
  const textRef = useRef<HTMLDivElement | null>(null);

  const onLike = useCallback(async () => {
    if (post.liked) {
      manager.unlike(post.id);
    } else {
      manager.like(post.id);
    }
  }, [post.id, post.liked]);

  const onShare = useCallback(async () => {
    let text = "";
    let file = undefined;
    if (post.style) {
      const imgUrl = await toJpeg(textRef.current!, { quality: 0.95 });
      const base64 = imgUrl.split(",")[1];
      // @ts-ignore
      file = { name: "image.jpeg", type: "image", base64 };
    } else {
      text = post.text;
      if (post.image) {
        const base64 = post.image.split(",")[1];
        file = { name: "image.png", type: "image", base64 };
      }
    }
    window.webxdc.sendToChat({ file, text });
  }, [post, textRef]);

  return (
    <div style={containerStyle}>
      <UserItem
        className="hpad08"
        userId={post.authorId}
        name={post.authorName}
        subtitle={formatDateShort(post.date)}
      />
      <div style={contentStyle}>
        <div
          ref={textRef}
          className={post.style ? `card grad${post.style}` : "hpad08"}
        >
          {post.text}
        </div>
        {post.image && <img src={post.image} style={imgStyle} />}
        <PostActionsBar
          className="hpad08"
          post={post}
          onLike={onLike}
          onShare={onShare}
        />
      </div>
    </div>
  );
}
