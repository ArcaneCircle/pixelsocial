import { useMemo } from "react";

import { Manager } from "~/lib/manager.ts";

import TitleBar from "~/components/TitleBar";
import UserItem from "~/components/UserItem";
import Draft from "~/components/Draft";
import Button from "~/components/Button";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  flexWrap: "nowrap" as "nowrap",
  gap: "0.5em",
  padding: "0.8em",
};
const btnStyle = {
  background: "none",
  border: "1px solid #ccae3a",
  color: "#ccae3a",
};

interface Props {
  manager: Manager;
  setPage: (page: PageKey) => void;
}

export default function NewPost({ manager, setPage }: Props) {
  const titleBarM = useMemo(() => {
    const onClick = () => setPage("home");
    return (
      <TitleBar>
        <Button style={btnStyle} onClick={onClick}>
          Cancel
        </Button>
      </TitleBar>
    );
  }, [setPage]);

  const userM = useMemo(() => {
    return <UserItem userId={manager.selfId} name={manager.selfName} />;
  }, [manager]);

  const draftM = useMemo(() => {
    const onPost = (text: string, image: string, style: number) => {
      if (!text && !image) return;
      manager.sendPost(text, image, style);
      setPage("home");
    };
    return <Draft onPost={onPost} />;
  }, [manager]);

  return (
    <div>
      {titleBarM}
      <div style={containerStyle}>
        {userM}
        {draftM}
      </div>
    </div>
  );
}
