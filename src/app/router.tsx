import { createBrowserRouter, type RouteObject } from 'react-router'
import type { QueryClient } from '@tanstack/react-query'

import AppLayout from './layouts/AppLayout'
import PodcastLayout from './layouts/PodcastLayout'
import PodcastListPage from '../pages/PodcastListPage/PodcastListPage'
import PodcastDetailPage from '../pages/PodcastDetailPage/PodcastDetailPage'
import EpisodeDetailPage from '../pages/EpisodeDetailPage/EpisodeDetailPage'
import { podcastsQuery } from '../features/podcasts'
import { EpisodeTableSkeleton, episodeLoader } from '../features/podcast-detail'
import RouteError from '../shared/components/RouteError'

import { notFoundLoader, podcastLayoutLoader } from './loaders'

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
            HydrateFallback: PodcastListPage,
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
          // The empty element and HydrateFallback only silence React Router's warnings: the loader always throws.
          { path: '*', element: <></>, loader: notFoundLoader, HydrateFallback: () => null },
        ],
      },
    ],
  },
]

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter(routes(queryClient))
