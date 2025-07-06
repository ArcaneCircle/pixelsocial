import { useEffect, useRef, createContext, useContext } from "react";

import { BORDER_COLOR, BG_COLOR } from "~/constants";

import styles from "./Modal.module.css";

export const ModalContext = createContext<{
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}>(
  // @ts-ignore
  null,
);

const modalStyle = {
  backgroundColor: BG_COLOR,
  color: "inherit",
  border: "1px solid " + BORDER_COLOR,
  outline: 0,
  padding: 0,
};

type Props = {
  children: React.ReactNode;
  [key: string]: any;
};

export function Modal({ children, ...props }: Props) {
  const { isOpen, setOpen } = useContext(ModalContext);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const content = contentRef.current;
    if (!dialog || !content) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }

    dialog.addEventListener("click", () => setOpen(false));
    content.addEventListener("click", (event) => event.stopPropagation());
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} className={styles.modal} style={modalStyle}>
      <div ref={contentRef} {...props}>
        {children}
      </div>
    </dialog>
  );
}
