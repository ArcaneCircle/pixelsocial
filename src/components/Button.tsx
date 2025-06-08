const btnStyle = {
  border: 0,
  outline: 0,
  padding: "5px 12px",
};

interface Props {
  children: React.ReactNode;
  [key: string]: any;
}

export default function Button({ children, ...props }: Props) {
  props.style = { ...btnStyle, ...(props.style || {}) };
  return <button {...props}>{children}</button>;
}
