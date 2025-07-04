import { useRef, useCallback, useContext } from "react";

import { ManagerContext } from "~/contexts";

import PrimaryButton from "~/components/PrimaryButton";

const containerStyle = {
  display: "flex",
  flexDirection: "row" as "row",
  justifyContent: "space-between",
  flexWrap: "nowrap" as "nowrap",
  gap: "12px",
  padding: "12px",
  backgroundColor: "#292938",
  position: "fixed" as "fixed",
  bottom: 0,
  width: "calc(100% - 24px)",
};

const inputStyle = {
  color: "#ddd9e8",
  backgroundColor: "#292938",
  border: 0,
  outline: 0,
  margin: 0,
  padding: 0,
  flexGrow: 1,
};

interface Props {
  postId: string;
}

export default function ReplyDraft({ postId }: Props) {
  const manager = useContext(ManagerContext);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onClick = useCallback(() => {
    if (!inputRef.current) return;
    const text = inputRef.current.value || "";
    if (!text) return;
    manager.reply(postId, text);
    inputRef.current.value = "";
  }, [postId, inputRef, manager]);

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      // Prevent the input from losing focus
      event.preventDefault();
      inputRef.current!.focus();
    },
    [inputRef],
  );

  const hint = "Write a reply...";

  return (
    <div style={containerStyle}>
      <input
        ref={inputRef}
        style={inputStyle}
        placeholder={hint}
        type="text"
        onBlur={handleBlur}
      />
      <PrimaryButton onClick={onClick}>Send</PrimaryButton>
    </div>
  );
}
