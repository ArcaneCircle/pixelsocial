import { useState, useContext, useMemo } from "react";

import { INPUT_BG_COLOR, INPUT_FG_COLOR, BORDER_COLOR } from "~/constants";
import { _ } from "~/lib/i18n";
import { ManagerContext } from "~/contexts";

import PrimaryButton from "~/components/PrimaryButton";
import SuccessAlert from "~/components/SuccessAlert";
import TopBar from "~/components/TopBar";
import BottomBar from "~/components/BottomBar";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  gap: "1em",
  paddingTop: "1em",
  paddingBottom: "5em",
};

const labelStyle = {
  marginBottom: "0.5em",
};

const inputStyle = {
  backgroundColor: INPUT_BG_COLOR,
  color: INPUT_FG_COLOR,
  border: "1px solid " + BORDER_COLOR,
  padding: "0.4em",
  width: "100%",
  boxSizing: "border-box" as "border-box",
};

export default function Settings() {
  const manager = useContext(ManagerContext);
  const [displayName, setDisplayName] = useState(manager.selfName);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    manager.setSelfName(displayName.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const TopBarM = useMemo(() => {
    const style = {
      paddingTop: "0.5em",
      paddingBottom: "0.5em",
    };
    return (
      <TopBar>
        <div className="hpad08 noselect" style={style}>
          <span style={{ fontSize: "1.2em" }}>{_("Settings")}</span>
        </div>
      </TopBar>
    );
  }, []);
  const BottomBarM = useMemo(() => <BottomBar />, []);

  return (
    <div>
      {TopBarM}
      <div className="hpad08" style={containerStyle}>
        <div>
          <div className="noselect" style={labelStyle}>{_("Display Name")}</div>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={inputStyle}
            placeholder={window.webxdc.selfName}
          />
        </div>
        <PrimaryButton onClick={handleSave}>{_("Save")}</PrimaryButton>
        {saved && <SuccessAlert>{_("Changes saved!")}</SuccessAlert>}
      </div>
      {BottomBarM}
    </div>
  );
}
