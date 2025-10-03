import styles from "./TabBar.module.css"

interface TabBarProps {
  texts: string[]
  activeIdx: number
  onActiveIdxChange: (index: number) => void
}

export function TabBar({ texts, activeIdx, onActiveIdxChange }: TabBarProps) {
  if (texts.length === 0) {
    return null
  }
  
  return (
    <div className={styles.tabToggle}>
      {texts.map((text, index) => (
        <button
          key={text}
          className={`${styles.tabButton} ${index === activeIdx ? styles.active : ""}`}
          onClick={() => {
            onActiveIdxChange(index)
          }}
        >
          {text}
        </button>
      ))}
    </div>
  )
}
