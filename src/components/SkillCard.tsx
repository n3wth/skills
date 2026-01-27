import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { type Skill } from '../data/skills'
import { CategoryShape } from './CategoryShape'
import { getCopyCount } from '../lib/analytics'

interface SkillCardProps {
  skill: Skill
  isSelected?: boolean
  showPopularity?: boolean
  showContributor?: boolean
}

function isRecentlyUpdated(lastUpdated: string): boolean {
  const updateDate = new Date(lastUpdated)
  const now = new Date()
  const daysDiff = Math.floor((now.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24))
  return daysDiff <= 30
}

export const SkillCard = forwardRef<HTMLAnchorElement, SkillCardProps>(
  function SkillCard({ skill, isSelected = false, showPopularity = false, showContributor = true }, ref) {
    const copyCount = showPopularity ? getCopyCount(skill.id) : 0
    const isNew = isRecentlyUpdated(skill.lastUpdated)

    return (
      <Link
        ref={ref}
        to={`/skill/${skill.id}`}
        className={`skill-card glass-card group cursor-pointer p-5 md:p-6 block ${isSelected ? 'ring-2 ring-white/40' : ''}`}
        aria-current={isSelected ? 'true' : undefined}
      >
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2">
            <CategoryShape category={skill.category} size={12} />
            {isNew && (
              <span 
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ 
                  color: '#22c55e',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}
              >
                New
              </span>
            )}
          </div>
          {showPopularity && copyCount > 0 && (
            <span 
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ 
                color: 'var(--color-grey-300)',
                backgroundColor: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)'
              }}
            >
              {copyCount} {copyCount === 1 ? 'install' : 'installs'}
            </span>
          )}
        </div>

        <h3 className="text-sm md:text-base font-semibold mb-2 text-white group-hover:opacity-70 transition-opacity">
          {skill.name}
        </h3>

        <p
          className="text-xs md:text-sm leading-relaxed mb-3 md:mb-4"
          style={{ color: 'var(--color-grey-200)' }}
        >
          {skill.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {skill.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-[9px] md:text-[10px] uppercase tracking-wider"
              style={{ color: 'var(--color-grey-400)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {showContributor && skill.contributor && (
          <div 
            className="flex items-center gap-2 pt-3 mt-auto"
            style={{ borderTop: '1px solid var(--glass-border)' }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: 'var(--color-grey-500)' }}
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span
              className="text-[10px]"
              style={{ color: 'var(--color-grey-400)' }}
            >
              by {skill.contributor.name}
            </span>
          </div>
        )}
      </Link>
    )
  }
)
