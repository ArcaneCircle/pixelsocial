import { BORDER_COLOR, BG_COLOR } from "~/constants";

const barStyle = {
  display: "flex",
  flexDirection: "row" as "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid " + BORDER_COLOR,
  position: "sticky" as "sticky",
  top: 0,
  backgroundColor: BG_COLOR,
  zIndex: 99,
};

interface Props {
  children: React.ReactNode;
}

export default function TopBar({ children }: Props) {
  return <div style={barStyle}>{children}</div>;
}
