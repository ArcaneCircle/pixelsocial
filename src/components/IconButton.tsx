const btnStyle = {
  display: "flex",
  flexDirection: "row" as "row",
  flexWrap: "nowrap" as "nowrap",
  gap: "0.2em",
  alignItems: "center",
};

interface Props {
  children: React.ReactNode;
  [key: string]: any;
}

export default function IconButton({ children, ...props }: Props) {
  props.style = { ...btnStyle, ...(props.style || {}) };
  return (
    <div className="btn noselect" {...props}>
      {children}
    </div>
  );
}
