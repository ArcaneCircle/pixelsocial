import { useMemo, useEffect } from "react";

import { _ } from "~/lib/i18n";
import { GRAY_COLOR } from "~/constants";

import PostItem from "~/components/PostItem";

interface Props {
  posts: Post[];
}

export default function Feed({ posts }: Props) {
  const items = posts.map((p) =>
    useMemo(
      () => <PostItem key={p.id} post={p} />,
      [p.id, p.likes, p.liked, p.replies],
    ),
  );

  useEffect(() => {
    const pos = sessionStorage.feedScrollPos;
    if (pos) {
      window.scrollTo(0, parseInt(pos));
      sessionStorage.removeItem("feedScrollPos");
    }
  }, []);

  return (
    <div>
      {posts.length ? (
        items
      ) : (
        <p
          style={{
            textAlign: "center",
            fontSize: "1.5em",
            color: GRAY_COLOR,
            paddingLeft: "0.5em",
            paddingRight: "0.5em",
          }}
        >
          {_("No posts yet")}
        </p>
      )}
    </div>
  );
}
