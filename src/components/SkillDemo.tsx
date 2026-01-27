import type { SkillDemo as SkillDemoType } from '../data/skills'

interface SkillDemoProps {
  demo: SkillDemoType
  categoryColor?: string
}

export function SkillDemo({ demo, categoryColor }: SkillDemoProps) {
  const renderDemo = () => {
    switch (demo.type) {
      case 'video':
        return (
          <video
            className="w-full h-auto rounded-lg"
            controls
            preload="metadata"
            aria-label={demo.alt}
          >
            <source src={demo.url} type="video/mp4" />
            <source src={demo.url} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        )
      case 'gif':
        return (
          <img
            src={demo.url}
            alt={demo.alt}
            className="w-full h-auto rounded-lg"
            loading="lazy"
          />
        )
      case 'image':
        return (
          <img
            src={demo.url}
            alt={demo.alt}
            className="w-full h-auto rounded-lg"
            loading="lazy"
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="glass-card p-6 md:p-8 mb-12">
      <h2 className="text-lg font-medium text-white mb-5 flex items-center gap-2">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={categoryColor || 'var(--color-grey-400)'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        Preview
      </h2>
      <div className="overflow-hidden rounded-lg">
        {renderDemo()}
      </div>
      {demo.alt && (
        <p
          className="mt-3 text-sm"
          style={{ color: 'var(--color-grey-400)' }}
        >
          {demo.alt}
        </p>
      )}
    </div>
  )
}
