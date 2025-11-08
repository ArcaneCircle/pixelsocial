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
  paddingTop: "1em",
  paddingBottom: "5em",
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
      <div className="hpad08" style={containerStyle}>
        {userM}
        {draftM}
      </div>
      {BottomBarM}
    </div>
  );
}
