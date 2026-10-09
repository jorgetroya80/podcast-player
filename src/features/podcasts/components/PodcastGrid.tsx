import type { ReactNode } from 'react'

type PodcastGridProps = { children: ReactNode }

const PodcastGrid = ({ children }: PodcastGridProps) => {
  return (
    <ul className="mt-10 grid grid-cols-1 gap-x-4 gap-y-14 pt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </ul>
  )
}

export default PodcastGrid
