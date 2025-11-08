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

  const showComments = pageData.key === "home" && pageData.showComments;

  return (
    <div style={containerStyle}>
      <div
        style={!showComments ? activeTabStyle : tabStyle}
        onClick={() => setPage({ key: "home", showComments: false })}
      >
        {_("Posts")}
      </div>
      <div
        style={showComments ? activeTabStyle : tabStyle}
        onClick={() => setPage({ key: "home", showComments: true })}
      >
        {_("Comments")}
      </div>
    </div>
  );
}
