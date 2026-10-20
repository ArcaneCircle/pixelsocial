import { useContext } from "react";
import PixelarticonsHome from "~icons/pixelarticons/home";
import PixelarticonsPlus from "~icons/pixelarticons/plus";
import PixelarticonsMenu from "~icons/pixelarticons/menu";

import { PageContext } from "~/contexts";
import { BORDER_COLOR, BG_COLOR, ACCENT_COLOR } from "~/constants";
import { _ } from "~/lib/i18n";

import IconButton from "~/components/IconButton";

const barStyle = {
  display: "flex",
  flexDirection: "row" as "row",
  alignItems: "center",
  justifyContent: "space-around",
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
  fontSize: "1.2em",
};

const activeTabStyle = {
  ...tabStyle,
  color: ACCENT_COLOR,
};

export default function BottomBar() {
  const { pageData, setPage } = useContext(PageContext);

  return (
    <div style={barStyle} role="navigation">
      <IconButton
        style={pageData.key === "home" ? activeTabStyle : tabStyle}
        aria-pressed={pageData.key === "home"}
        aria-label={_("Home")}
        onClick={() => setPage({ key: "home", showComments: false })}
      >
        <PixelarticonsHome />
      </IconButton>
      <IconButton
        style={pageData.key === "newpost" ? activeTabStyle : tabStyle}
        aria-pressed={pageData.key === "newpost"}
        aria-label={_("New Post")}
        onClick={() => setPage({ key: "newpost" })}
      >
        <PixelarticonsPlus />
      </IconButton>
      <IconButton
        style={pageData.key === "settings" ? activeTabStyle : tabStyle}
        aria-pressed={pageData.key === "settings"}
        aria-label={_("Settings")}
        onClick={() => setPage({ key: "settings" })}
      >
        <PixelarticonsMenu />
      </IconButton>
    </div>
  );
}
