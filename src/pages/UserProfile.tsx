import { useState, useContext, useMemo } from "react";

import { ManagerContext } from "~/contexts";
import { INPUT_BG_COLOR, INPUT_FG_COLOR, BORDER_COLOR } from "~/constants";
import Button from "~/components/Button";
import BottomBar from "~/components/BottomBar";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  gap: "1em",
  padding: "1.5em",
  paddingBottom: "5em", // Space for bottom bar
};

const labelStyle = {
  fontSize: "1em",
  marginBottom: "0.5em",
};

const inputStyle = {
  backgroundColor: INPUT_BG_COLOR,
  color: INPUT_FG_COLOR,
  border: "1px solid " + BORDER_COLOR,
  padding: "0.8em",
  fontSize: "1em",
  borderRadius: "4px",
  width: "100%",
  boxSizing: "border-box" as "border-box",
};

const titleStyle = {
  fontSize: "1.8em",
  marginBottom: "1em",
};

export default function UserProfile() {
  const manager = useContext(ManagerContext);
  const [displayName, setDisplayName] = useState(manager.selfName);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (displayName.trim()) {
      localStorage.selfName = displayName.trim();
      manager.selfName = displayName.trim();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const BottomBarM = useMemo(() => <BottomBar />, []);

  return (
    <div>
      <div style={containerStyle}>
        <h1 style={titleStyle}>User Profile</h1>
        <div>
          <div style={labelStyle}>Display Name</div>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={inputStyle}
            placeholder="Enter your display name"
          />
        </div>
        <Button onClick={handleSave}>Save</Button>
        {saved && (
          <div style={{ color: "#00cc82", marginTop: "0.5em" }}>
            Display name saved!
          </div>
        )}
      </div>
      {BottomBarM}
    </div>
  );
}
