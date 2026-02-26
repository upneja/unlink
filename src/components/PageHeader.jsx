import { motion } from 'framer-motion'

export default function PageHeader({ chapter, title, emoji, subtitle, color }) {
  return (
    <div className="pt-6 pb-4 pl-14 pr-4 border-b-2" style={{ borderColor: color || '#FFB5C2' }}>
      {chapter && (
        <p className="font-handwriting text-sm mb-1" style={{ color: color || '#FFB5C2' }}>
          {chapter}
        </p>
      )}
      <motion.h1
        className="font-handwriting text-3xl font-bold leading-tight"
        style={{ color: '#4A4A4A' }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {emoji} {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          className="font-body text-sm mt-2"
          style={{ color: '#888' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
