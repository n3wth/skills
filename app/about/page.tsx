import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About AI Skills - What They Are and How They Work',
  description: 'Learn what AI coding skills are, how they work with Claude Code and other assistants, and when to use them vs MCP servers for your development workflow.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About AI Skills - What They Are and How They Work | newth.ai',
    description: 'Learn what AI coding skills are, how they work with Claude Code and other assistants, and when to use them vs MCP servers for your development workflow.',
    url: 'https://skills.newth.ai/about',
    images: ['/og-image.png'],
  },
}

export default function AboutPage() {
  return <AboutClient />
}
