import { act, renderHook } from '@testing-library/react'

import { usePodcastFilter } from './usePodcastFilter'

const podcasts = [
  { name: 'Serial', artist: 'Sarah Koenig' },
  { name: 'Radiolab', artist: 'WNYC' },
]

describe('usePodcastFilter', () => {
  it('returns all podcasts with an empty query', () => {
    const { result } = renderHook(() => usePodcastFilter(podcasts))

    expect(result.current.query).toBe('')
    expect(result.current.filtered).toEqual(podcasts)
  })

  it('filters when the query changes', () => {
    const { result } = renderHook(() => usePodcastFilter(podcasts))

    act(() => result.current.setQuery('wnyc'))

    expect(result.current.query).toBe('wnyc')
    expect(result.current.filtered).toEqual([podcasts[1]])
  })
})
