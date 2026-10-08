import { buildRequestUrl } from './buildRequestUrl'

describe('buildRequestUrl', () => {
  it('returns unchanged URL (no proxy)', () => {
    expect(buildRequestUrl('https://example.com/a?b=1')).toBe('https://example.com/a?b=1')
  })
})
