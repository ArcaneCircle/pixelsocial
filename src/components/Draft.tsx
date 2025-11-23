import { useRef, useState, useCallback, useEffect, useContext } from "react";
import PixelarticonsImageMultiple from "~icons/pixelarticons/image-multiple";

import {
  MAX_CARD_SIZE,
  MAX_CARD_LINES,
  INPUT_BG_COLOR,
  INPUT_FG_COLOR,
} from "~/constants";
import { _ } from "~/lib/i18n";
import { loadImage, readAsDataURL } from "~/lib/util";
// @ts-ignore
import { Pixelit } from "~/lib/pixelit.js";
import { ManagerContext, PageContext } from "~/contexts";

import PrimaryButton from "~/components/PrimaryButton";
import FilePicker from "~/components/FilePicker";
import StylesReel from "~/components/StylesReel";
import PostImage from "~/components/PostImage";
import PostVideo from "~/components/PostVideo";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  flexWrap: "nowrap" as "nowrap",
  gap: "12px",
  padding: "12px", // warning: when changing update also below
  backgroundColor: INPUT_BG_COLOR,
};
const replyContainerStyle = {
  ...containerStyle,
  position: "fixed" as "fixed",
  bottom: 0,
  width: "calc(100% - 24px)",
  maxHeight: "80vh",
  overflowY: "auto" as "auto",
  paddingTop: "14px", // 12px + 2px
};

const textareaStyle = {
  color: INPUT_FG_COLOR,
  backgroundColor: INPUT_BG_COLOR,
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

interface Props {
  replyToPostId?: string;
  onReplySubmitted?: () => void;
}

export default function Draft({ replyToPostId, onReplySubmitted }: Props = {}) {
  const manager = useContext(ManagerContext);
  const { setPage } = useContext(PageContext);

  const [styleId, setStyleId] = useState<number>(0);
  const [styleDisabled, setStyleDisabled] = useState<boolean>(false);
  const [pixelated, setPixelated] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [mediaType, setMediaType] = useState<"image" | "video" | "">("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    textarea.addEventListener("input", () => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
      const text = textarea.value || "";
      setStyleDisabled(
        text.length > MAX_CARD_SIZE || text.split("\n").length > MAX_CARD_LINES,
      );
    });
  });

  const onClick = useCallback(() => {
    const text = (textareaRef.current?.value || "").trim();
    if (!text && !mediaType) return;
    if (replyToPostId) {
      manager.reply(
        replyToPostId,
        text,
        imgUrl,
        styleDisabled ? 0 : styleId,
        videoUrl,
      );
      if (onReplySubmitted) {
        onReplySubmitted();
      }
    } else {
      manager.sendPost(text, imgUrl, styleDisabled ? 0 : styleId, videoUrl);
      setPage({ key: "home", showComments: false });
    }
  }, [
    styleId,
    styleDisabled,
    imgUrl,
    videoUrl,
    mediaType,
    textareaRef,
    manager,
    setPage,
    replyToPostId,
    onReplySubmitted,
  ]);

  const onFileSelected = useCallback(
    async (file: File) => {
      // Handle video files
      if (file.type.startsWith("video/")) {
        if (file.size > manager.maxSize) {
          console.error("Video file too large:", file.size);
          alert(
            `Video file is too large. Maximum size is ${manager.maxSize / (1024 * 1024)}MB`,
          );
          return;
        }
        const url = await readAsDataURL(file);
        console.log("video size:" + url.length);
        setVideoUrl(url);
        setImgUrl("");
        setMediaType("video");
        setPixelated(false);
        setStyleId(0);
        return;
      }

      // Handle image files (existing logic)
      let url;
      if (
        file.type.startsWith("image/") &&
        file.type !== "image/png" &&
        file.type !== "image/jpeg" &&
        file.size <= manager.maxSize
      ) {
        url = await readAsDataURL(file);
        console.log("image size:" + url.length);
      } else if (file.type.startsWith("image/")) {
        const blobUrl = URL.createObjectURL(file);
        url = await resizeImage(blobUrl);
        URL.revokeObjectURL(blobUrl);
        console.log("resizeImage:" + url.length);
      } else {
        console.warn("Unsupported file type:", file.type);
        return;
      }
      setImgUrl(url);
      setVideoUrl("");
      setMediaType("image");
      setPixelated(false);
      setStyleId(0);
    },
    [setImgUrl, setVideoUrl, manager.maxSize],
  );

  const onPixelIt = useCallback(async () => {
    const url = await pixelate(imgUrl);
    console.log("pixelate:" + url.length);
    setImgUrl(url);
    setPixelated(true);
  }, [imgUrl]);

  const onStyleSelected = useCallback(
    (styleId: number) => {
      setStyleId(styleId);
      setImgUrl("");
      setVideoUrl("");
      setMediaType("");
    },
    [setStyleId, setImgUrl, setVideoUrl, setMediaType],
  );

  const hint = replyToPostId
    ? _("Write a comment...")
    : _("What's on your mind?");
  const buttonText = replyToPostId ? _("Reply") : _("Post");
  const styled = !styleDisabled && styleId > 0;

  return (
    <div style={replyToPostId ? replyContainerStyle : containerStyle}>
      <textarea
        className={styled ? `grad grad${styleId}` : undefined}
        ref={textareaRef}
        style={styled ? cardStyle : textareaStyle}
        placeholder={hint}
      ></textarea>
      {mediaType === "image" && imgUrl && <PostImage src={imgUrl} />}
      {mediaType === "video" && videoUrl && <PostVideo src={videoUrl} />}
      {mediaType === "image" && imgUrl && !pixelated && (
        <PrimaryButton
          style={{ marginTop: "-12px", flex: "1 1 auto" }}
          onClick={onPixelIt}
        >
          {_("Pixel It!")}
        </PrimaryButton>
      )}
      <StylesReel onStyleSelected={onStyleSelected} selected={styleId}>
        <FilePicker
          accept="image/*,video/*"
          onFileSelected={onFileSelected}
          style={iconBtnStyle}
        >
          <PixelarticonsImageMultiple
            style={{ verticalAlign: "middle", width: "1.2em", height: "auto" }}
          />
        </FilePicker>
      </StylesReel>
      <PrimaryButton style={btnStyle} onClick={onClick}>
        {buttonText}
      </PrimaryButton>
    </div>
  );
}

async function resizeImage(url: string): Promise<string> {
  const img = await loadImage(url);
  const canvas = document.createElement("canvas");

  const config = {
    to: canvas,
    from: img,
    maxHeight: 500,
    maxWidth: 500,
  };
  new Pixelit(config).draw(); // just resize

  url = canvas.toDataURL("image/jpeg");
  canvas.remove();
  return url;
}

async function pixelate(url: string): Promise<string> {
  const img = await loadImage(url);
  const canvas = document.createElement("canvas");

  const config = {
    to: canvas,
    from: img,
    scale: 12, // int from 0-50
    maxHeight: 500,
    maxWidth: 500,
  };
  new Pixelit(config).draw().pixelate();

  url = canvas.toDataURL("image/png");
  canvas.remove();
  return url;
}
