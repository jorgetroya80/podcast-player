import PodcastGrid from './PodcastGrid'

const PLACEHOLDERS = Array.from({ length: 10 }, (_, index) => index)

const PodcastListSkeleton = () => {
  return (
    <div role="status" aria-busy="true" aria-label="Loading podcasts">
      <PodcastGrid>
        {PLACEHOLDERS.map((key) => (
          <li
            key={key}
            data-testid="podcast-skeleton"
            className="h-40 animate-pulse rounded border border-gray-200 bg-gray-100"
          />
        ))}
      </PodcastGrid>
    </div>
  )
}

export default PodcastListSkeleton
