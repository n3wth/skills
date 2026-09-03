import { NextResponse } from 'next/server'
import { skills } from '@/src/data/skills'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof skills>)

  const categoryOrder = ['development', 'documents', 'creative', 'productivity', 'business']
  
  const skillsList = categoryOrder
    .filter(cat => skillsByCategory[cat])
    .map(cat => {
      const catSkills = skillsByCategory[cat]
      return `### ${cat.charAt(0).toUpperCase() + cat.slice(1)}\n${catSkills.map(s => `- ${s.id}: ${s.description}`).join('\n')}`
    })
    .join('\n\n')

  const content = `# n3wth/skills

> AI coding assistant skills for Gemini CLI, Cursor, Windsurf, and Copilot.

Website: https://skills.n3wth.com
GitHub: https://github.com/n3wth/skills
Contact: hey@n3wth.com

## Quick Start

\`\`\`bash
npx skills add <skill-id>
\`\`\`

## Skills (${skills.length} total)

${skillsList}

## More Information

For full skill details with features, use cases, and sample prompts:
https://skills.n3wth.com/llms-full.txt
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
