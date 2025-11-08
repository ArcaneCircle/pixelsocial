import { useContext } from "react";
import PixelarticonsHome from "~icons/pixelarticons/home";
import PixelarticonsPlus from "~icons/pixelarticons/plus";
import PixelarticonsMenu from "~icons/pixelarticons/menu";

import { PageContext } from "~/contexts";
import { BORDER_COLOR, BG_COLOR, ACCENT_COLOR } from "~/constants";

const barStyle = {
  display: "flex",
  flexDirection: "row" as "row",
  alignItems: "center",
  justifyContent: "space-around",
  padding: "0.8em",
  borderTop: "1px solid " + BORDER_COLOR,
  position: "fixed" as "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: BG_COLOR,
  zIndex: 99,
};

const tabStyle = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "0.5em",
  cursor: "pointer",
  fontSize: "1.5em",
};

const activeTabStyle = {
  ...tabStyle,
  color: ACCENT_COLOR,
};

export default function BottomBar() {
  const { pageData, setPage } = useContext(PageContext);

  const isHome = pageData.key === "home";
  const isNewPost = pageData.key === "newpost";
  const isUserProfile = pageData.key === "userprofile";

  return (
    <div style={barStyle}>
      <div
        className="noselect"
        style={isHome ? activeTabStyle : tabStyle}
        onClick={() => setPage({ key: "home", showComments: false })}
      >
        <PixelarticonsHome />
      </div>
      <div
        className="noselect"
        style={isNewPost ? activeTabStyle : tabStyle}
        onClick={() => setPage({ key: "newpost" })}
      >
        <PixelarticonsPlus />
      </div>
      <div
        className="noselect"
        style={isUserProfile ? activeTabStyle : tabStyle}
        onClick={() => setPage({ key: "userprofile" })}
      >
        <PixelarticonsMenu />
      </div>
    </div>
  );
}
