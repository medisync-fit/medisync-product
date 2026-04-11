export default function SocialProofBar() {
  const items = [
    'Trusted by families in',
    { country: 'Sri Lanka' },
    { stat: '99.2% on-time delivery' },
    { country: 'India' },
    { stat: 'HIPAA-aligned' },
    { country: 'United Kingdom' },
    { stat: '4.8★ rated' },
    { country: 'Australia' },
    { country: 'Canada' },
  ]

  const content = items.map((item, i) => {
    if (typeof item === 'string') {
      return (
        <span key={i} className="text-text-secondary text-sm whitespace-nowrap">
          {item}
        </span>
      )
    }
    if ('country' in item) {
      return (
        <span key={i} className="text-brand font-medium text-sm whitespace-nowrap">
          {item.country}
        </span>
      )
    }
    return (
      <span key={i} className="text-text-secondary text-sm whitespace-nowrap">
        {item.stat}
      </span>
    )
  })

  const row = content.reduce<React.ReactNode[]>((acc, el, i) => {
    if (i > 0) acc.push(<span key={`sep-${i}`} className="text-text-secondary/30 mx-4">·</span>)
    acc.push(el)
    return acc
  }, [])

  return (
    <div className="group py-4 bg-navy-800 border-y border-brand/10 overflow-hidden">
      <div className="flex animate-marquee w-max group-hover:[animation-play-state:paused]">
        <div className="flex items-center gap-0 px-8">
          {row}
        </div>
        <div className="flex items-center gap-0 px-8">
          {row}
        </div>
      </div>
    </div>
  )
}
