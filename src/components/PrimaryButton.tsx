import Button from "~/components/Button";

const btnStyle = {
  backgroundColor: "#d5b022",
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
