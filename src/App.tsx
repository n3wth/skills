import { useRef, useState, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { skills, categories, type Skill } from './data/skills'

gsap.registerPlugin(ScrollTrigger)

const categoryConfig: Record<string, { color: string; glow: string; shape: 'circle' | 'square' | 'triangle' | 'diamond' }> = {
  development: { color: '#30d158', glow: 'rgba(48, 209, 88, 0.3)', shape: 'circle' },
  documents: { color: '#ff6961', glow: 'rgba(255, 105, 97, 0.3)', shape: 'square' },
  creative: { color: '#64d2ff', glow: 'rgba(100, 210, 255, 0.3)', shape: 'triangle' },
  business: { color: '#ffd60a', glow: 'rgba(255, 214, 10, 0.3)', shape: 'diamond' },
}

function CategoryShape({ category, size = 12 }: { category: string; size?: number }) {
  const config = categoryConfig[category] || categoryConfig.development

  const shapes = {
    circle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={config.color} />
      </svg>
    ),
    square: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="0" fill={config.color} />
      </svg>
    ),
    triangle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 3L22 21H2L12 3Z" fill={config.color} />
      </svg>
    ),
    diamond: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L22 12L12 22L2 12L12 2Z" fill={config.color} />
      </svg>
    ),
  }

  return (
    <div style={{ filter: `drop-shadow(0 0 8px ${config.glow})` }}>
      {shapes[config.shape]}
    </div>
  )
}

function FloatingShapes() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const shapes = containerRef.current.querySelectorAll('.floating-shape')

    shapes.forEach((shape, i) => {
      // Randomize entrance timing for organic feel
      const entranceDelay = 0.3 + (i * 0.25) + (Math.random() * 0.3)

      // Initial state - scattered and invisible
      gsap.set(shape, {
        opacity: 0,
        scale: 0,
        rotation: Math.random() * 180 - 90,
        y: 50 + Math.random() * 30,
      })

      // Entrance animation - bounce in with varied stagger
      gsap.to(shape, {
        opacity: 1,
        scale: 1,
        rotation: Math.random() * 10 - 5,
        y: 0,
        duration: 1 + Math.random() * 0.5,
        delay: entranceDelay,
        ease: 'elastic.out(1, 0.5)',
      })

      // Continuous floating movement
      gsap.to(shape, {
        x: `random(-100, 100)`,
        y: `random(-80, 80)`,
        duration: `random(8, 14)`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.2,
      })

      // Rotation wobble
      gsap.to(shape, {
        rotation: `random(-30, 30)`,
        duration: `random(5, 9)`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.3,
      })

      // Scale breathing
      gsap.to(shape, {
        scale: `random(0.8, 1.2)`,
        duration: `random(4, 7)`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.1,
      })
    })
  }, { scope: containerRef })

  const floatingShapes = [
    { category: 'development', size: 180, top: '15%', right: '5%' },
    { category: 'documents', size: 120, top: '55%', right: '12%' },
    { category: 'creative', size: 150, top: '20%', right: '22%' },
    { category: 'business', size: 100, top: '70%', right: '3%' },
    { category: 'development', size: 70, top: '80%', right: '30%' },
    { category: 'creative', size: 90, top: '40%', right: '35%' },
    { category: 'business', size: 60, top: '10%', right: '42%' },
    { category: 'documents', size: 50, top: '85%', right: '18%' },
  ]

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ top: '60px' }}>
      {floatingShapes.map((shape, i) => {
        const config = categoryConfig[shape.category]
        return (
          <div
            key={i}
            className="floating-shape absolute hidden md:block"
            style={{ top: shape.top, right: shape.right }}
          >
            {config.shape === 'circle' && (
              <svg width={shape.size} height={shape.size} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill={config.color} />
              </svg>
            )}
            {config.shape === 'square' && (
              <svg width={shape.size} height={shape.size} viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="0" fill={config.color} />
              </svg>
            )}
            {config.shape === 'triangle' && (
              <svg width={shape.size} height={shape.size} viewBox="0 0 24 24" fill="none">
                <path d="M12 3L22 21H2L12 3Z" fill={config.color} />
              </svg>
            )}
            {config.shape === 'diamond' && (
              <svg width={shape.size} height={shape.size} viewBox="0 0 24 24" fill="none">
                <path d="M12 2L22 12L12 22L2 12L12 2Z" fill={config.color} />
              </svg>
            )}
          </div>
        )
      })}
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`copy-btn label px-3 py-1.5 rounded-lg ${copied ? 'copied' : ''}`}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function InstallSection() {

  const commands = [
    {
      name: 'Gemini CLI',
      command: 'curl -fsSL https://skills.newth.ai/install.sh | bash -s -- gemini',
      primary: true,
    },
    {
      name: 'Claude Code',
      command: 'curl -fsSL https://skills.newth.ai/install.sh | bash -s -- claude',
      primary: false,
    },
    {
      name: 'All Skills',
      command: 'curl -fsSL https://skills.newth.ai/install.sh | bash',
      primary: false,
    },
  ]

  return (
    <div className="mb-16 md:mb-24">
      <h2 className="text-xl md:text-2xl font-medium mb-2 text-white">
        Install
      </h2>
      <p className="label mb-6 md:mb-8">One command. All skills.</p>

      <div className="space-y-3">
        {commands.map((cmd) => (
          <div
            key={cmd.name}
            className={`command-box flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 ${cmd.primary ? 'primary' : ''}`}
          >
            <span
              className="label shrink-0 sm:w-24"
              style={{ color: cmd.primary ? 'var(--color-accent)' : 'var(--color-grey-400)' }}
            >
              {cmd.name}
            </span>
            <code
              className="flex-1 text-xs sm:text-sm overflow-x-auto whitespace-nowrap"
              style={{ color: 'var(--color-grey-200)' }}
            >
              {cmd.command}
            </code>
            <CopyButton text={cmd.command} />
          </div>
        ))}
      </div>
    </div>
  )
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  return (
    <div className="glass-card group cursor-pointer p-5 md:p-6">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <CategoryShape category={skill.category} size={12} />
        <span className="index-num">
          {String(index + 1).padStart(2, '0')}
        </span>
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

      <div className="flex flex-wrap gap-2">
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
    </div>
  )
}

function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!titleRef.current || !contentRef.current) return

    const words = titleRef.current.querySelectorAll('.hero-word')
    const content = contentRef.current

    gsap.set(words, { y: 100, opacity: 0, rotationX: -40 })
    gsap.set(content, { y: 40, opacity: 0 })

    const tl = gsap.timeline()

    tl.to(words, {
      y: 0,
      opacity: 1,
      rotationX: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
    })
    .to(content, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.4')

  }, { scope: heroRef })

  return (
    <div ref={heroRef} className="relative h-screen flex items-center px-6 md:px-12 pt-14">
      <FloatingShapes />
      <div className="relative z-10 w-full">
        <div className="max-w-5xl">
          <h1
            ref={titleRef}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] font-semibold tracking-tighter leading-[0.85] mb-6 md:mb-8"
            style={{ perspective: '1000px' }}
          >
            <span className="hero-word inline-block text-white">Extend</span>
            <br />
            <span className="hero-word inline-block text-white">Your AI</span>
          </h1>

          <div ref={contentRef} className="flex flex-col gap-6 md:gap-8">
            <p
              className="text-base md:text-xl leading-relaxed max-w-md"
              style={{ color: 'var(--color-grey-200)' }}
            >
              Skills for Gemini CLI, Claude Code, and other AI assistants. Install with one command.
            </p>

            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {Object.entries(categoryConfig).map(([key]) => (
                <div key={key} className="flex items-center gap-2">
                  <CategoryShape category={key} size={14} />
                  <span className="label capitalize text-[10px] md:text-[11px]">{key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
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
  return (
    <div className="flex flex-wrap gap-2 mb-8 md:mb-10">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`glass-pill px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium flex items-center gap-2 ${
            activeCategory === cat.id ? 'active' : ''
          }`}
        >
          {cat.id !== 'all' && <CategoryShape category={cat.id} size={10} />}
          {cat.name}
        </button>
      ))}
    </div>
  )
}

function Nav() {
  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-3 md:py-4 flex items-center justify-between">
      <div
        className="text-base md:text-lg font-semibold"
        style={{ color: 'var(--color-accent)' }}
      >
        skills.newth.ai
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <a
          href="https://newth.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm link-hover"
          style={{ color: 'var(--color-grey-400)' }}
        >
          About
        </a>
        <a
          href="https://github.com/n3wth/newth-skills"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm link-hover"
          style={{ color: 'var(--color-grey-400)' }}
        >
          GitHub
        </a>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="py-12 md:py-20 px-6 md:px-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="text-lg md:text-xl font-semibold text-white mb-2">
            skills.newth.ai
          </p>
          <p className="text-sm" style={{ color: 'var(--color-grey-400)' }}>
            Built by Oliver Newth
          </p>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://newth.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm link-hover"
            style={{ color: 'var(--color-grey-400)' }}
          >
            About
          </a>
          <a
            href="https://github.com/n3wth/newth-skills"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm link-hover"
            style={{ color: 'var(--color-grey-400)' }}
          >
            GitHub
          </a>
          <span className="text-sm" style={{ color: 'var(--color-grey-600)' }}>
            {new Date().getFullYear()}
          </span>
        </div>
      </div>
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
    <div className="min-h-screen relative">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      <Nav />
      <Hero />

      <main className="px-6 md:px-12 pb-24">
        <InstallSection />

        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-medium mb-2 text-white">
            Browse Skills
          </h2>
          <p className="label">
            {skills.length} skills across {categories.length - 1} categories
          </p>
        </div>

        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill, i) => (
            <SkillCard key={skill.id} skill={skill} index={i} />
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-24 label">
            No skills in this category yet.
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default App
