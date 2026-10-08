import { createBrowserRouter, type RouteObject } from 'react-router'

import AppLayout from './layouts/AppLayout'
import PodcastLayout from './layouts/PodcastLayout'
import PodcastListPage from '../pages/PodcastListPage/PodcastListPage'
import PodcastDetailPage from '../pages/PodcastDetailPage/PodcastDetailPage'
import EpisodeDetailPage from '../pages/EpisodeDetailPage/EpisodeDetailPage'

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <PodcastListPage /> },
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
]

export const createAppRouter = () => createBrowserRouter(routes)
