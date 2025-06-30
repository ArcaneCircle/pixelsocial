const maxHeight = "40vh";
const imgStyle = {
  maxHeight,
  width: "100%",
  objectFit: "contain",
  backdropFilter: "blur(8px)",
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
