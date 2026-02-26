import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LockSticker, HeartSticker, StarSticker, ButterflySticker } from '../components/Stickers'
import { useState } from 'react'

export default function DiaryCover() {
  const navigate = useNavigate()
  const [unlocking, setUnlocking] = useState(false)
  const [opened, setOpened] = useState(false)

  function handleOpen() {
    setUnlocking(true)
    setTimeout(() => {
      setOpened(true)
      setTimeout(() => navigate('/chapter/1'), 600)
    }, 800)
  }

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FFB5C2 0%, #C3B1E1 50%, #A7C7E7 100%)' }}
    >
      {/* Background decorative stickers */}
      <motion.div
        className="absolute top-8 right-8 opacity-60"
        animate={{ rotate: [0, 10, 0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        <StarSticker size={40} color="#FFD700" />
      </motion.div>
      <motion.div
        className="absolute top-20 left-6 opacity-50"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
      >
        <HeartSticker size={36} color="#fff" />
      </motion.div>
      <motion.div
        className="absolute bottom-24 right-6 opacity-50"
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
      >
        <ButterflySticker size={44} color="#fff" />
      </motion.div>
      <motion.div
        className="absolute bottom-16 left-8 opacity-40"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      >
        <StarSticker size={28} color="#FFD700" />
      </motion.div>

      {/* Diary cover card */}
      <motion.div
        className="relative bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 mx-4 max-w-sm w-full text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={opened ? { scale: 1.05, opacity: 0, rotateY: -90 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ backdropFilter: 'blur(8px)' }}
      >
        {/* Lock decoration */}
        <motion.div
          className="flex justify-center mb-4"
          animate={unlocking ? { rotate: [0, -10, 10, 0], scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            animate={unlocking ? { y: -8, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <LockSticker size={56} color="#C3B1E1" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-handwriting text-5xl font-bold mb-1"
          style={{ color: '#4A4A4A' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          UNLINK
        </motion.h1>
        <motion.p
          className="font-handwriting text-lg mb-1"
          style={{ color: '#C3B1E1' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          💔 The Digital Breakup Kit
        </motion.p>

        {/* Tagline */}
        <motion.p
          className="font-body text-sm mb-6 px-4"
          style={{ color: '#999', fontStyle: 'italic' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          "Your diary. Your data. Your fresh start."
        </motion.p>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 border-t" style={{ borderColor: '#FFB5C2', borderStyle: 'dashed' }} />
          <span className="font-handwriting text-sm" style={{ color: '#FFB5C2' }}>✦ ✦ ✦</span>
          <div className="flex-1 border-t" style={{ borderColor: '#FFB5C2', borderStyle: 'dashed' }} />
        </div>

        {/* Dear Diary entry */}
        <motion.p
          className="font-handwriting text-base mb-8 text-left"
          style={{ color: '#4A4A4A', lineHeight: '1.8' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Dear Diary,<br />
          Today I'm taking back what's mine.<br />
          My accounts. My devices. My life. 💜
        </motion.p>

        {/* Open button */}
        <motion.button
          className="w-full py-4 rounded-xl font-handwriting text-xl font-bold text-white shadow-lg"
          style={{ background: 'linear-gradient(135deg, #FFB5C2, #C3B1E1)' }}
          whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(195,177,225,0.5)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpen}
          disabled={unlocking}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {unlocking ? '🔓 Opening...' : '🔒 Open My Diary'}
        </motion.button>

        {/* Privacy note */}
        <motion.p
          className="font-body text-xs mt-4"
          style={{ color: '#ccc' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Zero data collected. Everything stays on your device.
        </motion.p>
      </motion.div>

      {/* Bottom tagline */}
      <motion.p
        className="font-handwriting text-sm text-white opacity-70 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.4 }}
      >
        ✨ tap to begin your fresh start ✨
      </motion.p>
    </div>
  )
}
