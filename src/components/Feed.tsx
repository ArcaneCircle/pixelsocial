import { useMemo, useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { _ } from "~/lib/i18n";
import { GRAY_COLOR } from "~/constants";

import PostItem from "~/components/PostItem";

interface Props {
  posts: Post[];
}

export default function Feed({ posts }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => window.document.documentElement,
    estimateSize: () => 200,
    overscan: 5,
  });

  useEffect(() => {
    const pos = sessionStorage.feedScrollPos;
    if (pos) {
      window.scrollTo(0, parseInt(pos));
      sessionStorage.removeItem("feedScrollPos");
    }
  }, []);

  const items = virtualizer.getVirtualItems();

  if (!posts.length) {
    return (
      <div>
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
      </div>
    );
  }

  return (
    <div ref={parentRef}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {items.map((virtualItem) => {
          const post = posts[virtualItem.index];
          return (
            <div
              key={post.id}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {useMemo(
                () => (
                  <PostItem post={post} />
                ),
                [post.id, post.likes, post.liked, post.replies],
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
