import { formatDuration } from './formatDuration'

describe('formatDuration', () => {
  it('formats 0 ms', () => {
    expect(formatDuration(0)).toBe('00:00')
  })

  it('floors to whole seconds', () => {
    expect(formatDuration(999)).toBe('00:00')
    expect(formatDuration(59_999)).toBe('00:59')
    expect(formatDuration(60_000)).toBe('01:00')
  })

  it('pads minutes and seconds to two digits', () => {
    expect(formatDuration(303_000)).toBe('05:03')
    expect(formatDuration(2_875_000)).toBe('47:55')
  })

  it('keeps counting minutes past 1 hour', () => {
    expect(formatDuration(3_599_999)).toBe('59:59')
    expect(formatDuration(3_600_000)).toBe('60:00')
    expect(formatDuration(8_120_000)).toBe('135:20')
  })

  it('returns empty string for undefined, NaN, negative, Infinity', () => {
    expect(formatDuration(undefined)).toBe('')
    expect(formatDuration(Number.NaN)).toBe('')
    expect(formatDuration(-1)).toBe('')
    expect(formatDuration(Number.POSITIVE_INFINITY)).toBe('')
  })
})
