import { NextResponse } from 'next/server'

const ORIGINAL_SKILLS = [
  'ai-rules-manager',
  'code-generation-pipeline',
  'codebase-context-builder',
  'cursor-agent-orchestrator',
  'cursor-code-review',
  'cursor-driven-refactoring',
  'cursor-git-workflow',
  'cursor-linear-bridge',
  'cursor-project-bootstrapper',
  'cursor-project-scanner',
  'cursor-rules-generator',
  'cursor-usage-analytics',
  'extension-sync',
  'git-workflow',
  'monorepo-manager',
  'settings-distribution-manager',
  'vscode-cursor-sync',
  'gsap-animations',
  'typography-selector',
  'business-panel',
  'imessage',
]

export async function GET() {
  const skillsList = ORIGINAL_SKILLS.map(id => `- ${id}`).join('\n')

  const content = `# n3wth/skills

AI coding assistant skills for Claude Code, Gemini CLI, Cursor, Windsurf, and Copilot.

## Install

\`\`\`bash
npx skills add n3wth/skills
\`\`\`

Or install individual skills:

\`\`\`bash
curl -fsSL https://skills.n3wth.com/install.sh | bash -s -- <skill-id>
\`\`\`

## Original Skills

${skillsList}

## Source

- Website: https://skills.n3wth.com
- GitHub: https://github.com/n3wth/skills

## Categories

- Development: Cursor workflows, code analysis, Git automation, CI/CD
- Creative: GSAP animations, typography
- Business: Strategy panels, iMessage automation
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
