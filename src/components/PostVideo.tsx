import styles from "./PostImage.module.css";

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
  const wrapperStyle = {
    maxHeight,
  };
  props.style = { ...wrapperStyle, ...(props.style || {}) };
  return (
    <div {...props}>
      <video className={styles.img} style={videoStyle} src={src} controls />
    </div>
  );
}
