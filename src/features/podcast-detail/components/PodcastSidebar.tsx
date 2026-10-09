import { Link } from 'react-router'

import type { Podcast } from '../../../shared/types'

type PodcastSidebarProps = Pick<Podcast, 'id' | 'name' | 'artist' | 'image'> & {
  description?: string
}

const PodcastSidebar = ({ id, name, artist, image, description }: PodcastSidebarProps) => {
  const to = `/podcast/${id}`

  return (
    <aside className="flex flex-col gap-4 rounded border border-gray-200 p-4 shadow-sm">
      <Link to={to} className="self-center">
        <img
          src={image}
          alt={name}
          width={170}
          height={170}
          className="size-44 rounded object-cover"
        />
      </Link>
      <div className="border-t border-gray-200 pt-4">
        <h2 className="text-base font-bold">
          <Link to={to}>{name}</Link>
        </h2>
        <p className="text-sm text-gray-500 italic">
          <Link to={to}>by {artist}</Link>
        </p>
      </div>
      {description ? (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-bold">Description</h3>
          <p className="text-sm wrap-break-word text-gray-600 italic">{description}</p>
        </div>
      ) : null}
    </aside>
  )
}

export default PodcastSidebar
