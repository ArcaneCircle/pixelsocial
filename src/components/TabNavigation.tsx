import { useContext } from "react";

import { PageContext } from "~/contexts";
import { ACCENT_COLOR, BORDER_COLOR } from "~/constants";
import { _ } from "~/lib/i18n";

const containerStyle = {
  display: "flex",
  borderBottom: "1px solid " + BORDER_COLOR,
};

const tabStyle = {
  flex: 1,
  textAlign: "center" as "center",
  padding: "0.8em",
  cursor: "pointer",
  borderBottom: "2px solid transparent",
};

const activeTabStyle = {
  ...tabStyle,
  borderBottom: "2px solid " + ACCENT_COLOR,
  color: ACCENT_COLOR,
};

export default function TabNavigation() {
  const { pageData, setPage } = useContext(PageContext);

  const isPostsActive = pageData.key === "home";
  const isCommentsActive = pageData.key === "allComments";

  return (
    <div style={containerStyle}>
      <div
        style={isPostsActive ? activeTabStyle : tabStyle}
        onClick={() => setPage({ key: "home" })}
      >
        {_("Posts")}
      </div>
      <div
        style={isCommentsActive ? activeTabStyle : tabStyle}
        onClick={() => setPage({ key: "allComments" })}
      >
        {_("Comments")}
      </div>
    </div>
  );
}
