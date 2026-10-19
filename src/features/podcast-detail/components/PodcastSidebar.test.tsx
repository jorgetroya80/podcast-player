import { screen } from '@testing-library/react'

import { renderWithSelectedPodcast } from '../../../test/renderWithSelectedPodcast'
import type { SelectedPodcast } from '../context/SelectedPodcastContext'
import PodcastSidebar from './PodcastSidebar'

const base = { id: '42', name: 'Serial', artist: 'Sarah Koenig', image: 'https://img/1.png' }

const renderSidebar = (podcast?: SelectedPodcast) =>
  renderWithSelectedPodcast(<PodcastSidebar />, { podcast })

describe('PodcastSidebar', () => {
  it('links image, title and author to the podcast', () => {
    renderSidebar({ ...base, description: 'About' })

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)
    links.forEach((link) => expect(link).toHaveAttribute('href', '/podcast/42'))
    // image link (alt text) + title link
    expect(screen.getAllByRole('link', { name: 'Serial' })).toHaveLength(2)
    expect(screen.getByRole('link', { name: 'by Sarah Koenig' })).toBeInTheDocument()
  })

  it('uses the name as image alt text', () => {
    renderSidebar(base)

    expect(screen.getByAltText('Serial')).toHaveAttribute('src', 'https://img/1.png')
  })

  it('renders the description when present', () => {
    renderSidebar({ ...base, description: 'A true story' })

    expect(screen.getByRole('heading', { name: 'Description' })).toBeInTheDocument()
    expect(screen.getByText('A true story')).toBeInTheDocument()
  })

  it.each([undefined, ''])('renders no description block when %j', (description) => {
    renderSidebar({ ...base, description })

    expect(screen.queryByRole('heading', { name: 'Description' })).not.toBeInTheDocument()
  })

  it('renders nothing without a podcast in the context', () => {
    const { container } = renderSidebar(undefined)

    expect(container).toBeEmptyDOMElement()
  })
})
