import { useContext, useCallback } from "react";

import PixelarticonsHeart from "~icons/pixelarticons/heart";
import PixelarticonsComment from "~icons/pixelarticons/comment";
import PixelarticonsForward from "~icons/pixelarticons/forward";
import IconHeartFilled from "~icons/custom/heart-filled";

import { LIKE_COLOR } from "~/constants";
import { ManagerContext, PageContext } from "~/contexts";
import IconButton from "~/components/IconButton";
import { _ } from "~/lib/i18n";

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
    color: post.liked ? LIKE_COLOR : undefined,
  };

  return (
    <div
      style={containerStyle}
      {...props}
      role="group"
      aria-label={_("Post Actions")}
    >
      <IconButton
        style={likeIconStyle}
        aria-label={_("{{n}} Likes").replace("{{n}}", post.likes.toString())}
        onClick={onLike}
      >
        {post.liked ? <IconHeartFilled /> : <PixelarticonsHeart />}
        {post.likes}
      </IconButton>
      <IconButton
        aria-label={_("{{n}} Replies").replace(
          "{{n}}",
          post.replies.toString(),
        )}
        onClick={onComment}
      >
        <PixelarticonsComment />
        {post.replies}
      </IconButton>
      <IconButton>
        <PixelarticonsForward
          style={{ width: "1.2em", height: "auto" }}
          aria-label={_("Share")}
          onClick={onShare}
        />
      </IconButton>
    </div>
  );
}
