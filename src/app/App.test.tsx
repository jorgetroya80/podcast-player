import { render, screen } from '@testing-library/react'

import App from './App'

describe('App', () => {
  it('renders the current route', () => {
    render(<App />)

    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
