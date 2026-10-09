import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import RouteError from './RouteError'

const renderWithLoaderError = (loader: () => never) => {
  const router = createMemoryRouter([
    { path: '/', loader, element: <p>ok</p>, errorElement: <RouteError /> },
  ])
  render(<RouterProvider router={router} />)
}

describe('RouteError', () => {
  it('informs the user and logs the error when a loader fails', async () => {
    const failure = new Error('boom')
    renderWithLoaderError(() => {
      throw failure
    })

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows a not found message for 404 responses', async () => {
    renderWithLoaderError(() => {
      throw new Response('', { status: 404 })
    })

    expect(await screen.findByRole('alert')).toHaveTextContent(/page not found/i)
  })
})
