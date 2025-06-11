import { useRef, useState, useCallback, useEffect } from "react";
import PixelarticonsImageMultiple from "~icons/pixelarticons/image-multiple";

import { loadImage } from "~/lib/util.js";
// @ts-ignore
import { Pixelit } from "~/lib/pixelit.js";

import Button from "~/components/Button";
import FilePicker from "~/components/FilePicker";
import StylesReel from "~/components/StylesReel";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  flexWrap: "nowrap" as "nowrap",
  gap: "12px",
  padding: "12px",
  backgroundColor: "hsl(240,16%,19%)",
};
const textareaStyle = {
  color: "#ddd9e8",
  backgroundColor: "hsl(240,16%,19%)",
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
  backgroundColor: "rgb(213, 176, 34)",
  color: "black",
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

interface Props {
  onPost: (text: string, image: string, styleId: number) => void;
}

export default function Draft({ onPost }: Props) {
  const [styleId, setStyleId] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [imgUrl, setImgUrl] = useState<string>("");

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.addEventListener("input", () => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    });
  });

  const onClick = useCallback(() => {
    onPost(textareaRef.current?.value || "", imgUrl, styleId);
  }, [styleId, imgUrl, textareaRef, onPost]);

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
      <Button style={btnStyle} onClick={onClick}>
        Post
      </Button>
    </div>
  );
}

async function pixelate(url: string): Promise<string> {
  const img = await loadImage(url);
  const canvas = document.createElement("canvas");
  const maxWidth = 500;
  const maxHeight = 500;

  new Pixelit({
    to: canvas,
    from: img,
    scale: 12, // int from 0-50
    maxHeight,
    maxWidth,
  })
    .draw()
    .pixelate();

  return canvas.toDataURL("image/png");
}
