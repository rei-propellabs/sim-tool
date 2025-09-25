
export const CloseFilled = ({ fill, size }: { fill?: string, size?: number }) => {
  return (
<svg width={size ?? "10"} height={size ?? "10"}viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 0C2.235 0 0 2.235 0 5C0 7.765 2.235 10 5 10C7.765 10 10 7.765 10 5C10 2.235 7.765 0 5 0ZM7.5 6.795L6.795 7.5L5 5.705L3.205 7.5L2.5 6.795L4.295 5L2.5 3.205L3.205 2.5L5 4.295L6.795 2.5L7.5 3.205L5.705 5L7.5 6.795Z" fill={fill ?? "#68DDD2"}/>
</svg>



  )
}