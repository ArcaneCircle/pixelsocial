import { MAIN_COLOR, MAIN_FG_COLOR } from "~/constants";

import Button from "~/components/Button";

const btnStyle = {
  backgroundColor: MAIN_COLOR,
  color: MAIN_FG_COLOR,
};

interface Props {
  children: React.ReactNode;
  [key: string]: any;
}

export default function PrimaryButton({ children, ...props }: Props) {
  props.style = { ...btnStyle, ...(props.style || {}) };
  return <Button {...props}>{children}</Button>;
}
