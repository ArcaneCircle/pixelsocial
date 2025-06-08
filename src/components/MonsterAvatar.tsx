// @ts-ignore
import { getAvatar } from "~/lib/monsterid/monsterid";

interface Props {
  value: string;
  width: number;
  height: number;
  [key: string]: any;
}

export default function MonsterAvatar({
  value,
  width,
  height,
  ...props
}: Props) {
  const src = getAvatar(value, width, height);
  return <img src={src} {...props} />;
}
