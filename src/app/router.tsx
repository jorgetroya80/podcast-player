import { createBrowserRouter, type RouteObject } from 'react-router'
import type { QueryClient } from '@tanstack/react-query'

import AppLayout from './layouts/AppLayout'
import PodcastLayout from './layouts/PodcastLayout'
import PodcastListPage from '../pages/PodcastListPage/PodcastListPage'
import PodcastDetailPage from '../pages/PodcastDetailPage/PodcastDetailPage'
import EpisodeDetailPage from '../pages/EpisodeDetailPage/EpisodeDetailPage'
import { podcastsQuery, PodcastListSkeleton } from '../features/podcasts'
import { EpisodeTableSkeleton } from '../features/podcast-detail'
import RouteError from '../shared/components/RouteError'

// Waits for the podcast list so the sidebar can render at once from the cache. If the list fails
// the error is ignored and the sidebar falls back to the detail data.
// The detail is not loaded here: PodcastLayout requests it, showing a skeleton on the right.
const podcastLayoutLoader = (queryClient: QueryClient) =>
  queryClient.query(podcastsQuery).catch(() => undefined)

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
              { path: 'episode/:episodeId', element: <EpisodeDetailPage /> },
            ],
          },
        ],
      },
    ],
  },
]

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter(routes(queryClient))
