import MonsterAvatar from "~/components/MonsterAvatar";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  overflow: "hidden",
};
const nameStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  textWrap: "nowrap" as "nowrap",
  whiteSpace: "nowrap",
};

interface Props {
  name: string;
  userId: string;
}

export default function UserItem({ name, userId }: Props) {
  return (
    <div style={containerStyle}>
      <MonsterAvatar
        value={userId}
        width={40}
        height={40}
        style={{ background: "black" }}
      />
      <span style={nameStyle}>{name}</span>
    </div>
  );
}
