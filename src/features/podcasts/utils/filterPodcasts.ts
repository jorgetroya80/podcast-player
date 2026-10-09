import type { Podcast } from '../../../shared/types'

export const filterPodcasts = <T extends Pick<Podcast, 'name' | 'artist'>>(
  podcasts: T[],
  query: string,
): T[] => {
  const term = query.trim().toLowerCase()
  if (!term) return podcasts

  return podcasts.filter(
    ({ name, artist }) => name.toLowerCase().includes(term) || artist.toLowerCase().includes(term),
  )
}
