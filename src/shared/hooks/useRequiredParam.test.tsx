import { render, screen } from '@testing-library/react'
import { createMemoryRouter, useRouteError } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { useRequiredParam } from './useRequiredParam'

const Probe = () => <p>param: {useRequiredParam('podcastId')}</p>

const ErrorMessage = () => {
  const error = useRouteError()
  return <p>{error instanceof Error ? error.message : 'unknown'}</p>
}

const renderAt = (path: string, route: string) =>
  render(
    <RouterProvider
      router={createMemoryRouter([{ path, element: <Probe />, errorElement: <ErrorMessage /> }], {
        initialEntries: [route],
      })}
    />,
  )

describe('useRequiredParam', () => {
  let consoleError: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleError.mockRestore()
  })

  it('returns the param when the route defines it', () => {
    renderAt('/podcast/:podcastId', '/podcast/123')

    expect(screen.getByText('param: 123')).toBeInTheDocument()
  })

  it('throws a clear error when the route does not define it', () => {
    renderAt('/podcast', '/podcast')

    expect(screen.getByText('Missing route param: podcastId')).toBeInTheDocument()
  })
})
