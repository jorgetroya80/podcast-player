import { LinkifyIt, type Match } from 'linkify-it'

import { escapeAttribute, escapeHtml } from './escapeHtml'

const LINKIFY_OPTIONS = { fuzzyLink: true, fuzzyEmail: false, fuzzyIP: false }
const SCHEMALESS = ''
const LINKABLE_SCHEMAS: readonly string[] = [SCHEMALESS, 'http:', 'https:']
const DEFAULT_SCHEME = 'https://'

const linkify = new LinkifyIt(LINKIFY_OPTIONS)

const isLinkable = ({ schema }: Match) => LINKABLE_SCHEMAS.includes(schema)

const toHref = ({ schema, raw }: Match) => (schema === SCHEMALESS ? `${DEFAULT_SCHEME}${raw}` : raw)

const toAnchor = (match: Match) =>
  `<a href="${escapeAttribute(toHref(match))}">${escapeHtml(match.raw)}</a>`

export const linkifyText = (text: string): string => {
  const links = (linkify.match(text) ?? []).filter(isLinkable)

  let html = ''
  let position = 0

  for (const link of links) {
    html += escapeHtml(text.slice(position, link.index)) + toAnchor(link)
    position = link.lastIndex
  }
  
  return html + escapeHtml(text.slice(position))
}
