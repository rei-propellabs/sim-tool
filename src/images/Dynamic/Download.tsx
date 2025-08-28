export const Download = ({ color, size}: { color?: string, size?: number }) => {
  return (
    <svg width={size ?? 16} height={size ?? 16} viewBox="0 0 16 16" fill="none">
      <path
        d="M12.667 6H10V2H6v4H3.333L8 10.667 12.667 6zm-9.334 6v1.333h9.334V12H3.333z"
        fill={color ?? "#68DDD2"}
      />
    </svg>
  )
};
