import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { createTestQueryClient } from '../../test/renderWithProviders'
import AppLayout from './AppLayout'

describe('AppLayout', () => {
  it('renders the header and child route', () => {
    const router = createMemoryRouter([
      { element: <AppLayout />, children: [{ path: '/', element: <p>child test content</p> }] },
    ])
    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    expect(screen.getByRole('banner')).toHaveTextContent('Podcaster')
    expect(screen.getByText('child test content')).toBeInTheDocument()
  })
})
