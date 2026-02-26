import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DiaryEntry from '../components/DiaryEntry'
import PlatformCard from '../components/PlatformCard'
import { useDiary } from '../context/DiaryContext'
import StickerBurst from '../components/StickerBurst'

const CHAPTER_ID = 'ch3'

const PLATFORMS = [
  {
    id: 'instagram',
    platform: 'Instagram',
    icon: '📸',
    color: '#E1306C',
    steps: [
      'Settings → Privacy → set account to Private',
      'Settings → Privacy → Story → hide from [his name]',
      'Block his account: profile → ⋮ → Block',
      'Settings → Security → Login Activity → remove unfamiliar sessions',
    ],
  },
  {
    id: 'snapchat',
    platform: 'Snapchat',
    icon: '👻',
    color: '#FFBB00',
    steps: [
      'Profile → ⚙️ → See My Location → set to Ghost Mode',
      'Block: profile → ⋮ → Block',
      "Settings → Privacy → change 'Who can contact me' to Friends",
    ],
  },
  {
    id: 'tiktok',
    platform: 'TikTok',
    icon: '🎵',
    color: '#69C9D0',
    steps: [
      'Settings → Privacy → set account to Private',
      'Block: profile → ··· → Block',
      "Settings → Privacy → turn off 'Suggest your account to others'",
    ],
  },
  {
    id: 'facebook',
    platform: 'Facebook',
    icon: '📘',
    color: '#1877F2',
    steps: [
      "Settings → Privacy → 'Who can see your future posts' → Friends",
      'Settings → Location → turn off location services for Facebook app',
      'Block: profile → ··· → Block',
      "Settings → Security → Where You're Logged In → remove unknown sessions",
    ],
  },
  {
    id: 'findmy',
    platform: 'Find My / Life360',
    icon: '📍',
    color: '#4CD964',
    steps: [
      "iPhone: Settings → [Your Name] → Find My → Share My Location → toggle OFF",
      "Or select who you're sharing with and tap 'Stop Sharing My Location'",
      "Life360: Settings → turn off location sharing or leave the circle",
      'Google Maps: Sharing → tap contact → Stop',
    ],
  },
  {
    id: 'google',
    platform: 'Google Account',
    icon: '🔍',
    color: '#4285F4',
    steps: [
      'myaccount.google.com → Data & Privacy → Location History → pause',
      'Google Maps → Sharing → remove any location sharing',
      'Security → 2-Step Verification → turn on',
      'Security → Your Devices → remove unfamiliar devices',
    ],
  },
]

export default function ChapterSocial() {
  const navigate = useNavigate()
  const { isChecked, toggleChecklistItem, chapterProgress, earnAchievement } = useDiary()
  const [burst, setBurst] = useState(false)
  const [celebrated, setCelebrated] = useState(false)

  const { percent } = chapterProgress(CHAPTER_ID, PLATFORMS.map(p => p.id))
  const completedCount = Math.round(percent / (100 / PLATFORMS.length))

  useEffect(() => {
    if (percent === 100 && !celebrated) {
      setCelebrated(true)
    }
  }, [percent, celebrated])

  useEffect(() => {
    if (celebrated) {
      setBurst(true)
      earnAchievement('ch3_complete')
    }
  }, [celebrated])

  return (
    <div className="lined-paper min-h-screen">
      <StickerBurst trigger={burst} onComplete={() => setBurst(false)} />

      <PageHeader
        chapter="Chapter Three"
        title="Unfriending & Unfollowing"
        emoji="📱"
        subtitle="Reclaiming your digital presence"
        color="#A7C7E7"
      />

      <DiaryEntry>
        <p style={{ color: '#888' }}>
          Dear Diary, my location was an open book. My privacy was his entertainment.
          Today I'm closing every window he had into my life.
        </p>
      </DiaryEntry>

      {/* Progress banner */}
      <div className="mx-4 mb-4 p-3 rounded-xl" style={{ background: '#A7C7E720', border: '2px dashed #A7C7E7' }}>
        <div className="flex items-center justify-between mb-1">
          <p className="font-handwriting text-sm" style={{ color: '#A7C7E7' }}>Platforms secured</p>
          <p className="font-body text-sm font-bold" style={{ color: '#A7C7E7' }}>
            {completedCount} / {PLATFORMS.length}
          </p>
        </div>
        <div className="h-2 rounded-full" style={{ background: '#eee' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: '#A7C7E7' }}
            animate={{ width: `${percent}%` }}
            transition={{ type: 'spring', stiffness: 80 }}
          />
        </div>
      </div>

      <div className="px-4 pl-14 pb-6">
        {PLATFORMS.map((platform, i) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <PlatformCard
              {...platform}
              cardId={platform.id}
              isComplete={isChecked(CHAPTER_ID, platform.id)}
              onComplete={(id) => toggleChecklistItem(CHAPTER_ID, id)}
            />
          </motion.div>
        ))}

        {percent === 100 && (
          <motion.div
            className="mt-4 p-4 rounded-xl text-center"
            style={{ background: 'linear-gradient(135deg, #A7C7E7, #C3B1E1)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="font-handwriting text-2xl text-white">🎉 Chapter Complete!</p>
            <p className="font-body text-sm text-white opacity-90 mt-1">You earned the 🦋 Butterfly Sticker</p>
          </motion.div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate('/chapter/2')}
            className="flex-1 py-3 rounded-xl font-handwriting text-base border-2"
            style={{ borderColor: '#A7C7E7', color: '#A7C7E7' }}
          >
            ← Back
          </button>
          <motion.button
            onClick={() => navigate('/chapter/4')}
            className="flex-1 py-3 rounded-xl font-handwriting text-base font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #A7C7E7, #B5EAD7)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Next: Finances →
          </motion.button>
        </div>
      </div>
    </div>
  )
}
