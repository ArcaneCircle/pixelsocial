import { useRef, useCallback, useState, useMemo, useContext } from "react";
import { toJpeg } from "html-to-image";

import PixelarticonsMoreHorizontal from "~icons/pixelarticons/more-horizontal";
import PixelarticonsTrash from "~icons/pixelarticons/trash";

import { formatDateShort } from "~/lib/util";
import { ManagerContext } from "~/contexts.ts";

import UserItem from "~/components/UserItem";
import PostActionsBar from "~/components/PostActionsBar";
import IconButton from "~/components/IconButton";
import { Modal, ModalContext } from "~/components/modals/Modal";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  flexWrap: "nowrap" as "nowrap",
  gap: "0.5em",
  borderBottom: "1px solid hsl(240, 16%, 23%)",
  padding: "0.5em 0",
  overflow: "hidden",
};
const topStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "0.5em",
};
const contentStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  gap: "0.3em",
  overflowWrap: "break-word" as "break-word",
  wordBreak: "break-word" as "break-word",
  whiteSpace: "pre-wrap",
};
const imgStyle = {
  display: "block",
  maxHeight: "40vh",
  width: "fit-content",
  maxWidth: "100%",
  alignSelf: "center",
};
const menuIconStyle = { width: "1.2em", height: "auto" };

interface Props {
  post: Post;
}

export default function PostItem({ post }: Props) {
  const manager = useContext(ManagerContext);
  const [isOpen, setOpen] = useState<boolean>(false);
  const textRef = useRef<HTMLDivElement | null>(null);

  const onMenu = useCallback(() => {
    setOpen((isOpen) => !isOpen);
  }, []);

  const onShare = useCallback(async () => {
    let text = "";
    let file = undefined;
    if (post.style) {
      const imgUrl = await toJpeg(textRef.current!, { quality: 0.95 });
      const base64 = imgUrl.split(",")[1];
      // @ts-ignore
      file = { name: "image.jpeg", type: "image", base64 };
    } else {
      text = post.text;
      if (post.image) {
        const base64 = post.image.split(",")[1];
        file = { name: "image.png", type: "image", base64 };
      }
    }
    window.webxdc.sendToChat({ file, text });
  }, [post.text, post.image, post.style, textRef]);

  let modal: any = null;
  if (isOpen) {
    modal = useMemo(() => {
      const onClick = () => manager.deletePost(post.id);
      return (
        <ModalContext.Provider value={{ isOpen, setOpen }}>
          <Modal style={{ padding: "0.5em 1em" }}>
            <IconButton onClick={onClick}>
              <PixelarticonsTrash />
              Delete
            </IconButton>
          </Modal>
        </ModalContext.Provider>
      );
    }, [post.id]);
  }

  return (
    <div style={containerStyle}>
      {modal}
      <div className="hpad08" style={topStyle}>
        <UserItem
          userId={post.authorId}
          name={post.authorName}
          subtitle={formatDateShort(post.date)}
        />
        <IconButton onClick={onMenu}>
          <PixelarticonsMoreHorizontal style={menuIconStyle} />
        </IconButton>
      </div>
      <div style={contentStyle}>
        <div
          ref={textRef}
          className={post.style ? `card grad${post.style}` : "hpad08"}
        >
          {post.text}
        </div>
        {post.image && <img src={post.image} style={imgStyle} />}
        <PostActionsBar className="hpad08" post={post} onShare={onShare} />
      </div>
    </div>
  );
}
