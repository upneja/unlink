import { motion } from 'framer-motion'
import { CheckSticker } from './Stickers'

export default function ChecklistItem({ id, chapterId, label, sublabel, isChecked, onToggle, stickerColor }) {
  return (
    <motion.div
      className="flex items-start gap-3 py-3 px-2 rounded-lg cursor-pointer group"
      whileHover={{ backgroundColor: 'rgba(255,181,194,0.1)' }}
      onClick={() => onToggle(chapterId, id)}
    >
      <div className="flex-shrink-0 mt-0.5">
        <motion.div
          className="w-6 h-6 rounded border-2 flex items-center justify-center"
          style={{ borderColor: isChecked ? 'transparent' : '#C3B1E1' }}
          animate={isChecked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.2 }}
        >
          {isChecked && (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <CheckSticker size={24} color={stickerColor || '#B5EAD7'} />
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="flex-1">
        <p
          className="font-body text-sm font-medium leading-snug transition-all duration-300"
          style={{
            color: isChecked ? '#aaa' : '#4A4A4A',
            textDecoration: isChecked ? 'line-through' : 'none',
            textDecorationColor: '#FFB5C2',
          }}
        >
          {label}
        </p>
        {sublabel && (
          <p className="font-body text-xs mt-0.5" style={{ color: '#999' }}>
            {sublabel}
          </p>
        )}
      </div>

      {isChecked && (
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.1 }}
          className="flex-shrink-0"
        >
          <CheckSticker size={20} color={stickerColor || '#B5EAD7'} />
        </motion.div>
      )}
    </motion.div>
  )
}
