import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'AI Skills Directory - Claude Code Skills and Templates',
  description: 'Discover AI skills built for Claude Code and Gemini CLI. Explore community-tested workflows, templates, and best practices that ship with every install.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'AI Skills Directory - Claude Code Skills and Templates | newth.ai',
    description: 'Discover AI skills built for Claude Code and Gemini CLI. Explore community-tested workflows, templates, and best practices that ship with every install.',
    url: 'https://skills.newth.ai',
    images: ['/og-image.png'],
  },
}

export default function Home() {
  return <HomeClient />
}
