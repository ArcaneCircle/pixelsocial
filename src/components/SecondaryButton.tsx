import Button from "~/components/Button";

const btnStyle = {
  background: "none",
  border: "1px solid #ccae3a",
  color: "#ccae3a",
};

interface Props {
  children: React.ReactNode;
  [key: string]: any;
}

export default function SecondaryButton({ children, ...props }: Props) {
  props.style = { ...btnStyle, ...(props.style || {}) };
  return <Button {...props}>{children}</Button>;
}
