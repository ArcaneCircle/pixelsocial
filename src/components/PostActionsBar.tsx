import { useContext, useCallback } from "react";
import { ManagerContext, PageContext } from "~/contexts.ts";

import PixelarticonsHeart from "~icons/pixelarticons/heart";
import PixelarticonsComment from "~icons/pixelarticons/comment";
import PixelarticonsForward from "~icons/pixelarticons/forward";

import IconHeartFill from "~/components/IconHeartFill";
import IconButton from "~/components/IconButton";

const containerStyle = {
  display: "flex",
  flexDirection: "row" as "row",
  flexWrap: "nowrap" as "nowrap",
  gap: "0.5em",
  justifyContent: "space-between",
};

interface Props {
  post: Post;
  onShare: () => void;
  [key: string]: any;
}

export default function PostActionsBar({ post, onShare, ...props }: Props) {
  const manager = useContext(ManagerContext);
  const { setPage } = useContext(PageContext);

  const onLike = useCallback(async () => {
    if (post.liked) {
      manager.unlike(post.id);
    } else {
      manager.like(post.id);
    }
  }, [post.id, post.liked]);

  const onComment = useCallback(() => {
    setPage({ key: "comments", postId: post.id });
  }, [post.id]);

  const likeIconStyle = {
    color: post.liked ? "rgb(213, 176, 34)" : undefined,
  };

  return (
    <div style={containerStyle} {...props}>
      <IconButton style={likeIconStyle} onClick={onLike}>
        {post.liked ? (
          <IconHeartFill />
        ) : (
          <PixelarticonsHeart style={{ width: "1em" }} />
        )}
        {post.likes}
      </IconButton>
      <IconButton onClick={onComment}>
        <PixelarticonsComment style={{ width: "1em" }} />
        {post.replies}
      </IconButton>
      <IconButton>
        <PixelarticonsForward onClick={onShare} />
      </IconButton>
    </div>
  );
}
