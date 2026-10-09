import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { act, render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, Outlet } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { createTestQueryClient } from '../../test/renderWithProviders'
import RouteLoadingIndicator from './RouteLoadingIndicator'

const renderApp = (loader: () => Promise<null>) => {
  const router = createMemoryRouter([
    {
      element: <RouteLoadingIndicator />,
      children: [
        { path: '/', element: <p>home</p> },
        { path: '/slow', loader, element: <p>slow</p> },
      ],
    },
  ])
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return router
}

const Layout = () => (
  <>
    <RouteLoadingIndicator />
    <Outlet />
  </>
)

const SlowData = ({ promise }: { promise: Promise<string> }) => {
  const { data } = useQuery({ queryKey: ['slow'], queryFn: () => promise })
  return <p>{data ?? 'pending'}</p>
}

describe('RouteLoadingIndicator', () => {
  it('is null when idle', () => {
    renderApp(() => Promise.resolve(null))

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('shows while a loader is pending and hides when it resolves', async () => {
    let resolve!: () => void
    const router = renderApp(() => new Promise((r) => (resolve = () => r(null))))

    await act(async () => {
      void router.navigate('/slow')
    })

    expect(await screen.findByRole('status')).toBeInTheDocument()

    await act(async () => resolve())

    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
  })

  it('shows while the destination screen is fetching its own data', async () => {
    let resolve!: (value: string) => void
    const promise = new Promise<string>((r) => (resolve = r))
    const router = createMemoryRouter([
      {
        element: <Layout />,
        children: [
          { path: '/', element: <p>home</p> },
          { path: '/data', element: <SlowData promise={promise} /> },
        ],
      },
    ])
    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    await act(async () => {
      void router.navigate('/data')
    })

    expect(await screen.findByRole('status')).toBeInTheDocument()

    await act(async () => resolve('done'))

    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
  })
})
