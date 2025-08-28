export const Check = ({ color, size}: { color?: string, size?: number }) => {
  return (
    <svg width={size ?? 28} height={size ?? 28} viewBox="0 0 28 28" fill="none">
      <path
        d="M14 .667C6.64.667.667 6.64.667 14S6.64 27.333 14 27.333 27.334 21.36 27.334 14 21.36.667 14 .667zm-2.666 20L4.667 14l1.88-1.88 4.787 4.773 10.12-10.12 1.88 1.893-12 12z"
        fill={color ?? "#1F6A43"}
      />
    </svg>
  )
}
