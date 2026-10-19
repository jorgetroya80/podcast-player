import { useState, type ReactNode } from 'react'

import { PodcastFilterContext } from '../context/PodcastFilterContext'

// Mounted above the routes (AppLayout) so the filter text survives navigating away from the list.
const PodcastFilterProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState('')

  return <PodcastFilterContext value={{ query, setQuery }}>{children}</PodcastFilterContext>
}

export default PodcastFilterProvider
