import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'AI Skills Directory - Claude Code Skills and Templates',
  description: 'Discover and install AI coding skills for Claude Code and other assistants. Browse community-built templates, workflows, and best practices to supercharge your development.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'AI Skills Directory - Claude Code Skills and Templates | newth.ai',
    description: 'Discover and install AI coding skills for Claude Code and other assistants. Browse community-built templates, workflows, and best practices to supercharge your development.',
    url: 'https://skills.newth.ai',
    images: ['/og-image.png'],
  },
}

export default function Home() {
  return <HomeClient />
}
