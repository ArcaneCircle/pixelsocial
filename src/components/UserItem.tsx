import PixelarticonsShield from "~icons/pixelarticons/shield";

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
const nameStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  textWrap: "nowrap" as "nowrap",
  whiteSpace: "nowrap",
};
const subtitleStyle = {
  color: "#848484",
  textWrap: "nowrap" as "nowrap",
  fontSize: "0.8em",
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
      {isAdmin ? (
        <div style={{ backgroundColor: "#e1b302" }}>
          <PixelarticonsShield
            style={{ width: "40px", height: "40px", verticalAlign: "middle" }}
          />
        </div>
      ) : (
        <MonsterAvatar
          value={userId}
          width={40}
          height={40}
          style={{ background: "black" }}
        />
      )}
      <div style={rightStyle}>
        <span style={nameStyle}>{name}</span>
        {subtitle && <span style={subtitleStyle}>{subtitle}</span>}
      </div>
    </div>
  );
}
