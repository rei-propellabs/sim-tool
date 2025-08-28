import { SVGProps } from "react";

const Add = (props: SVGProps<SVGSVGElement>) => (
  <svg width={props.width ?? 18} height={props.height ?? 18} viewBox="0 0 18 18" fill="none" {...props}>
    <path
      d="M9.833 4.833H8.166v3.333H4.833v1.667h3.333v3.333h1.667V9.833h3.333V8.166H9.833V4.833zM8.999.666A8.336 8.336 0 00.666 8.999c0 4.6 3.733 8.334 8.333 8.334s8.334-3.734 8.334-8.334S13.599.666 8.999.666zm0 15a6.676 6.676 0 01-6.666-6.667 6.676 6.676 0 016.666-6.666 6.676 6.676 0 016.667 6.666 6.676 6.676 0 01-6.667 6.667z"
      fill={props.fill ?? "#14261B"}
      fillOpacity={0.87}
    />
  </svg>
);
export default Add;
