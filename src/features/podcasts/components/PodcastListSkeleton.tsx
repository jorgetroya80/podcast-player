const PLACEHOLDERS = Array.from({ length: 10 }, (_, index) => index)

const PodcastListSkeleton = () => {
  return (
    <div role="status" aria-busy="true" aria-label="Loading podcasts">
      <ul className="grid grid-cols-1 gap-x-4 gap-y-14 pt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {PLACEHOLDERS.map((key) => (
          <li
            key={key}
            data-testid="podcast-skeleton"
            className="h-40 animate-pulse rounded border border-gray-200 bg-gray-100"
          />
        ))}
      </ul>
    </div>
  )
}

export default PodcastListSkeleton
