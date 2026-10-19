import plainTextToHtml from './plainTextToHtml'
import sanitizeHtml from './sanitizeHtml'

import styles from './EpisodeDescription.module.css'

type EpisodeDescriptionProps = { html?: string }

const EpisodeDescription = ({ html }: EpisodeDescriptionProps) => {
  const clean = html?.trim() ? sanitizeHtml(plainTextToHtml(html)) : ''

  if (!clean) return null

  return (
    <section className={styles.description}>
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: clean }} />
    </section>
  )
}

export default EpisodeDescription
