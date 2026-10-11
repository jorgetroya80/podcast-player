import { Children, isValidElement } from 'react'
import type { ReactNode } from 'react'

type PodcastGridProps = { children: ReactNode }

// Each child is one grid item; the grid provides the surrounding <li>.
const PodcastGrid = ({ children }: PodcastGridProps) => {
  return (
    <ul className="mt-10 grid grid-cols-1 gap-x-4 gap-y-14 pt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Children.toArray(children).map((child, index) => (
        <li key={isValidElement(child) && child.key !== null ? child.key : index}>{child}</li>
      ))}
    </ul>
  )
}

export default PodcastGrid
