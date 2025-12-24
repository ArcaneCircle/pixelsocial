import { useState, useRef, useCallback, useContext } from "react";
import { toJpeg } from "html-to-image";

import {
  TEXT_TRUNCATE_SIZE,
  TEXT_TRUNCATE_LINES,
  ACCENT_COLOR,
} from "~/constants";
import { ManagerContext } from "~/contexts";
import { _ } from "~/lib/i18n";
import { getImageExtension } from "~/lib/util";

import BasePostItem from "~/components/BasePostItem";
import PostActionsBar from "~/components/PostActionsBar";
import PostImage from "~/components/PostImage";
import PostVideo from "~/components/PostVideo";

const linkStyle = {
  color: ACCENT_COLOR,
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
      if (post.file.startsWith("data:video/")) {
        const parts = post.file.split(",", 2);
        if (parts.length === 2) {
          const base64 = parts[1];
          const name = post.filename || "video.mp4";
          file = { name, type: "video", base64 };
        }
      } else if (post.file) {
        const parts = post.file.split(",", 2);
        if (parts.length === 2) {
          const [meta, base64] = parts;
          const ext = getImageExtension(meta) || "png";
          const name = post.filename || "image." + ext;
          file = { name, type: "image", base64 };
        }
      }
    }
    window.webxdc.sendToChat({ file, text });
  }, [post.text, post.file, post.filename, post.style, textRef]);

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

  const isImage = post.file.startsWith("data:image/");
  const isVideo = post.file.startsWith("data:video/");

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
      {isImage && <PostImage src={post.file} />}
      {isVideo && <PostVideo src={post.file} />}
      <PostActionsBar className="hpad08" post={post} onShare={onShare} />
    </BasePostItem>
  );
}
