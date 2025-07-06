import { useRef, useCallback, useContext } from "react";
import PixelarticonsArrowRight from "~icons/pixelarticons/arrow-right";

import { INPUT_BG_COLOR, INPUT_FG_COLOR } from "~/constants";
import { _ } from "~/lib/i18n";
import { ManagerContext } from "~/contexts";

import PrimaryButton from "~/components/PrimaryButton";

const containerStyle = {
  display: "flex",
  flexDirection: "row" as "row",
  justifyContent: "space-between",
  flexWrap: "nowrap" as "nowrap",
  gap: "12px",
  padding: "12px",
  backgroundColor: INPUT_BG_COLOR,
  position: "fixed" as "fixed",
  bottom: 0,
  width: "calc(100% - 24px)",
};

const inputStyle = {
  color: INPUT_FG_COLOR,
  backgroundColor: INPUT_BG_COLOR,
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
    const text = (inputRef.current.value || "").trim();
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

  const hint = _("Write a comment...");

  return (
    <div style={containerStyle}>
      <input
        ref={inputRef}
        style={inputStyle}
        placeholder={hint}
        type="text"
        onBlur={handleBlur}
      />
      <PrimaryButton onClick={onClick} style={{ padding: "5px 10px" }}>
        <PixelarticonsArrowRight style={{ height: "100%" }} />
      </PrimaryButton>
    </div>
  );
}
