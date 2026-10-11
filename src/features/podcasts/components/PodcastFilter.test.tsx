import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import PodcastFilter from './PodcastFilter'

describe('PodcastFilter', () => {
  it('shows the value and the count in a labelled search landmark', () => {
    render(<PodcastFilter value="abc" onChange={() => vi.fn()} count={7} />)

    expect(screen.getByRole('search')).toBeInTheDocument()
    expect(screen.getByLabelText('Filter podcasts')).toHaveValue('abc')
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('calls onChange when typing', async () => {
    const onChange = vi.fn()
    render(<PodcastFilter value="" onChange={onChange} count={0} />)

    await userEvent.type(screen.getByLabelText('Filter podcasts'), 'a')

    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('hides the count badge when no count is given', () => {
    render(<PodcastFilter value="" onChange={() => vi.fn()} />)

    expect(screen.getByRole('search')).not.toHaveTextContent('0')
  })
})
