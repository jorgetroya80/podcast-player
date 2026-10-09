import { Link } from 'react-router'

import { formatDate } from '../../../shared/utils/formatDate'
import { formatDuration } from '../../../shared/utils/formatDuration'
import type { Episode } from '../../../shared/types'

export type EpisodeRowData = Pick<Episode, 'id' | 'title' | 'releasedAt' | 'durationMs'>

type EpisodeRowProps = { podcastId: string; episode: EpisodeRowData }

const EpisodeRow = ({ podcastId, episode }: EpisodeRowProps) => {
  return (
    <tr className="border-t border-gray-200 even:bg-gray-50">
      <td className="px-4 py-2">
        <Link
          to={`/podcast/${podcastId}/episode/${episode.id}`}
          className="text-blue-600 hover:underline"
        >
          {episode.title}
        </Link>
      </td>
      <td className="px-4 py-2 whitespace-nowrap">{formatDate(episode.releasedAt)}</td>
      <td className="px-4 py-2 whitespace-nowrap">{formatDuration(episode.durationMs)}</td>
    </tr>
  )
}

export default EpisodeRow
