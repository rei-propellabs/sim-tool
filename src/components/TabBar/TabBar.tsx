import styles from "./TabBar.module.css"

interface TabBarProps {
  texts: string[]
  activeText: string
  onActiveTextChange: (text: string) => void
}

export function TabBar({ texts, activeText, onActiveTextChange }: TabBarProps) {
  return (
    <div className={styles.tabToggle}>
      {texts.map((text) => (
        <button
          key={text}
          className={`${styles.tabButton} ${activeText === text ? styles.active : ""}`}
          onClick={() => onActiveTextChange(text)}
        >
          {text}
        </button>
      ))}
    </div>
  )
}
