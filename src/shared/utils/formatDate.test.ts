import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formats as DD/MM/YYYY', () => {
    expect(formatDate('2026-10-06T12:00:00Z')).toBe('06/10/2026')
  })

  it('is stable at UTC midnight boundaries', () => {
    expect(formatDate('2026-10-06T00:00:00Z')).toBe('06/10/2026')
    expect(formatDate('2026-10-06T23:59:59Z')).toBe('06/10/2026')
  })

  it('pads single-digit day and month', () => {
    expect(formatDate('2026-01-02T10:00:00Z')).toBe('02/01/2026')
  })

  it('handles leap day', () => {
    expect(formatDate('2024-02-29T08:30:00Z')).toBe('29/02/2024')
  })

  it('handles year boundary', () => {
    expect(formatDate('2025-12-31T23:59:59Z')).toBe('31/12/2025')
    expect(formatDate('2026-01-01T00:00:00Z')).toBe('01/01/2026')
  })

  it('returns empty string for invalid input', () => {
    expect(formatDate('not a date')).toBe('')
    expect(formatDate('')).toBe('')
  })
})
