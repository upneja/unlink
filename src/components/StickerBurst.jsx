import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const EMOJIS = ['⭐', '💜', '🦋', '✨', '🔑', '💖', '🌸', '🎉']

function Particle({ emoji, delay, x, y, rotation }) {
  return (
    <motion.div
      className="absolute text-2xl pointer-events-none"
      style={{ top: '50%', left: '50%' }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
      animate={{ x, y, opacity: 0, scale: 1.5, rotate: rotation }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    >
      {emoji}
    </motion.div>
  )
}

export default function StickerBurst({ trigger, onComplete }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        emoji: EMOJIS[i % EMOJIS.length],
        delay: i * 0.04,
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300,
        rotation: Math.random() * 720 - 360,
      }))
      setParticles(newParticles)
      const t = setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, 1200)
      return () => clearTimeout(t)
    }
  }, [trigger])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <AnimatePresence>
        {particles.map(p => (
          <Particle key={p.id} emoji={p.emoji} delay={p.delay} x={p.x} y={p.y} rotation={p.rotation} />
        ))}
      </AnimatePresence>
    </div>
  )
}
