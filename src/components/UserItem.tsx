import { GRAY_COLOR, ACCENT_COLOR } from "~/constants";
import { _ } from "~/lib/i18n";

import MonsterAvatar from "~/components/MonsterAvatar";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  overflow: "hidden",
};
const rightStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  overflow: "hidden",
};
const flexRow = {
  display: "flex",
  flexDirection: "row" as "row",
  gap: "0.2em",
};
const nameStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  textWrap: "nowrap" as "nowrap",
  whiteSpace: "nowrap",
};
const subtitleStyle = {
  color: GRAY_COLOR,
  textWrap: "nowrap" as "nowrap",
  fontSize: "0.8em",
};

const badgeStyle = {
  border: "1px solid " + ACCENT_COLOR,
  color: ACCENT_COLOR,
  padding: "0 0.2em",
};

interface Props {
  name: string;
  userId: string;
  isAdmin: boolean;
  subtitle?: string;
  [key: string]: any;
}

export default function UserItem({
  name,
  userId,
  isAdmin,
  subtitle,
  ...props
}: Props) {
  return (
    <div style={containerStyle} {...props}>
      <MonsterAvatar
        value={userId}
        width={40}
        height={40}
        style={{ background: "black" }}
      />
      <div style={rightStyle}>
        <div style={flexRow}>
          <span style={nameStyle}>{name}</span>
          {isAdmin && <span style={badgeStyle}>{_("admin")}</span>}
        </div>
        {subtitle && <span style={subtitleStyle}>{subtitle}</span>}
      </div>
    </div>
  );
}
