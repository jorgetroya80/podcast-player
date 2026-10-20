import { act, renderHook } from '@testing-library/react'

import PodcastFilterProvider from '../components/PodcastFilterProvider'
import { usePodcastFilter } from './PodcastFilterContext'

const podcasts = [
  { name: 'Serial', artist: 'Sarah Koenig' },
  { name: 'Radiolab', artist: 'WNYC' },
]

const renderFilter = () =>
  renderHook(() => usePodcastFilter(podcasts), { wrapper: PodcastFilterProvider })

describe('usePodcastFilter', () => {
  it('returns all podcasts with an empty query', () => {
    const { result } = renderFilter()

    expect(result.current.query).toBe('')
    expect(result.current.filtered).toEqual(podcasts)
  })

  it('filters when the query changes', () => {
    const { result } = renderFilter()

    act(() => result.current.setQuery('wnyc'))

    expect(result.current.query).toBe('wnyc')
    expect(result.current.filtered).toEqual([podcasts[1]])
  })

  it('throws outside PodcastFilterProvider', () => {
    // React reports the render error to console.error
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => renderHook(() => usePodcastFilter(podcasts))).toThrow(
      'usePodcastFilter must be used inside PodcastFilterProvider',
    )
    consoleError.mockRestore()
  })
})
