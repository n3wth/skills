import { Link } from 'react-router-dom'
import { skills } from '../data/skills'
import type { Bundle } from '../data/bundles'

interface BundleCardProps {
  bundle: Bundle
  index?: number
}

const personaColors: Record<string, string> = {
  frontend: 'var(--color-sage)',
  backend: 'var(--color-coral)',
  devops: 'var(--color-sky)',
  creator: 'var(--color-gold)',
  analyst: 'var(--color-sage)',
  founder: 'var(--color-coral)',
}

function BundleIcon({ persona }: { persona: string }) {
  const color = personaColors[persona] || 'var(--color-grey-400)'

  // Different shapes for different personas
  switch (persona) {
    case 'frontend':
      return <div className="w-10 h-10 rounded-full" style={{ backgroundColor: color, opacity: 0.8 }} />
    case 'backend':
      return <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: color, opacity: 0.8 }} />
    case 'devops':
      return (
        <svg className="w-10 h-10" viewBox="0 0 40 40">
          <polygon points="20,4 36,36 4,36" fill={color} opacity={0.8} />
        </svg>
      )
    case 'creator':
      return (
        <svg className="w-10 h-10" viewBox="0 0 40 40">
          <polygon points="20,2 38,20 20,38 2,20" fill={color} opacity={0.8} />
        </svg>
      )
    case 'analyst':
      return <div className="w-10 h-10 rounded-full" style={{ backgroundColor: color, opacity: 0.8 }} />
    case 'founder':
      return <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: color, opacity: 0.8 }} />
    default:
      return <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: color, opacity: 0.8 }} />
  }
}

export function BundleCard({ bundle, index = 0 }: BundleCardProps) {
  const bundleSkills = bundle.skillIds
    .map(id => skills.find(s => s.id === id))
    .filter(Boolean)

  const difficultyColor = {
    beginner: 'text-green-400',
    intermediate: 'text-yellow-400',
    advanced: 'text-red-400',
  }

  return (
    <Link
      to={`/curated-bundles/${bundle.id}`}
      className="glass-card skill-card block p-6 card-enter hover:border-[var(--glass-highlight)] transition-all"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <BundleIcon persona={bundle.persona} />
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${difficultyColor[bundle.difficulty]} bg-opacity-10`}
          style={{
            backgroundColor: difficultyColor[bundle.difficulty].split('-')[1].includes('400')
              ? 'rgba(74, 222, 128, 0.1)'
              : difficultyColor[bundle.difficulty].split('-')[1].includes('400')
              ? 'rgba(250, 204, 21, 0.1)'
              : 'rgba(248, 113, 113, 0.1)',
          }}
        >
          {bundle.difficulty}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-[var(--color-white)] mb-2 line-clamp-2">
        {bundle.name}
      </h3>

      <p className="text-sm text-[var(--color-grey-400)] mb-4 line-clamp-2">
        {bundle.description}
      </p>

      <div className="mb-4 pb-4 border-b border-[var(--glass-border)]">
        <p className="text-xs text-[var(--color-grey-600)] mb-3">Includes {bundle.skillIds.length} skills:</p>
        <div className="flex flex-wrap gap-1.5">
          {bundleSkills.slice(0, 3).map((skill) => (
            <span
              key={skill?.id}
              className="text-xs px-2 py-0.5 rounded-full bg-[var(--glass-bg)] text-[var(--color-grey-400)] border border-[var(--glass-border)]"
            >
              {skill?.name.split(' ')[0]}
            </span>
          ))}
          {bundle.skillIds.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--glass-bg)] text-[var(--color-grey-600)]">
              +{bundle.skillIds.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--color-grey-600)]">
          {bundle.estimatedSetupTime}
        </span>
        <span className="text-xs font-medium text-[var(--color-sage)]">
          For {bundle.persona}s →
        </span>
      </div>
    </Link>
  )
}
