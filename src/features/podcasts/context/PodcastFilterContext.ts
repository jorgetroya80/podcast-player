import { createContext } from 'react'

export type PodcastFilterState = { query: string; setQuery: (query: string) => void }

// Null default so a consumer outside PodcastFilterProvider fails loudly instead of filtering nothing.
export const PodcastFilterContext = createContext<PodcastFilterState | null>(null)
