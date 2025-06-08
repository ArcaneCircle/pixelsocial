import { useMemo } from "react";

import PostItem from "~/components/PostItem";

interface Props {
  posts: Post[];
}

export default function Feed({ posts }: Props) {
  const items = posts.map((p) =>
    useMemo(() => <PostItem key={p.id} post={p} />, [p.id]),
  );

  return (
    <div>
      {posts.length ? (
        items
      ) : (
        <p style={{ textAlign: "center", fontSize: "1.5em", color: "#737373" }}>
          No posts yet.
        </p>
      )}
    </div>
  );
}
