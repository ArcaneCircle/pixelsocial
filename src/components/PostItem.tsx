import { useRef, useCallback, useContext } from "react";
import { toJpeg } from "html-to-image";

import { ManagerContext } from "~/contexts";

import BasePostItem from "~/components/BasePostItem";
import PostActionsBar from "~/components/PostActionsBar";
import PostImage from "~/components/PostImage";

interface Props {
  post: Post;
}

export default function PostItem({ post }: Props) {
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

  const deletePost = useCallback(() => manager.deletePost(post.id), [post.id]);

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
        {post.text}
      </div>
      {post.image && <PostImage src={post.image} />}
      <PostActionsBar className="hpad08" post={post} onShare={onShare} />
    </BasePostItem>
  );
}
