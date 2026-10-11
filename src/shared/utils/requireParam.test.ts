import { requireParam } from './requireParam'

describe('requireParam', () => {
  it('returns the value when it is a non-empty string', () => {
    expect(requireParam('934552872', 'podcastId')).toBe('934552872')
  })

  it.each([undefined, ''])('throws for %j', (value) => {
    expect(() => requireParam(value, 'podcastId')).toThrow(Error)
  })

  it('includes the param name in the message', () => {
    expect(() => requireParam(undefined, 'episodeId')).toThrow('Missing route param: episodeId')
  })
})
