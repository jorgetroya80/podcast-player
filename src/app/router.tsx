import { createBrowserRouter, type Params, type RouteObject } from 'react-router'
import type { QueryClient } from '@tanstack/react-query'

import AppLayout from './layouts/AppLayout'
import PodcastLayout from './layouts/PodcastLayout'
import PodcastListPage from '../pages/PodcastListPage/PodcastListPage'
import PodcastDetailPage from '../pages/PodcastDetailPage/PodcastDetailPage'
import EpisodeDetailPage from '../pages/EpisodeDetailPage/EpisodeDetailPage'
import { podcastsQuery, PodcastListSkeleton } from '../features/podcasts'
import { EpisodeTableSkeleton, findEpisode, podcastDetailQuery } from '../features/podcast-detail'
import { NotFoundError } from '../shared/api/NotFoundError'
import RouteError from '../shared/components/RouteError'

// Waits for the podcast list so the sidebar can render at once from the cache. If the list fails
// the error is ignored and the sidebar falls back to the detail data.
// The detail is not loaded here: PodcastLayout requests it, showing a skeleton on the right.
const podcastLayoutLoader = (queryClient: QueryClient) =>
  queryClient.query(podcastsQuery).catch(() => undefined)

// Validates the episode against the detail (already requested and cached by the layout, so no
// extra request). Logs once here, not in a component effect, and renders via the route errorElement.
const episodeLoader = async (queryClient: QueryClient, { podcastId, episodeId }: Params) => {
  if (!podcastId || !episodeId) {
    throw new Error('Missing podcastId or episodeId route params')
  }
  const detail = await queryClient.query(podcastDetailQuery(podcastId))
  if (!findEpisode(detail, episodeId)) {
    console.error('Episode not found:', { podcastId, episodeId })
    throw new NotFoundError('Episode not found')
  }
  return null
}

// The empty element and HydrateFallback only silence React Router's warnings: the loader always throws.
const notFoundLoader = () => {
  throw new Response('Not Found', { status: 404 })
}

export const routes = (queryClient: QueryClient): RouteObject[] => [
  {
    element: <AppLayout />,
    children: [
      {
        errorElement: <RouteError />,
        children: [
          {
            path: '/',
            element: <PodcastListPage />,
            HydrateFallback: PodcastListSkeleton,
            loader: () => queryClient.query(podcastsQuery),
          },
          {
            path: 'podcast/:podcastId',
            element: <PodcastLayout />,
            HydrateFallback: EpisodeTableSkeleton,
            loader: () => podcastLayoutLoader(queryClient),
            children: [
              { index: true, element: <PodcastDetailPage /> },
              {
                path: 'episode/:episodeId',
                element: <EpisodeDetailPage />,
                loader: ({ params }) => episodeLoader(queryClient, params),
                errorElement: <RouteError />,
              },
            ],
          },
          { path: '*', element: <></>, loader: notFoundLoader, HydrateFallback: () => null },
        ],
      },
    ],
  },
]

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter(routes(queryClient))
