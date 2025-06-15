import Button from "~/components/Button";

const btnStyle = {
  backgroundColor: "rgb(213, 176, 34)",
  color: "black",
};

interface Props {
  children: React.ReactNode;
  [key: string]: any;
}

export default function PrimaryButton({ children, ...props }: Props) {
  props.style = { ...btnStyle, ...(props.style || {}) };
  return <Button {...props}>{children}</Button>;
}
