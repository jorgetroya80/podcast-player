import type { QueryClient } from '@tanstack/react-query'

import { podcastsQuery } from '../features/podcasts'

// Waits for the podcast list so the sidebar can render at once from the cache. If the list fails
// the error is ignored and the sidebar falls back to the detail data.
// The detail is not loaded here: PodcastLayout requests it, showing a skeleton on the right.
export const podcastLayoutLoader = (queryClient: QueryClient) =>
  queryClient.query(podcastsQuery).catch(() => undefined)

// Always throws a 404 response, which the route errorElement renders as "Page not found.".
export const notFoundLoader = () => {
  throw new Response('Not Found', { status: 404 })
}
