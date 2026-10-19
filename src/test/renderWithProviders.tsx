import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ComponentProps, ReactElement } from 'react'
import { createMemoryRouter, MemoryRouter, type RouteObject } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { SelectedPodcastProvider } from '../features/podcast-detail'
import { createQueryCache } from '../shared/api/queryClient'
import type { PodcastDetail } from '../shared/types'

export const createTestQueryClient = () =>
  new QueryClient({ queryCache: createQueryCache(), defaultOptions: { queries: { retry: false } } })

type Options = {
  route?: string
  queryClient?: QueryClient
}

export const renderWithProviders = (
  ui: ReactElement,
  { route = '/', queryClient = createTestQueryClient() }: Options = {},
) => ({
  queryClient,
  ...render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  ),
})

export const renderRoutes = (
  routes: (queryClient: QueryClient) => RouteObject[],
  { route = '/', queryClient = createTestQueryClient() }: Options = {},
) => {
  const router = createMemoryRouter(routes(queryClient), { initialEntries: [route] })
  return {
    queryClient,
    router,
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    ),
  }
}

type SelectedPodcastState = ComponentProps<typeof SelectedPodcastProvider>['value']

const sampleInfo = { id: '42', name: 'Serial', artist: 'Sarah Koenig', image: 'serial.png' }

const sampleDetail: PodcastDetail = {
  info: sampleInfo,
  episodeCount: 1,
  episodes: [{ id: '7', title: 'Pilot', releasedAt: '2024-03-05T10:00:00Z', durationMs: 135_000 }],
}

export const sampleSelectedPodcast: SelectedPodcastState = {
  podcastId: '42',
  podcast: { ...sampleInfo, description: 'A podcast about one story.' },
  detail: sampleDetail,
}

// For components that read the active podcast with useSelectedPodcast.
export const renderWithSelectedPodcast = (
  ui: ReactElement,
  state: Partial<SelectedPodcastState> = {},
  options: Options = {},
) =>
  renderWithProviders(
    <SelectedPodcastProvider value={{ ...sampleSelectedPodcast, ...state }}>
      {ui}
    </SelectedPodcastProvider>,
    options,
  )
