import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DiaryEntry from '../components/DiaryEntry'
import ChecklistItem from '../components/ChecklistItem'
import { useDiary } from '../context/DiaryContext'
import StickerBurst from '../components/StickerBurst'

const CHAPTER_ID = 'ch4'

const ITEMS = [
  { id: 'bank_acct', label: 'Open a new bank account in your name only', sublabel: 'Many banks let you do this online in 10 minutes' },
  { id: 'bank_remove', label: 'Remove him as an authorized user from joint accounts', sublabel: 'Call the bank directly — you may need to close and reopen' },
  { id: 'credit_card', label: 'Remove him from any shared credit cards', sublabel: 'Contact card issuer — authorized user removal is usually instant' },
  { id: 'phone_plan', label: 'Separate from the shared phone plan', sublabel: "FCC Safe Connections Act (2022) — carriers must let survivors separate. Call your carrier and say you're a domestic violence survivor." },
  { id: 'direct_deposit', label: 'Update your direct deposit to your new account', sublabel: 'Contact HR or your bank with your new account info' },
  { id: 'streaming', label: 'Change passwords or cancel shared streaming accounts', sublabel: 'Netflix, Spotify, Disney+, Hulu, HBO Max, Apple One' },
  { id: 'amazon', label: 'Remove him from Amazon Household / change payment method', sublabel: "amazon.com → Account → Amazon Household → leave or manage members" },
  { id: 'venmo_paypal', label: 'Update Venmo/PayPal/Cash App privacy settings', sublabel: 'Set transactions to Private. Remove any linked shared accounts.' },
  { id: 'subscriptions', label: 'Audit and update billing info for all subscriptions', sublabel: 'Check your email for "receipt" emails to find every service' },
]

function ReceiptStamp({ visible }) {
  if (!visible) return null
  return (
    <motion.div
      className="absolute top-4 right-4"
      style={{ rotate: -15 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <div className="border-4 border-green-400 rounded-lg px-3 py-1">
        <p className="font-handwriting text-green-500 text-lg font-bold">PAID IN FULL ✓</p>
      </div>
    </motion.div>
  )
}

export default function ChapterFinances() {
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
      earnAchievement('ch4_complete')
    }
  }, [celebrated])

  return (
    <div className="lined-paper min-h-screen">
      <StickerBurst trigger={burst} onComplete={() => setBurst(false)} />

      <PageHeader
        chapter="Chapter Four"
        title="Splitting the Bill"
        emoji="💳"
        subtitle="Your finances, your freedom"
        color="#B5EAD7"
      />

      <DiaryEntry>
        <p style={{ color: '#888' }}>
          Dear Diary, financial ties are invisible chains. Today I'm cutting them —
          every shared account, every linked card, every subscription. Independence starts here.
        </p>
      </DiaryEntry>

      {/* FCC callout */}
      <motion.div
        className="mx-4 mb-4 p-4 rounded-xl"
        style={{ background: '#FFD70020', border: '2px solid #FFD700' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="font-handwriting text-base font-bold" style={{ color: '#4A4A4A' }}>
          ⭐ Know Your Rights
        </p>
        <p className="font-body text-sm mt-1" style={{ color: '#4A4A4A' }}>
          The <strong>FCC Safe Connections Act (2022)</strong> requires wireless carriers to let domestic violence survivors
          separate from shared phone plans at no cost. Call your carrier and tell them you're a survivor — they must help you.
        </p>
      </motion.div>

      {/* Receipt-style container */}
      <div className="relative mx-4 mb-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.7)', border: '1px dashed #B5EAD7' }}>
        <ReceiptStamp visible={percent === 100} />
        <p className="font-handwriting text-xs text-center mb-3" style={{ color: '#B5EAD7' }}>
          ~~~ ACCOUNT SEPARATION RECEIPT ~~~
        </p>

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
              stickerColor="#B5EAD7"
            />
            {i < ITEMS.length - 1 && (
              <div className="border-b border-dashed ml-9 mb-1" style={{ borderColor: '#eee' }} />
            )}
          </motion.div>
        ))}

        <div className="mt-4 pt-3 border-t-2 border-dashed" style={{ borderColor: '#B5EAD7' }}>
          <div className="flex justify-between items-center">
            <p className="font-handwriting text-base" style={{ color: '#4A4A4A' }}>Progress</p>
            <p className="font-handwriting text-lg font-bold" style={{ color: '#B5EAD7' }}>{checked}/{total}</p>
          </div>
          <div className="mt-2 h-2 rounded-full" style={{ background: '#eee' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: '#B5EAD7' }}
              animate={{ width: `${percent}%` }}
              transition={{ type: 'spring', stiffness: 80 }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 pl-14 pb-6 flex gap-3">
        <button
          onClick={() => navigate('/chapter/3')}
          className="flex-1 py-3 rounded-xl font-handwriting text-base border-2"
          style={{ borderColor: '#B5EAD7', color: '#B5EAD7' }}
        >
          ← Back
        </button>
        <motion.button
          onClick={() => navigate('/chapter/5')}
          className="flex-1 py-3 rounded-xl font-handwriting text-base font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #B5EAD7, #A7C7E7)' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Next: Resources →
        </motion.button>
      </div>
    </div>
  )
}
