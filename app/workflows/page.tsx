import type { Metadata } from 'next'
import { WorkflowsClient } from './WorkflowsClient'

export const metadata: Metadata = {
  title: 'Skill Workflows - Chain AI Capabilities Together',
  description: 'Create and share skill workflows that chain multiple AI capabilities together. Combine research, writing, and document creation into powerful automated sequences.',
  alternates: { canonical: '/workflows' },
  openGraph: {
    title: 'Skill Workflows - Chain AI Capabilities Together | newth.ai',
    description: 'Create and share skill workflows that chain multiple AI capabilities together. Combine research, writing, and document creation into powerful automated sequences.',
    url: 'https://skills.newth.ai/workflows',
    images: ['/og-image.png'],
  },
}

export default function WorkflowsPage() {
  return <WorkflowsClient />
}
