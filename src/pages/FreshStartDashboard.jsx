import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDiary } from '../context/DiaryContext'
import { StarSticker } from '../components/Stickers'
import StickerBurst from '../components/StickerBurst'

const CHAPTER_ITEMS = {
  ch2: ['phone_pin','laptop_pw','email_pw','email_2fa','icloud_safety','google_safety','cloud_pw','stalkerware','devices_removed'],
  ch3: ['instagram','snapchat','tiktok','facebook','findmy','google'],
  ch4: ['bank_acct','bank_remove','credit_card','phone_plan','direct_deposit','streaming','amazon','venmo_paypal','subscriptions'],
}

const ACHIEVEMENTS = [
  { id: 'ch2_complete', label: 'Digital Fortress', emoji: '🔒', color: '#C3B1E1', description: 'Secured all devices & passwords' },
  { id: 'ch3_complete', label: 'Free as a Butterfly', emoji: '🦋', color: '#A7C7E7', description: 'Reclaimed all social media' },
  { id: 'ch4_complete', label: 'Financially Free', emoji: '💚', color: '#B5EAD7', description: 'Untangled all shared finances' },
]

function ChapterProgressCard({ chapter, label, emoji, color, chapterId, itemIds, onClick }) {
  const { chapterProgress } = useDiary()
  const { checked, total, percent } = chapterProgress(chapterId, itemIds)

  return (
    <motion.button
      className="rounded-xl p-3 text-left w-full"
      style={{ background: `${color}15`, border: `2px solid ${color}` }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{emoji}</span>
        <div>
          <p className="font-handwriting text-sm font-bold" style={{ color: '#4A4A4A' }}>{chapter}</p>
          <p className="font-body text-xs" style={{ color: '#aaa' }}>{label}</p>
        </div>
        <div className="ml-auto font-handwriting text-sm font-bold" style={{ color }}>
          {checked}/{total}
        </div>
      </div>
      <div className="h-2 rounded-full" style={{ background: '#eee' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring', stiffness: 80 }}
        />
      </div>
    </motion.button>
  )
}

export default function FreshStartDashboard() {
  const navigate = useNavigate()
  const { diary, setDearFutureMe } = useDiary()
  const [burst, setBurst] = useState(false)
  const [letterText, setLetterText] = useState(diary.dearFutureMe || '')
  const [saved, setSaved] = useState(false)

  const totalItems = Object.values(CHAPTER_ITEMS).flat().length
  const totalChecked = Object.entries(CHAPTER_ITEMS).reduce((acc, [chId, items]) => {
    return acc + items.filter(id => diary.checklist[chId]?.[id]).length
  }, 0)
  const overallPercent = totalItems > 0 ? (totalChecked / totalItems) * 100 : 0

  useEffect(() => {
    if (overallPercent > 0) {
      setTimeout(() => setBurst(true), 500)
    }
  }, [])

  function handleSaveLetter() {
    setDearFutureMe(letterText)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const earnedAchievements = ACHIEVEMENTS.filter(a => diary.achievements.includes(a.id))

  return (
    <div className="lined-paper min-h-screen">
      <StickerBurst trigger={burst} onComplete={() => setBurst(false)} />

      {/* Header */}
      <div className="pt-6 pb-4 pl-14 pr-4 text-center" style={{ borderBottom: '2px solid #FFD700' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="flex justify-center mb-2"
        >
          <StarSticker size={48} color="#FFD700" />
        </motion.div>
        <h1 className="font-handwriting text-3xl font-bold" style={{ color: '#4A4A4A' }}>
          ✨ My Fresh Start
        </h1>
        <p className="font-body text-sm mt-1" style={{ color: '#aaa' }}>
          Look how far you've come.
        </p>
      </div>

      <div className="px-4 pl-14 py-4 space-y-4">

        {/* Overall progress */}
        <motion.div
          className="rounded-xl p-5 text-center shadow-sm"
          style={{ background: 'linear-gradient(135deg, #FFB5C220, #C3B1E120)', border: '2px solid #FFD700' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="font-handwriting text-4xl font-bold" style={{ color: '#FFD700' }}>
            {Math.round(overallPercent)}%
          </p>
          <p className="font-handwriting text-base" style={{ color: '#4A4A4A' }}>Complete</p>
          <div className="mt-3 h-3 rounded-full" style={{ background: '#eee' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #FFB5C2, #C3B1E1, #A7C7E7)' }}
              animate={{ width: `${overallPercent}%` }}
              transition={{ type: 'spring', stiffness: 60, delay: 0.5 }}
            />
          </div>
          <p className="font-body text-xs mt-2" style={{ color: '#aaa' }}>
            {totalChecked} of {totalItems} steps completed
          </p>
        </motion.div>

        {/* Achievements */}
        {earnedAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="font-handwriting text-lg font-bold mb-3" style={{ color: '#4A4A4A' }}>
              🏆 Earned Stickers
            </p>
            <div className="flex gap-3 flex-wrap">
              {earnedAchievements.map((a, i) => (
                <motion.div
                  key={a.id}
                  className="flex-1 min-w-[120px] rounded-xl p-3 text-center"
                  style={{ background: `${a.color}20`, border: `2px solid ${a.color}` }}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.6 + i * 0.1 }}
                >
                  <span className="text-3xl">{a.emoji}</span>
                  <p className="font-handwriting text-xs font-bold mt-1" style={{ color: '#4A4A4A' }}>{a.label}</p>
                  <p className="font-body text-xs mt-0.5" style={{ color: '#aaa' }}>{a.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Chapter progress cards */}
        <div>
          <p className="font-handwriting text-lg font-bold mb-3" style={{ color: '#4A4A4A' }}>
            📖 Chapter Progress
          </p>
          <div className="space-y-2">
            <ChapterProgressCard
              chapter="Chapter 2" label="Locking My Diary" emoji="🔒" color="#C3B1E1"
              chapterId="ch2" itemIds={CHAPTER_ITEMS.ch2} onClick={() => navigate('/chapter/2')}
            />
            <ChapterProgressCard
              chapter="Chapter 3" label="Unfriending & Unfollowing" emoji="📱" color="#A7C7E7"
              chapterId="ch3" itemIds={CHAPTER_ITEMS.ch3} onClick={() => navigate('/chapter/3')}
            />
            <ChapterProgressCard
              chapter="Chapter 4" label="Splitting the Bill" emoji="💳" color="#B5EAD7"
              chapterId="ch4" itemIds={CHAPTER_ITEMS.ch4} onClick={() => navigate('/chapter/4')}
            />
          </div>
        </div>

        {/* Dear Future Me letter */}
        <motion.div
          className="rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.7)', border: '2px dashed #FFB5C2' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="font-handwriting text-lg font-bold mb-1" style={{ color: '#4A4A4A' }}>
            💌 Dear Future Me
          </p>
          <p className="font-body text-xs mb-3" style={{ color: '#aaa' }}>
            Write yourself a note. You deserve to hear from the person you're becoming.
          </p>
          <textarea
            value={letterText}
            onChange={(e) => setLetterText(e.target.value)}
            className="w-full p-3 rounded-lg font-handwriting text-sm resize-none"
            style={{
              background: 'rgba(255,248,240,0.8)',
              border: '1px solid #FFB5C2',
              color: '#4A4A4A',
              minHeight: 120,
              lineHeight: '2',
            }}
            placeholder={"Dear future me,\n\nI did it. I took back..."}
          />
          <motion.button
            className="mt-2 w-full py-2 rounded-lg font-handwriting text-sm font-bold"
            style={{
              background: saved ? '#B5EAD7' : 'transparent',
              border: `2px solid ${saved ? '#B5EAD7' : '#FFB5C2'}`,
              color: saved ? '#fff' : '#FFB5C2',
            }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSaveLetter}
          >
            {saved ? '✓ Saved to your diary' : '💾 Save to my diary'}
          </motion.button>
        </motion.div>

        {/* Empowerment message */}
        <motion.div
          className="rounded-xl p-5 text-center"
          style={{ background: 'linear-gradient(135deg, #FFB5C2, #C3B1E1)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="font-handwriting text-xl text-white font-bold">
            💜 You did something brave.
          </p>
          <p className="font-body text-sm text-white opacity-90 mt-2">
            Taking back your digital life is not a small thing. It's your safety, your privacy, your future.
            This diary — and everything in it — belongs to you.
          </p>
          <p className="font-handwriting text-base text-white mt-3 opacity-80">
            Your diary. Your data. Your fresh start. ✨
          </p>
        </motion.div>

        {/* Return to cover */}
        <div className="text-center pb-4">
          <button
            onClick={() => navigate('/')}
            className="font-body text-xs underline"
            style={{ color: '#ccc' }}
          >
            Return to cover
          </button>
        </div>
      </div>
    </div>
  )
}
