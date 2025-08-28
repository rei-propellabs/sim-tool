

export const Arrow = ({ color, rotate = 0, width, height }: { color: string, rotate?: number, width?: number, height?: number }) => {
  return (
    <svg
      style={{ transform: `rotate(${rotate}deg)` }}
      width={width ?? 16} height={height ?? 16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.3327 7.33341H5.21935L8.94602 3.60675L7.99935 2.66675L2.66602 8.00008L7.99935 13.3334L8.93935 12.3934L5.21935 8.66675H13.3327V7.33341Z" fill={color} />
    </svg>
  )
}