import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import DiaryEntry from '../components/DiaryEntry'
import ChecklistItem from '../components/ChecklistItem'
import { useDiary } from '../context/DiaryContext'
import StickerBurst from '../components/StickerBurst'

const CHAPTER_ID = 'ch2'

const ITEMS = [
  { id: 'phone_pin', label: 'Change your phone PIN / passcode', sublabel: 'Settings → Face ID & Passcode (iPhone) or Screen Lock (Android)' },
  { id: 'laptop_pw', label: 'Change your laptop/computer password', sublabel: 'System Settings → Login Password' },
  { id: 'email_pw', label: 'Change your primary email password', sublabel: 'Gmail, Outlook, Apple Mail — do this first' },
  { id: 'email_2fa', label: 'Enable 2-factor authentication on email', sublabel: 'Use an authenticator app, NOT SMS if possible' },
  { id: 'icloud_safety', label: 'Run Apple Safety Check (iPhone users)', sublabel: 'Settings → Privacy & Security → Safety Check → Emergency Reset' },
  { id: 'google_safety', label: 'Run Google Security Checkup (Android/Gmail)', sublabel: 'myaccount.google.com → Security → Security Checkup' },
  { id: 'cloud_pw', label: 'Change iCloud / Google Account password', sublabel: 'This covers photos, backups, and Find My' },
  { id: 'stalkerware', label: 'Check for unfamiliar apps (stalkerware check)', sublabel: "Look for apps you didn't install. Coalition Against Stalkerware has a guide." },
  { id: 'devices_removed', label: 'Remove shared devices from your Apple/Google account', sublabel: 'Settings → [Your Name] → scroll down to see all devices' },
]

function LockMeter({ percent }) {
  const label = percent < 34 ? '🔓 Flimsy Lock' : percent < 67 ? '🔒 Getting Stronger' : percent < 100 ? '🛡️ Solid Padlock' : '🏦 Vault Level!'
  const color = percent < 34 ? '#FFB5C2' : percent < 67 ? '#FFD700' : percent < 100 ? '#C3B1E1' : '#B5EAD7'

  return (
    <div className="mx-4 my-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.7)', border: `2px solid ${color}` }}>
      <div className="flex items-center justify-between mb-2">
        <p className="font-handwriting text-base font-bold" style={{ color }}>{label}</p>
        <p className="font-body text-sm" style={{ color: '#888' }}>{Math.round(percent)}%</p>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ background: '#eee' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        />
      </div>
    </div>
  )
}

export default function ChapterDevices() {
  const navigate = useNavigate()
  const { isChecked, toggleChecklistItem, chapterProgress, earnAchievement } = useDiary()
  const [burst, setBurst] = useState(false)
  const [celebrated, setCelebrated] = useState(false)

  const { checked, total, percent } = chapterProgress(CHAPTER_ID, ITEMS.map(i => i.id))

  useEffect(() => {
    if (percent === 100 && !celebrated) {
      setCelebrated(true)
    }
  }, [percent, celebrated])

  useEffect(() => {
    if (celebrated) {
      setBurst(true)
      earnAchievement('ch2_complete')
    }
  }, [celebrated])

  return (
    <div className="lined-paper min-h-screen">
      <StickerBurst trigger={burst} onComplete={() => setBurst(false)} />

      <PageHeader
        chapter="Chapter Two"
        title="Locking My Diary"
        emoji="🔒"
        subtitle="Securing your devices and passwords"
        color="#C3B1E1"
      />

      <DiaryEntry>
        <p style={{ color: '#888' }}>
          Dear Diary, today I'm changing the locks. Every account he had access to —
          every device that could betray my location — I'm taking it back. One by one.
        </p>
      </DiaryEntry>

      <LockMeter percent={percent} />

      <div className="px-4 pl-14 pb-4">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <ChecklistItem
              {...item}
              chapterId={CHAPTER_ID}
              isChecked={isChecked(CHAPTER_ID, item.id)}
              onToggle={toggleChecklistItem}
              stickerColor="#C3B1E1"
            />
          </motion.div>
        ))}

        {percent === 100 && (
          <motion.div
            className="mt-4 p-4 rounded-xl text-center"
            style={{ background: 'linear-gradient(135deg, #C3B1E1, #FFB5C2)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="font-handwriting text-2xl text-white">🎉 Chapter Complete!</p>
            <p className="font-body text-sm text-white opacity-90 mt-1">You earned the 🔒 Lock Sticker</p>
          </motion.div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate('/chapter/1')}
            className="flex-1 py-3 rounded-xl font-handwriting text-base border-2"
            style={{ borderColor: '#C3B1E1', color: '#C3B1E1' }}
          >
            ← Back
          </button>
          <motion.button
            onClick={() => navigate('/chapter/3')}
            className="flex-1 py-3 rounded-xl font-handwriting text-base font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #C3B1E1, #A7C7E7)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Next: Unfriending →
          </motion.button>
        </div>
      </div>
    </div>
  )
}
