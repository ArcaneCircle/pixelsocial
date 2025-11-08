import { useMemo, useContext } from "react";

import { _ } from "~/lib/i18n";
import { ManagerContext } from "~/contexts";

import UserItem from "~/components/UserItem";
import Draft from "~/components/Draft";
import BottomBar from "~/components/BottomBar";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  flexWrap: "nowrap" as "nowrap",
  gap: "0.5em",
  padding: "0.8em",
  paddingBottom: "5em", // Space for bottom bar
};

export default function NewPost() {
  const manager = useContext(ManagerContext);

  const userM = useMemo(() => {
    return (
      <UserItem
        isAdmin={manager.isAdmin}
        userId={manager.selfId}
        name={manager.selfName}
      />
    );
  }, [manager]);

  const draftM = useMemo(() => <Draft />, []);
  const BottomBarM = useMemo(() => <BottomBar />, []);

  return (
    <div>
      <div style={containerStyle}>
        {userM}
        {draftM}
      </div>
      {BottomBarM}
    </div>
  );
}
