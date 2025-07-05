import { useState, useRef, useCallback, useContext } from "react";
import { toJpeg } from "html-to-image";

import { TEXT_TRUNCATE_SIZE, TEXT_TRUNCATE_LINES } from "~/constants";
import { ManagerContext } from "~/contexts";
import { _ } from "~/lib/i18n";

import BasePostItem from "~/components/BasePostItem";
import PostActionsBar from "~/components/PostActionsBar";
import PostImage from "~/components/PostImage";

const linkStyle = {
  color: "#ccae3a",
  cursor: "pointer",
};

interface Props {
  post: Post;
}

export default function PostItem({ post }: Props) {
  const [showMore, setShowMore] = useState(false);
  const manager = useContext(ManagerContext);
  const textRef = useRef<HTMLDivElement | null>(null);

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
  }, [post.text, post.image, post.style, textRef]);

  const onShowMore = useCallback(() => {
    setShowMore(true);
  }, [post.id]);

  const deletePost = useCallback(() => manager.deletePost(post.id), [post.id]);

  let truncated = false;
  let text = post.text;
  if (!post.style && !showMore) {
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
      authorId={post.authorId}
      authorName={post.authorName}
      isAdmin={!!post.isAdmin}
      date={post.date}
      deletePost={deletePost}
    >
      <div
        ref={textRef}
        className={post.style ? `card grad${post.style}` : "hpad08"}
      >
        {text}
        {truncated && (
          <span style={linkStyle} onClick={onShowMore}>
            {_("Show More...")}
          </span>
        )}
      </div>
      {post.image && <PostImage src={post.image} />}
      <PostActionsBar className="hpad08" post={post} onShare={onShare} />
    </BasePostItem>
  );
}
