import PixelarticonsHeart from "~icons/pixelarticons/heart";
//import PixelarticonsComment from "~icons/pixelarticons/comment";
import PixelarticonsForward from "~icons/pixelarticons/forward";

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
  onLike: () => void;
  onShare: () => void;
  [key: string]: any;
}

export default function PostActionsBar({ onLike, onShare, ...props }: Props) {
  return (
    <div style={containerStyle} {...props}>
      <div className="noselect" style={btnStyle} onClick={onLike}>
        <PixelarticonsHeart style={{ fontSize: "1em" }} />0
      </div>
      {/* <div className="noselect" style={btnStyle}>
          <PixelarticonsComment style={{ fontSize: "1em" }} />0
          </div> */}
      <PixelarticonsForward style={{ fontSize: "1.2em" }} onClick={onShare} />
    </div>
  );
}
