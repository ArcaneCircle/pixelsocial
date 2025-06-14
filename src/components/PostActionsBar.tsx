import PixelarticonsHeart from "~icons/pixelarticons/heart";
//import PixelarticonsComment from "~icons/pixelarticons/comment";
import PixelarticonsForward from "~icons/pixelarticons/forward";

import IconHeartFill from "~/components/IconHeartFill";

const containerStyle = {
  display: "flex",
  flexDirection: "row" as "row",
  flexWrap: "nowrap" as "nowrap",
  gap: "0.5em",
  justifyContent: "space-between",
};

const btnStyle = {
  display: "flex",
  flexDirection: "row" as "row",
  flexWrap: "nowrap" as "nowrap",
  gap: "0.2em",
  alignItems: "center",
};

interface Props {
  post: Post;
  onLike: () => void;
  onShare: () => void;
  [key: string]: any;
}

export default function PostActionsBar({
  post,
  onLike,
  onShare,
  ...props
}: Props) {
  const likeIconStyle = {
    ...btnStyle,
    fontSize: "1em",
    color: post.liked ? "rgb(213, 176, 34)" : undefined,
  };

  return (
    <div style={containerStyle} {...props}>
      <div className="noselect" style={likeIconStyle} onClick={onLike}>
        {post.liked ? (
          <IconHeartFill />
        ) : (
          <PixelarticonsHeart style={{ width: "1em" }} />
        )}
        {post.likes}
      </div>
      {/* <div className="noselect" style={btnStyle}>
          <PixelarticonsComment style={{ fontSize: "1em" }} />0
          </div> */}
      <PixelarticonsForward style={{ fontSize: "1.2em" }} onClick={onShare} />
    </div>
  );
}
