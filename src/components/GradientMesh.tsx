import { motion } from "framer-motion"

export function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
      {/* Top-left cyan blob */}
      <motion.div
        className="absolute w-[50vw] h-[50vw] rounded-full blur-3xl opacity-40 dark:opacity-30"
        style={{
          background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)",
          top: "-10%",
          left: "-10%",
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, 40, -20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom-right mint blob */}
      <motion.div
        className="absolute w-[45vw] h-[45vw] rounded-full blur-3xl opacity-30 dark:opacity-25"
        style={{
          background: "radial-gradient(circle, #34d399 0%, transparent 70%)",
          bottom: "-15%",
          right: "-10%",
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, -30, 20, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Center top blue blob (subtle) */}
      <motion.div
        className="absolute w-[35vw] h-[35vw] rounded-full blur-3xl opacity-25 dark:opacity-20"
        style={{
          background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
          top: "20%",
          left: "35%",
        }}
        animate={{
          x: [0, 30, -40, 0],
          y: [0, 50, 30, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}