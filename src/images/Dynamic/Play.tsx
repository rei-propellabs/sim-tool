export const Play = ({ color, size }: { color?: string, size?: number }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" 
      height={size ?? "24px"} viewBox="0 -960 960 960" 
      width={size ?? "24px"} fill={color ?? "#14261BAB"}>
        <path d="M320-200v-560l440 280-440 280Z" />
    </svg>
  )
}
