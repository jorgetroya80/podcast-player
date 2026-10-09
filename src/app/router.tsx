import { createBrowserRouter, type RouteObject } from 'react-router'
import type { QueryClient } from '@tanstack/react-query'

import AppLayout from './layouts/AppLayout'
import PodcastLayout from './layouts/PodcastLayout'
import PodcastListPage from '../pages/PodcastListPage/PodcastListPage'
import PodcastDetailPage from '../pages/PodcastDetailPage/PodcastDetailPage'
import EpisodeDetailPage from '../pages/EpisodeDetailPage/EpisodeDetailPage'
import { podcastsQuery } from '../features/podcasts'
import RouteError from '../shared/components/RouteError'

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
            loader: () => queryClient.query(podcastsQuery),
          },
          {
            path: 'podcast/:podcastId',
            element: <PodcastLayout />,
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
