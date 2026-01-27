---
name: Cursor Code Review Assistant
version: 1.0.0
author: Community Contributor
category: development
tags:
  - code-review
  - quality
  - standards
  - cursor
  - ai-rules
compatibility:
  - claude
  - cursor
---

# Cursor Code Review Assistant

Review generated code and suggest rule improvements based on output quality. Ensure generated code meets team standards and improve AI rules continuously.

## Triggers

Use this skill when the user requests:
- Reviewing generated code before commit
- Checking code against team standards
- Suggesting improvements to Cursor rules
- Tracking code quality from AI generation
- Auditing AI-generated code quality

Keywords: "code review", "review code", "check standards", "cursor rules", "ai rules", "code quality", "quality check", "review generated code"

## Features

- **Pre-commit Code Review**: Review code before committing to catch issues early
- **Team Standards Validation**: Check generated code against team coding standards
- **AI Rule Improvement Suggestions**: Analyze output quality and suggest rule enhancements
- **Quality Tracking**: Track and measure code quality from AI generation
- **Pattern Detection**: Identify recurring issues in generated code

## Pre-commit Code Review Workflow

### Step 1: Review Staged Changes

```bash
# Check what files are staged
git diff --cached --name-only

# Review specific file changes
git diff --cached path/to/file.ts
```

### Step 2: Code Review Checklist

Use this checklist when reviewing AI-generated code:

**Code Quality**
- [ ] Code follows team coding standards and conventions
- [ ] Variable and function names are descriptive and meaningful
- [ ] Code is properly formatted (linting passes)
- [ ] No unnecessary complexity or over-engineering
- [ ] Error handling is present and appropriate

**Functionality**
- [ ] Code accomplishes the intended task
- [ ] Edge cases are handled
- [ ] No obvious bugs or logic errors
- [ ] Input validation is present where needed
- [ ] Returns expected outputs for given inputs

**Testing**
- [ ] Existing tests still pass
- [ ] New functionality has test coverage
- [ ] Tests are meaningful and test actual behavior
- [ ] Mock data is realistic

**Security**
- [ ] No hardcoded credentials or secrets
- [ ] Input sanitization is present
- [ ] No SQL injection vulnerabilities
- [ ] Proper authentication/authorization checks
- [ ] Sensitive data is properly handled

**Performance**
- [ ] No obvious performance bottlenecks
- [ ] Efficient algorithms and data structures
- [ ] Proper resource cleanup (connections, files, etc.)
- [ ] Database queries are optimized

**Documentation**
- [ ] Complex logic has explanatory comments
- [ ] Public APIs are documented
- [ ] README is updated if needed
- [ ] Type definitions are clear (TypeScript)

## Team Standards Validation

### Define Your Standards

Create a `.cursor/standards.md` file in your project:

```markdown
# Team Coding Standards

## TypeScript
- Always use strict mode
- Prefer `interface` over `type` for object shapes
- Use descriptive names, no single-letter variables (except loop counters)
- All functions must have return type annotations

## React
- Use functional components with hooks
- Keep components under 200 lines
- Extract complex logic to custom hooks
- Use TypeScript for prop types

## Testing
- Minimum 80% code coverage
- Test file naming: `*.test.ts` or `*.spec.ts`
- Use descriptive test names: "should do X when Y"
- Mock external dependencies

## Git
- Conventional commits: `type(scope): message`
- Meaningful commit messages
- No commits to main branch directly
- PR must be reviewed before merge
```

### Automated Standards Check

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "🔍 Running code standards check..."

# Run linter
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed - fix issues before committing"
  exit 1
fi

# Run type check
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type checking failed - fix type errors before committing"
  exit 1
fi

# Run tests
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed - fix failing tests before committing"
  exit 1
fi

# Check for TODO/FIXME comments in staged files
TODOS=$(git diff --cached | grep -E "^\+.*TODO|FIXME" | wc -l)
if [ $TODOS -gt 0 ]; then
  echo "⚠️  Warning: Found $TODOS TODO/FIXME comments in staged changes"
  read -p "Continue with commit? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

echo "✅ All checks passed!"
```

## AI Rule Improvement Suggestions

### Analyze Generated Code Quality

When reviewing AI-generated code, identify patterns:

1. **Common Issues**:
   - Missing error handling
   - Overly complex solutions
   - Incomplete type definitions
   - Missing edge case handling
   - Poor naming conventions

2. **Rule Improvement Template**:

```markdown
## Issue Identified
AI generated code with [specific problem]

## Example
\```typescript
// Generated code
function getData() {
  const response = fetch('/api/data')
  return response.json()
}
\```

## Problem
Missing:
- Error handling
- Type definitions
- Async/await usage
- Loading states

## Suggested Cursor Rule Addition
\```markdown
When creating API calls:
- Always use async/await with try/catch
- Include proper TypeScript types for request/response
- Handle loading, error, and success states
- Validate response data before using
\```

## Improved Code
\```typescript
interface ApiResponse {
  data: DataType[]
  error?: string
}

async function getData(): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`)
    }
    const data: ApiResponse = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch data:', error)
    return { data: [], error: error.message }
  }
}
\```
```

### Iterative Rule Refinement

1. **Track Issues**: Keep a log of recurring problems
2. **Update Rules**: Add specific instructions to `.cursorrules` or `.ai/rules.md`
3. **Test Changes**: Generate similar code and verify improvements
4. **Measure Impact**: Track reduction in review findings

## Code Quality Tracking

### Quality Metrics

Track these metrics over time:

```typescript
interface CodeQualityMetrics {
  timestamp: Date
  filesChanged: number
  linesAdded: number
  linesRemoved: number
  
  // Review findings
  criticalIssues: number
  standardViolations: number
  securityIssues: number
  performanceIssues: number
  
  // Test coverage
  testCoverage: number
  testsAdded: number
  testsPassing: number
  
  // AI generation stats
  aiGeneratedLines: number
  aiGeneratedFiles: string[]
  reviewTimeMinutes: number
}
```

### Quality Dashboard Script

```typescript
// scripts/quality-tracker.ts
import fs from 'fs'
import { execSync } from 'child_process'

interface ReviewSession {
  date: string
  filesReviewed: number
  issuesFound: number
  timeSpent: number
}

function trackReviewSession(session: ReviewSession) {
  const logFile = '.quality-log.json'
  const existingData = fs.existsSync(logFile)
    ? JSON.parse(fs.readFileSync(logFile, 'utf-8'))
    : []
  
  existingData.push(session)
  fs.writeFileSync(logFile, JSON.stringify(existingData, null, 2))
}

function generateReport() {
  const logFile = '.quality-log.json'
  if (!fs.existsSync(logFile)) {
    console.log('No quality data found')
    return
  }
  
  const sessions: ReviewSession[] = JSON.parse(fs.readFileSync(logFile, 'utf-8'))
  
  const totalReviews = sessions.length
  const totalIssues = sessions.reduce((sum, s) => sum + s.issuesFound, 0)
  const avgIssuesPerReview = totalIssues / totalReviews
  
  console.log('📊 Code Quality Report')
  console.log('─'.repeat(40))
  console.log(`Total reviews: ${totalReviews}`)
  console.log(`Total issues found: ${totalIssues}`)
  console.log(`Average issues per review: ${avgIssuesPerReview.toFixed(2)}`)
  console.log(`Trend: ${getTrend(sessions)}`)
}

function getTrend(sessions: ReviewSession[]): string {
  if (sessions.length < 2) return 'Insufficient data'
  
  const recent = sessions.slice(-5)
  const older = sessions.slice(-10, -5)
  
  const recentAvg = recent.reduce((sum, s) => sum + s.issuesFound, 0) / recent.length
  const olderAvg = older.reduce((sum, s) => sum + s.issuesFound, 0) / older.length
  
  if (recentAvg < olderAvg) return '✅ Improving'
  if (recentAvg > olderAvg) return '⚠️ Declining'
  return '➡️ Stable'
}

// Example usage
trackReviewSession({
  date: new Date().toISOString(),
  filesReviewed: 5,
  issuesFound: 3,
  timeSpent: 15
})

generateReport()
```

## Integration with Cursor

### .cursorrules File

Add these rules to improve code generation quality:

```markdown
# Code Review Rules for Cursor

## General Principles
- Generate production-ready code that passes team standards
- Include comprehensive error handling
- Add TypeScript types for all functions and variables
- Follow team coding conventions in .cursor/standards.md

## Before Generating Code
1. Ask about specific requirements and constraints
2. Clarify edge cases and error scenarios
3. Confirm testing requirements
4. Verify any dependencies or integrations

## Code Generation Standards
- Add JSDoc comments for public functions
- Include error handling with try/catch or proper error returns
- Validate all inputs
- Use meaningful variable names (no single letters except loop counters)
- Keep functions focused and under 50 lines when possible

## After Generating Code
- Suggest relevant tests to write
- Note any assumptions made
- Highlight areas that may need review
- Recommend related documentation updates
```

### Review Generated Code Automatically

```typescript
// .cursor/post-generate-hook.ts
import { execSync } from 'child_process'

function reviewGeneratedCode(files: string[]) {
  console.log('🤖 Reviewing generated code...')
  
  // Run linter
  try {
    execSync('npm run lint', { stdio: 'inherit' })
    console.log('✅ Linting passed')
  } catch (error) {
    console.log('❌ Linting failed - please fix issues')
    process.exit(1)
  }
  
  // Run type check
  try {
    execSync('npm run type-check', { stdio: 'inherit' })
    console.log('✅ Type check passed')
  } catch (error) {
    console.log('❌ Type check failed - please fix type errors')
    process.exit(1)
  }
  
  // Run affected tests
  try {
    execSync('npm test -- --related', { stdio: 'inherit' })
    console.log('✅ Tests passed')
  } catch (error) {
    console.log('⚠️ Tests failed - review failures')
  }
}
```

## Best Practices

1. **Review in Context**: Understand the full change, not just individual lines
2. **Be Constructive**: Focus on improvement, not criticism
3. **Document Patterns**: Track recurring issues to improve AI rules
4. **Iterate Quickly**: Review small changes frequently rather than large batches
5. **Automate Checks**: Use linters, type checkers, and tests to catch common issues
6. **Share Learnings**: Update team standards and AI rules based on findings
7. **Measure Progress**: Track quality metrics over time to validate improvements

## Example Review Session

```markdown
## Review Session: Feature/User Authentication

**Date**: 2026-01-27
**Files Changed**: 4
**Lines Added**: 156

### Issues Found

1. **Security** (Critical)
   - File: `auth.ts`
   - Issue: Password stored in plain text
   - Fix: Use bcrypt for password hashing
   - Rule update: "Always hash passwords using bcrypt with salt rounds >= 10"

2. **Type Safety** (High)
   - File: `user.model.ts`
   - Issue: Missing null checks on optional fields
   - Fix: Add proper null guards
   - Rule update: "Always validate optional fields before use"

3. **Testing** (Medium)
   - File: `auth.test.ts`
   - Issue: Missing edge case tests for invalid inputs
   - Fix: Add tests for empty string, special characters
   - Rule update: "Include edge case tests for all user inputs"

### Time Spent
- Review: 20 minutes
- Fixes: 15 minutes

### Outcome
✅ All issues resolved
✅ Tests passing
✅ Ready for commit
```

## Dependencies

No additional dependencies required. Works with standard development tools:

```bash
# Recommended but not required
npm install -D eslint prettier typescript
```

## Advanced: Custom Review Checklist

Create a custom checklist for your team:

```typescript
// .cursor/review-checklist.ts
export interface ReviewItem {
  category: 'security' | 'performance' | 'style' | 'testing'
  severity: 'critical' | 'high' | 'medium' | 'low'
  question: string
  autoCheck?: () => boolean
}

export const reviewChecklist: ReviewItem[] = [
  {
    category: 'security',
    severity: 'critical',
    question: 'Are there any hardcoded secrets or API keys?',
    autoCheck: () => {
      // Regex check for common secret patterns
      const hasSecrets = /API_KEY|SECRET|PASSWORD|TOKEN/.test(
        fs.readFileSync('file', 'utf-8')
      )
      return !hasSecrets
    }
  },
  {
    category: 'testing',
    severity: 'high',
    question: 'Do all new functions have unit tests?'
  },
  {
    category: 'performance',
    severity: 'medium',
    question: 'Are database queries optimized with proper indexes?'
  },
  {
    category: 'style',
    severity: 'low',
    question: 'Does the code follow team naming conventions?'
  }
]
```
