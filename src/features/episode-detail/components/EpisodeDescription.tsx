import { useMemo } from 'react'

import plainTextToHtml from './plainTextToHtml'
import sanitizeHtml from './sanitizeHtml'

type EpisodeDescriptionProps = { html?: string }

const EpisodeDescription = ({ html }: EpisodeDescriptionProps) => {
  const clean = useMemo(() => (html?.trim() ? sanitizeHtml(plainTextToHtml(html)) : ''), [html])

  if (!clean) return null

  return (
    <section className="flex flex-col gap-2">
      <div
        className="text-sm wrap-break-word italic [&_a]:text-blue-600 [&_a]:underline [&_img]:max-w-full [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_video]:max-w-full"
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    </section>
  )
}

export default EpisodeDescription
