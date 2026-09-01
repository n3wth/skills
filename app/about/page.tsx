import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About AI Skills - What They Are and How They Work',
  description: 'Learn what AI coding skills are, how they work with Gemini CLI, Cursor, and other assistants, and when to use them vs MCP servers for your development workflow.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About AI Skills - What They Are and How They Work | skills.n3wth.com',
    description: 'Learn what AI coding skills are, how they work with Gemini CLI, Cursor, and other assistants, and when to use them vs MCP servers for your development workflow.',
    url: 'https://skills.n3wth.com/about',
  },
}

export default function AboutPage() {
  return <AboutClient />
}
