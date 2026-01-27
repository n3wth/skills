# v0 / Lovable Design Prompt

Copy and paste this prompt into v0.dev or lovable.dev to generate alternative design concepts:

---

## Prompt

Build a modern skills showcase website for "Claude Code Skills" - a collection of AI-powered development extensions.

### Requirements

**Hero Section:**
- Large animated headline: "Claude Code Skills"
- Tagline: "Extend Claude Code with specialized capabilities"
- Abstract gradient background with subtle motion (CSS or canvas)
- Floating geometric shapes or particles

**Skills Grid:**
- 18 skill cards in a responsive grid (1/2/3 columns)
- Each card shows: icon, name, description, category tags
- Hover effects with glow/lift
- Category filter pills at top (All, Development, Documents, Creative, Business)

**Design Direction Options:**

1. **Bento Grid Style** - Asymmetric card sizes, some skills span 2 columns, glassmorphism effects
2. **Terminal/Hacker Aesthetic** - Monospace fonts, green-on-black, typing animations, scanlines
3. **Apple-inspired Minimal** - Lots of whitespace, SF Pro fonts, subtle shadows, smooth scrolling
4. **Notion-like** - Clean cards, soft borders, emoji icons, light mode default
5. **Vercel/Linear Dark** - Dark purple/blue gradients, crisp typography, animated borders

**Required Animations:**
- Staggered card entrance on scroll
- Smooth category filter transitions
- Hover state micro-interactions
- Hero text reveal animation

**Data Structure:**
```typescript
interface Skill {
  id: string
  name: string
  description: string
  category: 'development' | 'documents' | 'creative' | 'business'
  tags: string[]
  featured?: boolean
  icon: string
  color: string
}
```

**Sample Skills:**
- GSAP Animations (development) - Create scroll effects, text animations
- MCP Builder (development) - Build MCP servers for LLM integrations
- Algorithmic Art (creative) - Generative art with p5.js
- PDF Toolkit (documents) - Extract, create, merge PDFs
- Business Panel (business) - Multi-expert strategy analysis

**Tech Stack:**
- React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion or GSAP
- Vite

**Color Palette Suggestions:**
- Dark mode: #0a0a0f background, mint green accent (#4ade80), amber secondary (#fbbf24)
- Light mode: #fafafa background, indigo accent (#6366f1), coral secondary (#f97316)

Generate a complete, production-ready implementation with beautiful animations and thoughtful micro-interactions.

---

## Alternative Shorter Prompt (for quick iterations)

"Create a dark-themed skills showcase for Claude Code extensions. Bento grid layout with 18 cards, glassmorphism, GSAP scroll animations, category filters. Hero with gradient text and floating shapes. React + Tailwind + TypeScript. Make it feel premium like Linear or Vercel's marketing sites."
