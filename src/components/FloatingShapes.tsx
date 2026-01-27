import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { floatingShapes, categoryConfig } from '../config/categories'
import { RenderShape } from './CategoryShape'

export function FloatingShapes() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const shapes = containerRef.current.querySelectorAll('.floating-shape')
    const ctx = gsap.context(() => {
      shapes.forEach((shape, i) => {
        // Floating animation only - no fade in
        gsap.to(shape, {
          x: `random(-60, 60)`,
          y: `random(-40, 40)`,
          rotation: `random(-15, 15)`,
          duration: 10 + i * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, { scope: containerRef })

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {floatingShapes.map((shape, i) => (
        <div
          key={i}
          className="floating-shape absolute hidden md:block"
          style={{
            top: shape.top,
            right: shape.right,
            color: categoryConfig[shape.category]?.color,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          <RenderShape category={shape.category} size={shape.size} />
        </div>
      ))}
    </div>
  )
}
