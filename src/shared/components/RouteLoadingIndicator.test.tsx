import { act, render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

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
  render(<RouterProvider router={router} />)
  return router
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
})
