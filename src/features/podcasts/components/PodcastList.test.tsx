import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import { server } from '../../../test/mocks/server'
import { renderWithProviders } from '../../../test/renderWithProviders'

import PodcastList from './PodcastList'

const renderList = () => renderWithProviders(<PodcastList />)

describe('PodcastList', () => {
  it('shows the skeleton, then the podcasts', async () => {
    renderList()

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByRole('search')).toBeInTheDocument()
    expect(await screen.findByText('The Joe Budden Podcast')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('filters by name and shows the empty state without matches', async () => {
    renderList()
    await screen.findByText('The Joe Budden Podcast')
    const input = screen.getByLabelText('Filter podcasts')

    await userEvent.type(input, 'budden')
    expect(screen.getAllByRole('listitem')).toHaveLength(1)

    await userEvent.clear(input)
    await userEvent.type(input, 'zzzz')
    expect(screen.getByText('No podcasts found by "zzzz"')).toBeInTheDocument()
    expect(screen.getByRole('search')).toBeInTheDocument()
  })

  it('shows the no data state when the list is empty', async () => {
    server.use(
      http.get('https://itunes.apple.com/us/rss/toppodcasts/*', () =>
        HttpResponse.json({ feed: { entry: [] } }),
      ),
    )
    renderList()

    expect(await screen.findByText('No podcasts available right now')).toBeInTheDocument()
  })
})
