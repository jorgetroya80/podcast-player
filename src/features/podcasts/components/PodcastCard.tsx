import { Link } from 'react-router'

import type { Podcast } from '../../../shared/types'

type PodcastCardProps = Pick<Podcast, 'id' | 'name' | 'artist' | 'image'>

const PodcastCard = ({ id, name, artist, image }: PodcastCardProps) => {
  return (
    <Link
      to={`/podcast/${id}`}
      className="flex flex-col items-center rounded border border-gray-200 text-center shadow-sm hover:shadow-md"
    >
      <img
        src={image}
        alt={name}
        width={96}
        height={96}
        className="-mt-10 size-24 rounded-full object-cover"
      />
      <div className="p-4">
        <h2 className="mt-3 text-sm font-bold uppercase">{name}</h2>
        <p className="text-sm text-gray-500">Author: {artist}</p>
      </div>
    </Link>
  )
}

export default PodcastCard
