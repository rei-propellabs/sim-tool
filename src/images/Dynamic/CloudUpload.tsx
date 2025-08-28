
export const CloudUpload = ({ color, size}: { color?: string, size?: number }) => {
  return (
    <svg width={size ?? 32} height={size ?? 32} viewBox="0 0 32 32" fill="none" >
        <path
          d="M25.8 13.387c-.907-4.6-4.947-8.054-9.8-8.054a9.994 9.994 0 00-8.867 5.387A7.992 7.992 0 000 18.667c0 4.413 3.587 8 8 8h17.333A6.67 6.67 0 0032 20c0-3.52-2.733-6.373-6.2-6.613zm-7.133 3.947v5.333h-5.334v-5.334h-4L16 10.668l6.667 6.667h-4z"
          fill={color ?? "#E6F9F8"}
          fillOpacity={0.6}
        />
    </svg>
  )
}
