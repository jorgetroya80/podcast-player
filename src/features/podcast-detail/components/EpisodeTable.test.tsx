import { screen } from '@testing-library/react'

import { renderWithSelectedPodcast } from '../../../test/renderWithProviders'
import EpisodeTable from './EpisodeTable'

const episodes = [
  { id: '1', title: 'First', releasedAt: '2024-01-01T00:00:00Z', durationMs: 60_000 },
  { id: '2', title: 'Second', releasedAt: '2024-02-01T00:00:00Z' },
]

describe('EpisodeTable', () => {
  it('renders an accessible table with headers', () => {
    renderWithSelectedPodcast(<EpisodeTable episodes={episodes} />)

    expect(screen.getByRole('table', { name: 'Episodes' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Title' })).toHaveAttribute('scope', 'col')
    expect(screen.getByRole('columnheader', { name: 'Date' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Duration' })).toBeInTheDocument()
  })

  it('renders one row per episode linking to the podcast in the context', () => {
    renderWithSelectedPodcast(<EpisodeTable episodes={episodes} />, { podcastId: '99' })

    // header row + 2 episodes
    expect(screen.getAllByRole('row')).toHaveLength(3)
    expect(screen.getByRole('link', { name: 'First' })).toHaveAttribute(
      'href',
      '/podcast/99/episode/1',
    )
    expect(screen.getByRole('link', { name: 'Second' })).toHaveAttribute(
      'href',
      '/podcast/99/episode/2',
    )
  })
})
