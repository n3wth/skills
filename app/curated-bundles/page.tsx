import type { Metadata } from 'next'
import { CuratedBundlesClient } from './CuratedBundlesClient'

export const metadata: Metadata = {
  title: 'Curated Skill Bundles for Every Role',
  description: 'Pre-built skill bundles for different roles. From frontend developers to founders - get pre-curated collections designed for your profession.',
  alternates: { canonical: '/curated-bundles' },
  openGraph: {
    title: 'Curated Skill Bundles for Every Role | newth.ai',
    description: 'Pre-built skill bundles for different roles. From frontend developers to founders - get pre-curated collections designed for your profession.',
    url: 'https://skills.newth.ai/curated-bundles',
    images: ['/og-image.png'],
  },
}

export default function CuratedBundlesPage() {
  return <CuratedBundlesClient />
}
