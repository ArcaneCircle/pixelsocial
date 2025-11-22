import { useEffect, useRef, useState, useCallback } from "react";

import PixelarticonsClose from "~icons/pixelarticons/close";
import PixelarticonsZoomIn from "~icons/pixelarticons/zoom-in";
import PixelarticonsZoomOut from "~icons/pixelarticons/zoom-out";
import PixelarticonsReload from "~icons/pixelarticons/reload";

import { BG_COLOR, BORDER_COLOR } from "~/constants";

import styles from "./ImageViewer.module.css";

const modalStyle = {
  backgroundColor: BG_COLOR,
  color: "inherit",
  border: "1px solid " + BORDER_COLOR,
  outline: 0,
  padding: 0,
  maxWidth: "100vw",
  maxHeight: "100vh",
};

const ZOOM_STEP = 0.25;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;

interface Props {
  src: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageViewer({ src, isOpen, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const dialog = dialogRef.current;
    const content = contentRef.current;
    if (!dialog || !content) return;

    if (isOpen) {
      dialog.showModal();
      setZoom(1);
      setPosition({ x: 0, y: 0 });

      const handleClickOutside = () => onClose();
      const handleClickInside = (event: MouseEvent) => event.stopPropagation();
      dialog.addEventListener("click", handleClickOutside);
      content.addEventListener("click", handleClickInside);
      return () => {
        dialog.removeEventListener("click", handleClickOutside);
        content.removeEventListener("click", handleClickInside);
      };
    } else {
      dialog.close();
    }
  }, [isOpen, onClose]);

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => {
      const newZoom = Math.max(z - ZOOM_STEP, MIN_ZOOM);
      if (newZoom <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom > 1) {
        setIsPanning(true);
        setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
      }
    },
    [zoom, position],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning && zoom > 1) {
        setPosition({
          x: e.clientX - startPos.x,
          y: e.clientY - startPos.y,
        });
      }
    },
    [isPanning, startPos, zoom],
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (zoom > 1 && e.touches.length === 1) {
        e.preventDefault();
        setIsPanning(true);
        const touch = e.touches[0];
        setStartPos({
          x: touch.clientX - position.x,
          y: touch.clientY - position.y,
        });
      }
    },
    [zoom, position],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isPanning && zoom > 1 && e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        setPosition({
          x: touch.clientX - startPos.x,
          y: touch.clientY - startPos.y,
        });
      }
    },
    [isPanning, startPos, zoom],
  );

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => {
      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
      const newZoom = Math.min(Math.max(z + delta, MIN_ZOOM), MAX_ZOOM);
      if (newZoom <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  }, []);

  const imageStyle = {
    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
    cursor: zoom > 1 ? (isPanning ? "grabbing" : "grab") : "default",
  };

  return (
    <dialog ref={dialogRef} className={styles.modal} style={modalStyle}>
      <div ref={contentRef} className={styles.container}>
        <div className={styles.controls}>
          <button className={styles.controlBtn} onClick={handleZoomOut} aria-label="Zoom out">
            <PixelarticonsZoomOut />
          </button>
          <button className={styles.controlBtn} onClick={handleReset} aria-label="Reset zoom">
            <PixelarticonsReload />
          </button>
          <button className={styles.controlBtn} onClick={handleZoomIn} aria-label="Zoom in">
            <PixelarticonsZoomIn />
          </button>
          <button className={styles.controlBtn} onClick={onClose} aria-label="Close image viewer">
            <PixelarticonsClose />
          </button>
        </div>
        <div
          className={styles.imageContainer}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          <img
            src={src}
            alt="Enlarged view"
            className={styles.image}
            style={imageStyle}
            draggable={false}
          />
        </div>
      </div>
    </dialog>
  );
}
