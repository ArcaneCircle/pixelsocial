import MonsterAvatar from "~/components/MonsterAvatar";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
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
  color: "rgb(132, 132, 132)",
  textWrap: "nowrap" as "nowrap",
  fontSize: "0.8em",
};

interface Props {
  name: string;
  userId: string;
  subtitle?: string;
  [key: string]: any;
}

export default function UserItem({ name, userId, subtitle, ...props }: Props) {
  return (
    <div style={containerStyle} {...props}>
      <MonsterAvatar
        value={userId}
        width={40}
        height={40}
        style={{ background: "black" }}
      />
      <div style={rightStyle}>
        <span style={nameStyle}>{name}</span>
        {subtitle && <span style={subtitleStyle}>{subtitle}</span>}
      </div>
    </div>
  );
}
