import { QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import type { ReactNode } from 'react'

import { TOP_PODCASTS_URL } from '../../shared/api/config'
import podcastDetails from '../../test/mocks/podcastDetails.json'
import { server } from '../../test/mocks/server'
import { createTestQueryClient } from '../../test/renderWithProviders'
import { useSidebarPodcast } from './useSidebarPodcast'

const LISTED_ID = '1535809341'
const LISTED_NAME = 'The Joe Budden Podcast'
const UNLISTED_ID = '934552872'
const UNLISTED_NAME = 'Switched on Pop'
const LOOKUP = 'https://itunes.apple.com/lookup'

const gate = () => {
  let release: () => void = () => undefined
  const promise = new Promise<void>((resolve) => {
    release = resolve
  })
  return { promise, release }
}

const renderSidebar = (podcastId: string) => {
  const queryClient = createTestQueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return { queryClient, ...renderHook(() => useSidebarPodcast(podcastId), { wrapper }) }
}

describe('useSidebarPodcast', () => {
  let consoleError: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleError.mockRestore()
  })

  it('uses the list item, with description, even after the detail has loaded', async () => {
    const { result, queryClient } = renderSidebar(LISTED_ID)

    await waitFor(() => expect(result.current?.name).toBe(LISTED_NAME))
    await waitFor(() => expect(queryClient.isFetching()).toBe(0))

    expect(result.current?.name).toBe(LISTED_NAME)
    expect(result.current?.description).toEqual(expect.any(String))
    expect(result.current?.description).not.toBe('')
  })

  it('is undefined while the detail is pending, then uses the detail without description', async () => {
    const detailGate = gate()
    server.use(
      http.get(LOOKUP, async () => {
        await detailGate.promise
        return HttpResponse.json(podcastDetails)
      }),
    )

    const { result, queryClient } = renderSidebar(UNLISTED_ID)

    // The list settles while the detail is still held back.
    await waitFor(() =>
      expect(
        queryClient
          .getQueryCache()
          .findAll()
          .some((query) => query.state.status === 'success'),
      ).toBe(true),
    )
    expect(result.current).toBeUndefined()

    detailGate.release()

    await waitFor(() => expect(result.current?.name).toBe(UNLISTED_NAME))
    expect(result.current?.id).toBe(UNLISTED_ID)
    expect(result.current?.description).toBeUndefined()
  })

  it('falls back to the detail, without description, when the list fails', async () => {
    server.use(http.get(TOP_PODCASTS_URL, () => new HttpResponse(null, { status: 500 })))

    const { result } = renderSidebar(LISTED_ID)

    await waitFor(() => expect(result.current?.name).toBe(UNLISTED_NAME))
    expect(result.current?.description).toBeUndefined()
    expect(consoleError).toHaveBeenCalled()
  })

  it('stays undefined when the podcast is not listed and the detail has no results', async () => {
    server.use(http.get(LOOKUP, () => HttpResponse.json({ resultCount: 0, results: [] })))

    const { result, queryClient } = renderSidebar('9345528')

    await waitFor(() => expect(queryClient.isFetching()).toBe(0))
    expect(queryClient.getQueryCache().findAll().length).toBe(2)
    expect(result.current).toBeUndefined()
  })

  it.each([
    ['listed', LISTED_ID],
    ['unlisted', UNLISTED_ID],
  ])('returns only id, name, artist, image and description (%s)', async (_label, id) => {
    const { result, queryClient } = renderSidebar(id)

    await waitFor(() => expect(result.current).toBeDefined())
    await waitFor(() => expect(queryClient.isFetching()).toBe(0))

    const keys = Object.keys(result.current ?? {})
    expect(keys).not.toContain('summary')
    expect(
      keys.every((key) => ['id', 'name', 'artist', 'image', 'description'].includes(key)),
    ).toBe(true)
    expect(keys).toEqual(expect.arrayContaining(['id', 'name', 'artist', 'image']))
  })
})
