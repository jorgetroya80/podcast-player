import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import AppLayout from './AppLayout'

describe('AppLayout', () => {
  it('renders the header and child route', () => {
    const router = createMemoryRouter([
      { element: <AppLayout />, children: [{ path: '/', element: <p>child test content</p> }] },
    ])
    render(<RouterProvider router={router} />)

    expect(screen.getByRole('banner')).toHaveTextContent('Header')
    expect(screen.getByText('child test content')).toBeInTheDocument()
  })
})
