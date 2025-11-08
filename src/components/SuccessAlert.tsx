import { SUCCESS_COLOR, SUCCESS_BG_COLOR } from "~/constants";

const alertStyle = {
  color: SUCCESS_COLOR,
  background: SUCCESS_BG_COLOR,
  border: "1px solid " + SUCCESS_COLOR,
  padding: "0.5em",
};

interface Props {
  children: React.ReactNode;
  [key: string]: any;
}

export default function SuccessAlert({ children, ...props }: Props) {
  props.style = { ...alertStyle, ...(props.style || {}) };
  return <div {...props}>{children}</div>;
}
