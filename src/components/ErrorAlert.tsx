import { LIKE_COLOR } from "~/constants";

const alertStyle = {
  color: LIKE_COLOR,
  background: LIKE_COLOR + "40",
  border: "1px solid " + LIKE_COLOR,
  padding: "0.5em",
};

interface Props {
  children: React.ReactNode;
  [key: string]: any;
}

export default function ErrorAlert({ children, ...props }: Props) {
  props.style = { ...alertStyle, ...(props.style || {}) };
  return <div {...props}>{children}</div>;
}
