import { ACCENT_COLOR } from "~/constants";

import Button from "~/components/Button";

const btnStyle = {
  background: "none",
  border: "1px solid " + ACCENT_COLOR,
  color: ACCENT_COLOR,
};

interface Props {
  children: React.ReactNode;
  [key: string]: any;
}

export default function SecondaryButton({ children, ...props }: Props) {
  props.style = { ...btnStyle, ...(props.style || {}) };
  return <Button {...props}>{children}</Button>;
}
