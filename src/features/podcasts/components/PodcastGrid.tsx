import { Children, isValidElement } from 'react'
import type { ReactNode } from 'react'

import styles from './PodcastGrid.module.css'

type PodcastGridProps = { children: ReactNode }

// Each child is one grid item; the grid provides the surrounding <li>.
const PodcastGrid = ({ children }: PodcastGridProps) => {
  return (
    <ul className={styles.grid}>
      {Children.toArray(children).map((child, index) => (
        <li key={isValidElement(child) && child.key !== null ? child.key : index}>{child}</li>
      ))}
    </ul>
  )
}

export default PodcastGrid
