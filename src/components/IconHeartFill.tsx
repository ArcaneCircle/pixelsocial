import { SVGProps } from "react";

export default function IconHeartFill(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Icon based on Pixelarticons by Gerrit Halfmann - https://github.com/halfmage/pixelarticons/blob/master/LICENSE */}
      <path
        fill="currentColor"
        d="m9 2h-4v2h-2v2h-2v6h2v2h2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h2v-2h2v-6h-2v-2h-2v-2h-4v2h-2v2h-2v-2h-2z"
      />
    </svg>
  );
}
