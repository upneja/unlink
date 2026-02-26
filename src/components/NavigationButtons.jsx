import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const ROUTE_ORDER = ['/', '/chapter/1', '/chapter/2', '/chapter/3', '/chapter/4', '/chapter/5', '/fresh-start']

export default function NavigationButtons({ currentPath, canContinue = true, onContinue }) {
  const navigate = useNavigate()
  const currentIndex = ROUTE_ORDER.indexOf(currentPath)
  const prevPath = currentIndex > 0 ? ROUTE_ORDER[currentIndex - 1] : null
  const nextPath = currentIndex < ROUTE_ORDER.length - 1 ? ROUTE_ORDER[currentIndex + 1] : null

  function handleNext() {
    if (onContinue) onContinue()
    if (nextPath) navigate(nextPath)
  }

  return (
    <div className="flex items-center justify-between px-4 py-6">
      {prevPath ? (
        <motion.button
          onClick={() => navigate(prevPath)}
          className="font-handwriting text-base px-4 py-2 rounded-full border-2 transition-colors"
          style={{ borderColor: '#C3B1E1', color: '#C3B1E1' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>
      ) : <div />}

      {nextPath && (
        <motion.button
          onClick={handleNext}
          disabled={!canContinue}
          className="font-handwriting text-base px-6 py-2 rounded-full text-white font-bold shadow-md transition-all"
          style={{
            background: canContinue
              ? 'linear-gradient(135deg, #FFB5C2, #C3B1E1)'
              : '#ddd',
            cursor: canContinue ? 'pointer' : 'not-allowed',
          }}
          whileHover={canContinue ? { scale: 1.05 } : {}}
          whileTap={canContinue ? { scale: 0.95 } : {}}
        >
          Next Page →
        </motion.button>
      )}
    </div>
  )
}
