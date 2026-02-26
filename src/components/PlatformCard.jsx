import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function PlatformCard({ platform, icon, color, steps, cardId, isComplete, onComplete }) {
  const [expanded, setExpanded] = useState(false)

  function markDone() {
    onComplete?.(cardId)
    setExpanded(false)
  }

  return (
    <motion.div
      className="mb-3 rounded-xl overflow-hidden shadow-sm"
      style={{ border: `2px solid ${isComplete ? '#B5EAD7' : color}` }}
      whileHover={{ y: -2 }}
    >
      {/* Card header */}
      <button
        className="w-full flex items-center gap-3 p-3 text-left"
        style={{ background: isComplete ? '#B5EAD720' : `${color}15` }}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <p className="font-handwriting text-base font-bold" style={{ color: isComplete ? '#B5EAD7' : '#4A4A4A' }}>
            {platform}
          </p>
          <p className="font-body text-xs" style={{ color: '#aaa' }}>
            {isComplete ? '✓ Done!' : `${steps.length} steps`}
          </p>
        </div>
        {isComplete ? (
          <motion.span
            className="text-xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            ✅
          </motion.span>
        ) : (
          <span style={{ color: '#ccc' }}>{expanded ? '▲' : '▼'}</span>
        )}
      </button>

      {/* Steps */}
      <AnimatePresence>
        {expanded && !isComplete && (
          <motion.div
            key="steps"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-3"
          >
            <ol className="mt-2 space-y-2">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-handwriting text-sm font-bold flex-shrink-0" style={{ color }}>
                    {i + 1}.
                  </span>
                  <p className="font-body text-sm" style={{ color: '#4A4A4A' }}>{step}</p>
                </li>
              ))}
            </ol>
            <motion.button
              className="mt-3 w-full py-2 rounded-lg font-handwriting text-sm font-bold text-white"
              style={{ background: color }}
              whileTap={{ scale: 0.97 }}
              onClick={markDone}
            >
              ✓ Mark as Done
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
