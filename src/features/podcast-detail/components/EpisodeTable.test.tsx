import { screen } from '@testing-library/react'

import { renderWithProviders } from '../../../test/renderWithProviders'
import EpisodeTable from './EpisodeTable'

const episodes = [
  { id: '1', title: 'First', releasedAt: '2024-01-01T00:00:00Z', durationMs: 60_000 },
  { id: '2', title: 'Second', releasedAt: '2024-02-01T00:00:00Z' },
]

describe('EpisodeTable', () => {
  it('renders an accessible table with headers', () => {
    renderWithProviders(<EpisodeTable podcastId="42" episodes={episodes} />)

    expect(screen.getByRole('table', { name: 'Episodes' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Title' })).toHaveAttribute('scope', 'col')
    expect(screen.getByRole('columnheader', { name: 'Date' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Duration' })).toBeInTheDocument()
  })

  it('renders one row per episode with links', () => {
    renderWithProviders(<EpisodeTable podcastId="42" episodes={episodes} />)

    // header row + 2 episodes
    expect(screen.getAllByRole('row')).toHaveLength(3)
    expect(screen.getByRole('link', { name: 'First' })).toHaveAttribute(
      'href',
      '/podcast/42/episode/1',
    )
    expect(screen.getByRole('link', { name: 'Second' })).toHaveAttribute(
      'href',
      '/podcast/42/episode/2',
    )
  })
})
