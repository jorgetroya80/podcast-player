export function formatDate(iso: string): string {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) return ''

  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = String(date.getUTCFullYear())

  return `${day}/${month}/${year}`
}
