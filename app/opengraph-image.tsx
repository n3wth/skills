import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'n3wth/skills'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          gap: 48,
        }}
      >
        {/* n3wth mark - green triangle */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 32 32"
          style={{ marginBottom: 16 }}
        >
          <path d="M16 4L28 26H4L16 4Z" fill="#30d158" />
        </svg>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}
        >
          n3wth/skills
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
