import createDOMPurify from 'dompurify'

const purify = createDOMPurify(window)

// Runs after the default profile has cleaned each element, so adding
// target/rel here is safe (they are our attributes, not the author's).
purify.addHook('afterSanitizeAttributes', (node) => {
  if (node.nodeName === 'A' && node.hasAttribute('href')) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

const sanitizeHtml = (html: string): string => purify.sanitize(html)

export default sanitizeHtml
