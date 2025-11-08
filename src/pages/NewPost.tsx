import { useMemo, useContext, useState, useCallback, useRef } from "react";
import PixelarticonsClose from "~icons/pixelarticons/close";
import PixelarticonsEdit from "~icons/pixelarticons/edit";

import { _ } from "~/lib/i18n";
import { ManagerContext, PageContext } from "~/contexts";

import TitleBar from "~/components/TitleBar";
import UserItem from "~/components/UserItem";
import Draft from "~/components/Draft";
import SecondaryButton from "~/components/SecondaryButton";
import IconButton from "~/components/IconButton";
import { Modal, ModalContext } from "~/components/modals/Modal";
import PrimaryButton from "~/components/PrimaryButton";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  flexWrap: "nowrap" as "nowrap",
  gap: "0.5em",
  padding: "0.8em",
};

const userContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5em",
};

const inputStyle = {
  flex: 1,
  padding: "0.5em",
  fontSize: "1em",
  border: "1px solid #313144",
  borderRadius: "2px",
  backgroundColor: "#292938",
  color: "#ddd9e8",
};

export default function NewPost() {
  const manager = useContext(ManagerContext);
  const { setPage } = useContext(PageContext);
  const [isEditNameOpen, setEditNameOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(manager.selfName);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const titleBarM = useMemo(() => {
    const onClick = () => setPage({ key: "home", showComments: false });
    return (
      <TitleBar>
        <SecondaryButton onClick={onClick} style={{ padding: "5px 10px" }}>
          <PixelarticonsClose style={{ verticalAlign: "middle" }} />
        </SecondaryButton>
      </TitleBar>
    );
  }, [setPage]);

  const onEditName = useCallback(() => {
    setNewName(manager.selfName);
    setEditNameOpen(true);
  }, [manager.selfName]);

  const onSaveName = useCallback(() => {
    const name = newName.trim();
    if (name) {
      manager.setSelfName(name);
      setEditNameOpen(false);
    }
  }, [newName, manager]);

  const userM = useMemo(() => {
    return (
      <div style={userContainerStyle}>
        <UserItem
          isAdmin={manager.isAdmin}
          userId={manager.selfId}
          name={manager.selfName}
          style={{ flex: 1 }}
        />
        <IconButton onClick={onEditName}>
          <PixelarticonsEdit style={{ width: "1.2em", height: "auto" }} />
        </IconButton>
      </div>
    );
  }, [manager, onEditName]);

  const editNameModal = isEditNameOpen ? (
    <ModalContext.Provider
      value={{ isOpen: isEditNameOpen, setOpen: setEditNameOpen }}
    >
      <Modal
        style={{
          padding: "1em",
          display: "flex",
          flexDirection: "column",
          gap: "1em",
        }}
      >
        <h3 style={{ margin: 0 }}>{_("Edit Name")}</h3>
        <input
          ref={nameInputRef}
          type="text"
          value={newName}
          onChange={(e) => setNewName((e.target as HTMLInputElement).value)}
          style={inputStyle}
          placeholder={_("Enter your name")}
          maxLength={50}
        />
        <PrimaryButton onClick={onSaveName}>{_("Save")}</PrimaryButton>
      </Modal>
    </ModalContext.Provider>
  ) : null;

  const draftM = useMemo(() => <Draft />, []);

  return (
    <div>
      {editNameModal}
      {titleBarM}
      <div style={containerStyle}>
        {userM}
        {draftM}
      </div>
    </div>
  );
}
