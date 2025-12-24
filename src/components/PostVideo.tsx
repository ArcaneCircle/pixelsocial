const maxHeight = "40vh";
const videoStyle = {
  maxHeight,
  width: "100%",
  objectFit: "contain" as "contain",
};

interface Props {
  src: string;
  [key: string]: any;
}

export default function PostVideo({ src, ...props }: Props) {
  props.style = { maxHeight, ...(props.style || {}) };
  return (
    <div {...props}>
      <video
        style={videoStyle}
        src={src}
        controls
        playsInline
        aria-label="video"
      />
    </div>
  );
}
