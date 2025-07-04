import { useContext, useCallback } from "react";

import PixelarticonsHeart from "~icons/pixelarticons/heart";
import PixelarticonsComment from "~icons/pixelarticons/comment";
import PixelarticonsForward from "~icons/pixelarticons/forward";
import IconHeartFilled from "~icons/custom/heart-filled";

import { ManagerContext, PageContext } from "~/contexts";
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
    sessionStorage.feedScrollPos = window.pageYOffset;
    setPage({ key: "comments", postId: post.id });
  }, [post.id]);

  const likeIconStyle = {
    color: post.liked ? "#d5b022" : undefined,
  };

  return (
    <div style={containerStyle} {...props}>
      <IconButton style={likeIconStyle} onClick={onLike}>
        {post.liked ? <IconHeartFilled /> : <PixelarticonsHeart />}
        {post.likes}
      </IconButton>
      <IconButton onClick={onComment}>
        <PixelarticonsComment />
        {post.replies}
      </IconButton>
      <IconButton>
        <PixelarticonsForward
          style={{ width: "1.2em", height: "auto" }}
          onClick={onShare}
        />
      </IconButton>
    </div>
  );
}
