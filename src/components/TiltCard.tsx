import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

interface Props {
  children: React.ReactNode
  className?: string
  intensity?: number  // 1 = gentle, 5 = aggressive
}

export function TiltCard({ children, className = "", intensity = 2 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  // Raw mouse position relative to card center, -0.5 to 0.5
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth springs so the motion isn't jerky
  const xSmooth = useSpring(x, { stiffness: 200, damping: 25 })
  const ySmooth = useSpring(y, { stiffness: 200, damping: 25 })

  // Transform to rotation (degrees)
  const rotateY = useTransform(xSmooth, [-0.5, 0.5], [-intensity, intensity])
  const rotateX = useTransform(ySmooth, [-0.5, 0.5], [intensity, -intensity])

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}