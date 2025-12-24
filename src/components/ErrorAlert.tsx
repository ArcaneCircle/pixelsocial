import { ERROR_COLOR, ERROR_BG_COLOR } from "~/constants";

const alertStyle = {
  color: ERROR_COLOR,
  background: ERROR_BG_COLOR,
  border: "1px solid " + ERROR_COLOR,
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
