import PixelarticonsArrowLeft from "~icons/pixelarticons/arrow-left";

import { BORDER_COLOR, BG_COLOR } from "~/constants";

const barStyle = {
  display: "flex",
  flexDirection: "row" as "row",
  alignItems: "center",
  padding: "0.8em",
  borderBottom: "1px solid " + BORDER_COLOR,
  position: "sticky" as "sticky",
  top: 0,
  backgroundColor: BG_COLOR,
  zIndex: 99,
  gap: "0.5em",
  cursor: "pointer",
};

interface Props {
  onClick: () => void;
}

export default function TopBar({ onClick }: Props) {
  return (
    <div style={barStyle} onClick={onClick} className="noselect">
      <PixelarticonsArrowLeft style={{ fontSize: "1.5em" }} />
      <span style={{ fontSize: "1.2em" }}>Back</span>
    </div>
  );
}
