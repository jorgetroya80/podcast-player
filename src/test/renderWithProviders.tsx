import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { createMemoryRouter, MemoryRouter, type RouteObject } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { createQueryCache } from '../shared/api/queryClient'

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
