import { useRef, useState, useCallback, useEffect, useContext } from "react";
import PixelarticonsImageMultiple from "~icons/pixelarticons/image-multiple";

import { loadImage } from "~/lib/util.js";
// @ts-ignore
import { Pixelit } from "~/lib/pixelit.js";
import { ManagerContext, PageContext } from "~/contexts.ts";

import PrimaryButton from "~/components/PrimaryButton";
import FilePicker from "~/components/FilePicker";
import StylesReel from "~/components/StylesReel";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  flexWrap: "nowrap" as "nowrap",
  gap: "12px",
  padding: "12px",
  backgroundColor: "#292938",
};
const textareaStyle = {
  color: "#ddd9e8",
  backgroundColor: "#292938",
  border: 0,
  outline: 0,
  margin: 0,
  padding: 0,
  width: "100%",
  minHeight: "100px",
  resize: "none" as "none",
  overflow: "hidden",
};
const cardStyle = {
  border: 0,
  outline: 0,
  margin: 0,
  width: "100%",
  resize: "none" as "none",
  overflow: "hidden",
  padding: "12px",
  marginLeft: "-12px",
  marginTop: "-12px",
  textAlign: "center" as "center",
  fontSize: "1.4em",
};
const btnStyle = {
  flex: "1 1 auto",
  marginTop: "0.5em",
};

const iconBtnStyle = {
  background: "none",
  color: "white",
  alignSelf: "start",
  padding: "2px",
};

const imgStyle = {
  display: "block",
  maxHeight: "40vh",
  width: "fit-content",
  maxWidth: "100%",
  alignSelf: "center",
};

export default function Draft() {
  const manager = useContext(ManagerContext);
  const { setPage } = useContext(PageContext);

  const [styleId, setStyleId] = useState<number>(0);
  const [imgUrl, setImgUrl] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.addEventListener("input", () => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    });
  });

  const onClick = useCallback(() => {
    const text = textareaRef.current?.value || "";
    if (!text && !imgUrl) return;
    manager.sendPost(text, imgUrl, styleId);
    setPage({ key: "home" });
  }, [styleId, imgUrl, textareaRef, manager, setPage]);

  const onFileSelected = useCallback(
    async (file: File) => {
      const blobUrl = URL.createObjectURL(file);
      setImgUrl(await pixelate(blobUrl));
      setStyleId(0);
      URL.revokeObjectURL(blobUrl);
    },
    [setImgUrl],
  );

  const onStyleSelected = useCallback(
    (styleId: number) => {
      setStyleId(styleId);
      setImgUrl("");
    },
    [setStyleId, setImgUrl],
  );

  const hint = "What's on your mind?";

  return (
    <div style={containerStyle}>
      <textarea
        className={styleId > 0 ? `grad grad${styleId}` : undefined}
        ref={textareaRef}
        style={styleId > 0 ? cardStyle : textareaStyle}
        placeholder={hint}
      ></textarea>
      {imgUrl && <img src={imgUrl} style={imgStyle} />}
      <StylesReel onStyleSelected={onStyleSelected} selected={styleId}>
        <FilePicker
          accept="image/*"
          onFileSelected={onFileSelected}
          style={iconBtnStyle}
        >
          <PixelarticonsImageMultiple
            style={{ verticalAlign: "middle", width: "1.2em", height: "auto" }}
          />
        </FilePicker>
      </StylesReel>
      <PrimaryButton style={btnStyle} onClick={onClick}>
        Post
      </PrimaryButton>
    </div>
  );
}

async function pixelate(url: string): Promise<string> {
  const img = await loadImage(url);
  const maxWidth = 500;
  const maxHeight = 500;
  const canvas = document.createElement("canvas");

  const config = {
    to: canvas,
    from: img,
    scale: 18, // int from 0-50
    maxHeight,
    maxWidth,
  };

  if (img.width > maxWidth || img.height > maxHeight) {
    // just resize
    new Pixelit(config).draw();
    config.from = await loadImage(canvas.toDataURL("image/png"));
  }

  if (localStorage.noPixelate) {
    new Pixelit(config).draw();
  } else {
    new Pixelit(config).draw().pixelate();
  }

  url = canvas.toDataURL("image/png");
  canvas.remove();
  return url;
}
