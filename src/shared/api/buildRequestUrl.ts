function buildRequestUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  const baseUrl = 'https://itunes.apple.com'
  return `${baseUrl}${url}`
}

export { buildRequestUrl }
