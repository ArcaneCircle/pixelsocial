import { useState, useCallback, useEffect } from "react";
import PixelarticonsPlus from "~icons/pixelarticons/plus";
import PixelarticonsMinus from "~icons/pixelarticons/minus";

import styles from "./PostImage.module.css";
import IconButton from "~/components/IconButton";

const MAX_HEIGHT = "40vh";
const ZOOM_STEP = 0.25;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

const imgStyle = { maxHeight: MAX_HEIGHT };

interface Props {
  src: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function PostImage({ src, style, className }: Props) {
  const [isFullSize, setIsFullSize] = useState(false);
  const [scale, setScale] = useState(1);

  const openFullSize = useCallback(() => {
    setIsFullSize(true);
    setScale(1);
  }, []);

  const closeFullSize = useCallback(() => {
    setIsFullSize(false);
    setScale(1);
  }, []);

  useEffect(() => {
    if (!isFullSize) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          closeFullSize();
          break;
        case "+":
        case "=":
          setScale((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
          break;
        case "-":
        case "_":
          setScale((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
          break;
        case "0":
          setScale(1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullSize, closeFullSize]);

  useEffect(() => {
    if (isFullSize) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isFullSize]);

  const zoomIn = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const zoomOut = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  const resetZoom = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(1);
  }, []);

  // Wrapper has blurred background image for letterbox effect
  const wrapperStyle: React.CSSProperties = {
    backgroundImage: `url('${src}')`,
    backgroundPosition: "center",
    maxHeight: MAX_HEIGHT,
    cursor: "pointer",
    ...style,
  };

  return (
    <>
      <div className={className} onClick={openFullSize} style={wrapperStyle}>
        <img className={styles.img} style={imgStyle} src={src} alt="" />
      </div>

      {isFullSize && (
        <div className={styles.fullSizeOverlay} onClick={closeFullSize}>
          <div className={styles.zoomControls} onClick={(e) => e.stopPropagation()}>
            <IconButton onClick={zoomOut} disabled={scale <= MIN_ZOOM} title="Zoom out (-)">
              <PixelarticonsMinus style={{ verticalAlign: "middle" }} />
            </IconButton>
            <span 
              className={styles.zoomLevel} 
              onClick={resetZoom}
              title="Click to reset zoom (0)"
              style={{ cursor: "pointer" }}
            >
              {Math.round(scale * 100)}%
            </span>
            <IconButton onClick={zoomIn} disabled={scale >= MAX_ZOOM} title="Zoom in (+)">
              <PixelarticonsPlus style={{ verticalAlign: "middle" }} />
            </IconButton>
          </div>
          <div className={styles.imageContainer}>
            <img
              className={styles.fullSizeImg}
              src={src}
              alt=""
              style={{ transform: `scale(${scale})` }}
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
}
