import styles from "./PostImage.module.css";

const maxHeight = "40vh";
const imgStyle = {
  maxHeight,
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
      <img className={styles.img} style={imgStyle} src={src} />
    </div>
  );
}
