import { useCallback, useState, useMemo, useContext } from "react";

import PixelarticonsMoreHorizontal from "~icons/pixelarticons/more-horizontal";
import PixelarticonsTrash from "~icons/pixelarticons/trash";

import { _ } from "~/lib/i18n";
import { formatDateShort } from "~/lib/util";
import { ManagerContext } from "~/contexts";
import { BORDER_COLOR } from "~/constants";

import UserItem from "~/components/UserItem";
import IconButton from "~/components/IconButton";
import { Modal, ModalContext } from "~/components/modals/Modal";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  flexWrap: "nowrap" as "nowrap",
  gap: "0.5em",
  borderBottom: "1px solid " + BORDER_COLOR,
  padding: "0.5em 0",
  overflow: "hidden",
};
const topStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "0.5em",
};
const contentStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  gap: "0.3em",
  overflowWrap: "break-word" as "break-word",
  wordBreak: "break-word" as "break-word",
  whiteSpace: "pre-wrap",
};
const menuIconStyle = { width: "1.2em", height: "auto" };

interface Props {
  children: React.ReactNode;
  authorId: string;
  authorName: string;
  isAdmin: boolean;
  date: number;
  deletePost: () => void;
  [key: string]: any;
}

export default function BasePostItem({
  authorName,
  authorId,
  isAdmin,
  date,
  deletePost,
  children,
  ...props
}: Props) {
  props.style = { ...containerStyle, ...(props.style || {}) };
  const [isOpen, setOpen] = useState<boolean>(false);
  const manager = useContext(ManagerContext);

  const onMenu = useCallback(() => {
    setOpen((isOpen) => !isOpen);
  }, []);

  const deleteAll = useCallback(() => {
    manager.deleteAll(authorId);
  }, [authorId]);

  let modal: any = null;
  if (isOpen) {
    modal = useMemo(() => {
      return (
        <ModalContext.Provider value={{ isOpen, setOpen }}>
          <Modal style={{ padding: "0.5em 1em" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <IconButton
                onClick={deletePost}
                style={{
                  padding: "0.5em 0",
                  borderBottom: "1px solid " + BORDER_COLOR,
                }}
              >
                <PixelarticonsTrash />
                {_("Delete")}
              </IconButton>
              <IconButton onClick={deleteAll} style={{ padding: "0.5em 0" }}>
                <PixelarticonsTrash />
                {_("Delete all from user")}
              </IconButton>
            </div>
          </Modal>
        </ModalContext.Provider>
      );
    }, [deletePost]);
  }

  return (
    <div {...props}>
      {modal}
      <div className="hpad08" style={topStyle}>
        <UserItem
          isAdmin={isAdmin}
          userId={authorId}
          name={authorName}
          subtitle={formatDateShort(date)}
        />
        <IconButton onClick={onMenu}>
          <PixelarticonsMoreHorizontal style={menuIconStyle} />
        </IconButton>
      </div>
      <div style={contentStyle}>{children}</div>
    </div>
  );
}
