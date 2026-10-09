import { render, screen } from '@testing-library/react'

import EpisodePlayer from './EpisodePlayer'

const FALLBACK = 'Audio not available for this episode.'

describe('EpisodePlayer', () => {
  it('renders a native audio player with the given src', () => {
    const { container } = render(<EpisodePlayer title="Pilot" src="https://example.com/a.mp3" />)

    const audio = container.querySelector('audio')
    expect(audio).toHaveAttribute('src', 'https://example.com/a.mp3')
    expect(audio).toHaveAttribute('controls')
    expect(audio).toHaveAttribute('preload', 'none')
    expect(screen.getByLabelText('Audio player for Pilot')).toBe(audio)
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
  })

  it.each([undefined, ''])('shows the fallback and no audio when src is %j', (src) => {
    const { container } = render(<EpisodePlayer title="Pilot" src={src} />)

    expect(container.querySelector('audio')).not.toBeInTheDocument()
    expect(screen.getByText(FALLBACK)).toBeInTheDocument()
  })
})
