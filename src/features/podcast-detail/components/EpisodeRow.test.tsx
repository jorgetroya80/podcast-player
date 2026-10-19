import { screen } from '@testing-library/react'

import { renderWithSelectedPodcast } from '../../../test/renderWithProviders'
import EpisodeRow, { type EpisodeRowData } from './EpisodeRow'

const episode: EpisodeRowData = {
  id: '7',
  title: 'Pilot',
  releasedAt: '2024-03-05T10:00:00Z',
  durationMs: 135_000,
}

const renderRow = (ep = episode) =>
  renderWithSelectedPodcast(
    <table>
      <tbody>
        <EpisodeRow episode={ep} />
      </tbody>
    </table>,
    { podcastId: '42' },
  )

describe('EpisodeRow', () => {
  it('renders link, formatted date and duration', () => {
    renderRow()

    expect(screen.getByRole('link', { name: 'Pilot' })).toHaveAttribute(
      'href',
      '/podcast/42/episode/7',
    )
    expect(screen.getByRole('cell', { name: '05/03/2024' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '02:15' })).toBeInTheDocument()
  })

  it('renders an empty duration cell when missing', () => {
    renderRow({ id: '7', title: 'Pilot', releasedAt: episode.releasedAt })

    const cells = screen.getAllByRole('cell')
    expect(cells).toHaveLength(3)
    expect(cells[2]).toBeEmptyDOMElement()
  })
})
