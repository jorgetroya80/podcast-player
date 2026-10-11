const HAS_TAGS = /<\/?[a-z][^>]*>/i

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// iTunes usually sends plain text where blank lines separate blocks. Turn it into paragraphs so
// runs of "\n" do not become tall empty gaps. Real HTML is returned untouched.
const plainTextToHtml = (text: string): string => {
  if (HAS_TAGS.test(text)) return text

  return text
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('')
}

export default plainTextToHtml
