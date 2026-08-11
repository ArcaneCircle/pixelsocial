import { useState, useCallback } from "react";

import styles from "./PostImage.module.css";
import ImageViewer from "./modals/ImageViewer";

const maxHeight = "40vh";
const imgStyle = { maxHeight, cursor: "pointer" };

interface Props {
  src: string;
  [key: string]: any;
}

export default function PostImage({ src, ...props }: Props) {
  const [isViewerOpen, setViewerOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [resizeWidth, setResizeWidth] = useState(0);
  const [resizeHeight, setResizeHeight] = useState(0);

  const openViewer = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setViewerOpen(true);
    const img = new Image();
    img.onload = () => {
      setWidth(img.width);
      setHeight(img.height);
      setResizeWidth(img.width);
      setResizeHeight(img.height);
    };
    img.src = src;
  }, [src]);

  const closeViewer = useCallback(() => {
    setViewerOpen(false);
  }, []);

  const wrapperStyle = {
    backgroundImage: `url('${src}')`,
    backgroundPosition: "center",
    maxHeight,
  };
  props.style = { ...wrapperStyle, ...(props.style || {}) };
  return (
    <>
      <div {...props} onClick={openViewer}>
        <img className={styles.img} style={imgStyle} src={src} />
      </div>
      <ImageViewer src={src} isOpen={isViewerOpen} onClose={closeViewer} width={resizeWidth} height={resizeHeight} />
    </>
  );
}
