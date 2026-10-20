import { usePodcastFilter } from '../context/PodcastFilterContext'
import { usePodcasts } from '../hooks/usePodcasts'

import PodcastCard from './PodcastCard'
import PodcastFilter from './PodcastFilter'
import PodcastGrid from './PodcastGrid'
import PodcastListEmpty from './PodcastListEmpty'
import PodcastListSkeleton from './PodcastListSkeleton'

const PodcastList = () => {
  const { podcasts, isPending } = usePodcasts()
  const { query, setQuery, filtered } = usePodcastFilter(podcasts)

  return (
    <section>
      <PodcastFilter
        value={query}
        onChange={setQuery}
        count={isPending ? undefined : filtered.length}
      />
      {isPending ? (
        <PodcastListSkeleton />
      ) : filtered.length === 0 ? (
        <PodcastListEmpty query={query} />
      ) : (
        <PodcastGrid>
          {filtered.map(({ id, name, artist, image }) => (
            <PodcastCard key={id} id={id} name={name} artist={artist} image={image} />
          ))}
        </PodcastGrid>
      )}
    </section>
  )
}

export default PodcastList
