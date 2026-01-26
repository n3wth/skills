import { useRef, useState, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { skills, categories, type Skill } from './data/skills'

gsap.registerPlugin(ScrollTrigger)

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!cardRef.current) return

    gsap.from(cardRef.current, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.05,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
      }
    })
  }, [index])

  return (
    <div
      ref={cardRef}
      className="card-glow group relative overflow-hidden rounded-2xl p-6 cursor-pointer"
      style={{ background: 'var(--color-surface-elevated)' }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 0%, ${skill.color}, transparent 70%)` }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <span
            className="text-2xl font-light"
            style={{ color: skill.color }}
          >
            {skill.icon}
          </span>
          {skill.featured && (
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--color-surface-hover)', color: 'var(--color-text-muted)' }}>
              Featured
            </span>
          )}
        </div>

        <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-text)' }}>
          {skill.name}
        </h3>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-muted)' }}>
          {skill.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {skill.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-md"
              style={{ background: 'var(--color-surface-hover)', color: 'var(--color-text-subtle)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline()

    tl.from(titleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out'
    })
    .from(subtitleRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6')
  }, { scope: heroRef })

  return (
    <div ref={heroRef} className="relative min-h-[60vh] flex items-center justify-center px-6 py-24">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20"
          style={{ background: 'var(--color-brand)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px] opacity-15"
          style={{ background: 'var(--color-accent)' }}
        />
      </div>

      <div className="relative z-10 text-center max-w-3xl">
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl font-semibold tracking-tight mb-6"
        >
          <span className="gradient-text">Claude Code</span>
          <br />
          <span style={{ color: 'var(--color-text)' }}>Skills</span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl leading-relaxed"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Extend Claude Code with specialized capabilities.
          <br />
          Skills add domain knowledge, workflows, and tool integrations.
        </p>
      </div>
    </div>
  )
}

function CategoryFilter({
  activeCategory,
  onCategoryChange
}: {
  activeCategory: string
  onCategoryChange: (id: string) => void
}) {
  const filterRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from(filterRef.current?.children || [], {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.out',
      delay: 0.8
    })
  }, { scope: filterRef })

  return (
    <div ref={filterRef} className="flex flex-wrap justify-center gap-3 mb-12">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
          style={{
            background: activeCategory === cat.id ? 'var(--color-brand)' : 'var(--color-surface-elevated)',
            color: activeCategory === cat.id ? 'var(--color-surface)' : 'var(--color-text-muted)'
          }}
        >
          {cat.name}
          <span className="ml-2 opacity-60">{cat.count}</span>
        </button>
      ))}
    </div>
  )
}

function Footer() {
  return (
    <footer className="py-16 px-6 text-center" style={{ borderTop: '1px solid var(--color-surface-elevated)' }}>
      <p className="text-sm" style={{ color: 'var(--color-text-subtle)' }}>
        Built by{' '}
        <a
          href="https://newth.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Oliver Newth
        </a>
        {' '}for the Claude Code community
      </p>
    </footer>
  )
}

function App() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredSkills = activeCategory === 'all'
    ? skills
    : skills.filter(s => s.category === activeCategory)

  useLayoutEffect(() => {
    ScrollTrigger.refresh()
  }, [activeCategory])

  return (
    <div className="min-h-screen">
      <div className="noise-overlay" />

      <Hero />

      <main className="max-w-6xl mx-auto px-6 pb-24">
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, i) => (
            <SkillCard key={skill.id} skill={skill} index={i} />
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-24" style={{ color: 'var(--color-text-muted)' }}>
            No skills in this category yet.
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App
