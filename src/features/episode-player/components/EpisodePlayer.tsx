type EpisodePlayerProps = { title: string; src?: string }

const EpisodePlayer = ({ title, src }: EpisodePlayerProps) => {
  if (!src) return <p className="text-sm text-gray-600">Audio not available for this episode.</p>

  return (
    <audio
      controls
      preload="none"
      src={src}
      className="w-full"
      aria-label={`Audio player for ${title}`}
    >
      Your browser does not support the audio element.
    </audio>
  )
}

export default EpisodePlayer
