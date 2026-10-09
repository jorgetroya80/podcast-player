import { NotFoundError } from '../../../shared/api/NotFoundError'
import { EpisodeNotFoundError } from './EpisodeNotFoundError'

describe('EpisodeNotFoundError', () => {
  it('is a NotFoundError with a fixed message and name', () => {
    const error = new EpisodeNotFoundError()

    expect(error).toBeInstanceOf(NotFoundError)
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Episode not found')
    expect(error.name).toBe('EpisodeNotFoundError')
  })
})
