const maxHeight = "40vh";
const imgStyle = {
  maxHeight,
  width: "100%",
  objectFit: "contain" as "contain",
  backdropFilter: "blur(8px)",
  verticalAlign: "middle",
};

interface Props {
  src: string;
  [key: string]: any;
}

export default function PostImage({ src, ...props }: Props) {
  const wrapperStyle = {
    backgroundImage: `url('${src}')`,
    backgroundPosition: "center",
    maxHeight,
  };
  props.style = { ...wrapperStyle, ...(props.style || {}) };
  return (
    <div {...props}>
      <img style={imgStyle} src={src} />
    </div>
  );
}
