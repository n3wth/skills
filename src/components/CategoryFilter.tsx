import { categories } from '../data/skills'
import { CategoryShape } from './CategoryShape'

interface CategoryFilterProps {
  activeCategory: string
  onCategoryChange: (id: string) => void
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div 
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter skills by category"
    >
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`glass-pill px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium flex items-center gap-2 ${
            activeCategory === cat.id ? 'active' : ''
          }`}
          aria-pressed={activeCategory === cat.id}
          aria-label={`Filter by ${cat.name}${activeCategory === cat.id ? ' (currently selected)' : ''}`}
        >
          {cat.id !== 'all' && <CategoryShape category={cat.id} size={10} aria-hidden={true} />}
          {cat.name}
        </button>
      ))}
    </div>
  )
}
