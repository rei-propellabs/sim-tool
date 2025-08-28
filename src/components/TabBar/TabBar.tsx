import styles from "./TabBar.module.css"

interface TabBarProps {
  texts: string[]
  activeText: string
  onActiveIdxChange: (index: number) => void
}

export function TabBar({ texts, activeText, onActiveIdxChange }: TabBarProps) {
  return (
    <div className={styles.tabToggle}>
      {texts.map((text, index) => (
        <button
          key={text}
          className={`${styles.tabButton} ${activeText === text ? styles.active : ""}`}
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
