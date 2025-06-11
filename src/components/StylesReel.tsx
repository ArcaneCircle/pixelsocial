import { useMemo } from "react";

import PixelarticonsCheckbox from "~icons/pixelarticons/checkbox";

import "./StylesReel.css";

const reelStyle = {
  display: "flex",
  flexDirection: "row" as "row",
  alignItems: "flex-start",
  flexWrap: "nowrap" as "nowrap",
  gap: "15px",
  justifyContent: "left",
  overflowX: "scroll" as "scroll",
  paddingBottom: "1em",
  marginTop: "0.5em",
};

interface Props {
  selected: number;
  onStyleSelected: (style: number) => void;
  children: React.ReactNode;
}

export default function StylesReel({
  selected,
  onStyleSelected,
  children,
}: Props) {
  const items = useMemo(() => {
    const items = [];
    for (let i = 1; i <= 100; i++) {
      const onClick = () => {
        onStyleSelected(i);
      };
      const gradClass =
        `thumbnail grad${i}` + (selected === i ? " selected" : "");
      items.push(
        <div className={gradClass} onClick={onClick}>
          {selected === i && <PixelarticonsCheckbox className="check" />}
        </div>,
      );
    }
    return items;
  }, [selected, onStyleSelected]);

  return (
    <div style={reelStyle}>
      {children}
      {items}
    </div>
  );
}
