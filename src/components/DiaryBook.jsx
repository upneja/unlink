import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import ProgressSpine from './ProgressSpine'

const CHAPTER_COLORS = {
  '/': '#FFB5C2',
  '/chapter/1': '#FFB5C2',
  '/chapter/2': '#C3B1E1',
  '/chapter/3': '#A7C7E7',
  '/chapter/4': '#B5EAD7',
  '/chapter/5': '#FFDAA1',
  '/fresh-start': '#FFD700',
}

const pageVariants = {
  enter: (direction) => ({
    rotateY: direction > 0 ? 90 : -90,
    opacity: 0,
    transformOrigin: direction > 0 ? 'left center' : 'right center',
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    transformOrigin: 'center center',
  },
  exit: (direction) => ({
    rotateY: direction > 0 ? -90 : 90,
    opacity: 0,
    transformOrigin: direction > 0 ? 'right center' : 'left center',
  }),
}

const pageTransition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
}

export default function DiaryBook({ children, direction = 1 }) {
  const location = useLocation()
  const accentColor = CHAPTER_COLORS[location.pathname] || '#FFB5C2'

  return (
    <div className="flex items-start justify-center min-h-screen py-4 px-2 sm:py-8 sm:px-4">
      <div className="relative w-full max-w-sm sm:max-w-md">
        {/* Book shadow */}
        <div className="absolute inset-0 translate-y-2 translate-x-2 bg-stone-400 rounded-lg opacity-30" />

        {/* Book outer */}
        <div className="relative rounded-lg overflow-hidden shadow-2xl diary-perspective">
          {/* Spine on left */}
          <div
            className="absolute left-0 top-0 bottom-0 w-8 z-10 flex flex-col items-center justify-center gap-3"
            style={{ background: accentColor }}
          >
            <ProgressSpine accentColor={accentColor} />
          </div>

          {/* Page content */}
          <div className="ml-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={location.pathname}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="lined-paper"
                style={{ minHeight: '100vh' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
