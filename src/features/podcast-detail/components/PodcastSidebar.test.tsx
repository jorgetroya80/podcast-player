import { screen } from '@testing-library/react'

import { renderWithProviders } from '../../../test/renderWithProviders'
import PodcastSidebar from './PodcastSidebar'

const base = { id: '42', name: 'Serial', artist: 'Sarah Koenig', image: 'https://img/1.png' }

describe('PodcastSidebar', () => {
  it('links image, title and author to the podcast', () => {
    renderWithProviders(<PodcastSidebar {...base} description="About" />)

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)
    links.forEach((link) => expect(link).toHaveAttribute('href', '/podcast/42'))
    // image link (alt text) + title link
    expect(screen.getAllByRole('link', { name: 'Serial' })).toHaveLength(2)
    expect(screen.getByRole('link', { name: 'by Sarah Koenig' })).toBeInTheDocument()
  })

  it('uses the name as image alt text', () => {
    renderWithProviders(<PodcastSidebar {...base} />)

    expect(screen.getByAltText('Serial')).toHaveAttribute('src', 'https://img/1.png')
  })

  it('renders the description when present', () => {
    renderWithProviders(<PodcastSidebar {...base} description="A true story" />)

    expect(screen.getByRole('heading', { name: 'Description' })).toBeInTheDocument()
    expect(screen.getByText('A true story')).toBeInTheDocument()
  })

  it.each([undefined, ''])('renders no description block when %j', (description) => {
    renderWithProviders(<PodcastSidebar {...base} description={description} />)

    expect(screen.queryByRole('heading', { name: 'Description' })).not.toBeInTheDocument()
  })
})
