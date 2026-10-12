export const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const escapeAttribute = (text: string): string =>
  escapeHtml(text).replace(/"/g, '&quot;').replace(/'/g, '&#39;')
