import { QueryClientProvider } from '@tanstack/react-query'
import { render, renderHook, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { Component, type ReactNode } from 'react'

import { HttpError } from '../../../shared/api/HttpError'
import podcastDetails from '../../../test/mocks/podcastDetails.json'
import { server } from '../../../test/mocks/server'
import { createTestQueryClient } from '../../../test/renderWithProviders'
import { PodcastNotFoundError } from '../api/PodcastNotFoundError'
import { usePodcastDetail } from './usePodcastDetail'

const LOOKUP_URL = 'https://itunes.apple.com/lookup'

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = createTestQueryClient()
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    const { error } = this.state
    return error ? <p role="alert">{error.name}</p> : this.props.children
  }
}

const DetailName = ({ id }: { id: string }) => {
  const { detail } = usePodcastDetail(id)
  return <p>{detail?.name ?? 'loading'}</p>
}

describe('usePodcastDetail', () => {
  it('starts pending without detail, then returns the mapped detail', async () => {
    const { result } = renderHook(() => usePodcastDetail('934552872'), { wrapper })

    expect(result.current.isPending).toBe(true)
    expect(result.current.detail).toBeUndefined()

    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.detail?.name).toBe('Switched on Pop')
    expect(result.current.detail?.episodes).toHaveLength(1)
  })

  it('requests again when the id changes', async () => {
    const ids: (string | null)[] = []
    server.use(
      http.get(LOOKUP_URL, ({ request }) => {
        ids.push(new URL(request.url).searchParams.get('id'))
        return HttpResponse.json(podcastDetails)
      }),
    )

    const { result, rerender } = renderHook(({ id }) => usePodcastDetail(id), {
      wrapper,
      initialProps: { id: '1' },
    })
    await waitFor(() => expect(result.current.isPending).toBe(false))

    rerender({ id: '2' })
    await waitFor(() => expect(ids).toEqual(['1', '2']))
    await waitFor(() => expect(result.current.isPending).toBe(false))
  })

  describe('errors', () => {
    let consoleError: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleError.mockRestore()
    })

    const renderInBoundary = () =>
      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <ErrorBoundary>
            <DetailName id="1" />
          </ErrorBoundary>
        </QueryClientProvider>,
      )

    it('throws HttpError to the error boundary on a 500', async () => {
      server.use(http.get(LOOKUP_URL, () => new HttpResponse(null, { status: 500 })))

      renderInBoundary()

      expect(await screen.findByRole('alert')).toHaveTextContent(new HttpError(500, '').name)
    })

    it('throws PodcastNotFoundError to the error boundary when there are no results', async () => {
      server.use(http.get(LOOKUP_URL, () => HttpResponse.json({ resultCount: 0, results: [] })))

      renderInBoundary()

      expect(await screen.findByRole('alert')).toHaveTextContent(new PodcastNotFoundError().name)
    })
  })
})
