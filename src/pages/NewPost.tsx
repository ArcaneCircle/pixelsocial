import { useMemo, useContext } from "react";
import PixelarticonsClose from '~icons/pixelarticons/close';

import { _ } from "~/lib/i18n";
import { ManagerContext, PageContext } from "~/contexts";

import TitleBar from "~/components/TitleBar";
import UserItem from "~/components/UserItem";
import Draft from "~/components/Draft";
import SecondaryButton from "~/components/SecondaryButton";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  flexWrap: "nowrap" as "nowrap",
  gap: "0.5em",
  padding: "0.8em",
};

export default function NewPost() {
  const manager = useContext(ManagerContext);
  const { setPage } = useContext(PageContext);
  const titleBarM = useMemo(() => {
    const onClick = () => setPage({ key: "home" });
    return (
      <TitleBar>
        <SecondaryButton onClick={onClick} style={{padding: "5px 10px"}}><PixelarticonsClose style={{verticalAlign: "middle"}} /></SecondaryButton>
      </TitleBar>
    );
  }, [setPage]);

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

  return (
    <div>
      {titleBarM}
      <div style={containerStyle}>
        {userM}
        {draftM}
      </div>
    </div>
  );
}
