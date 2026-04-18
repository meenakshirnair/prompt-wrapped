import { useEffect, useRef, useState } from "react"
import { motion, useInView, useMotionValue, animate } from "framer-motion"

interface Props {
  value: number
  format?: (n: number) => string
  duration?: number
}

export function AnimatedNumber({ value, format = (n) => Math.round(n).toLocaleString(), duration = 1.5 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px" })
  const motionValue = useMotionValue(0)
  const [display, setDisplay] = useState("0")

  useEffect(() => {
    if (!inView) return
    const controls = animate(motionValue, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(format(latest)),
    })
    return controls.stop
  }, [inView, value, duration, format, motionValue])

  return (
    <motion.span ref={ref}>
      {display}
    </motion.span>
  )
}