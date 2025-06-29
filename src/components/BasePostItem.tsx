import { useCallback, useState, useMemo } from "react";

import PixelarticonsMoreHorizontal from "~icons/pixelarticons/more-horizontal";
import PixelarticonsTrash from "~icons/pixelarticons/trash";

import { formatDateShort } from "~/lib/util";

import UserItem from "~/components/UserItem";
import IconButton from "~/components/IconButton";
import { Modal, ModalContext } from "~/components/modals/Modal";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  flexWrap: "nowrap" as "nowrap",
  gap: "0.5em",
  borderBottom: "1px solid #313144",
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

  const onMenu = useCallback(() => {
    setOpen((isOpen) => !isOpen);
  }, []);

  let modal: any = null;
  if (isOpen) {
    modal = useMemo(() => {
      return (
        <ModalContext.Provider value={{ isOpen, setOpen }}>
          <Modal style={{ padding: "0.5em 1em" }}>
            <IconButton onClick={deletePost}>
              <PixelarticonsTrash />
              Delete
            </IconButton>
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
