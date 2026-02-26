import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DiaryEntry from '../components/DiaryEntry'

const HOTLINES = [
  {
    name: 'National DV Hotline',
    number: '1-800-799-7233',
    text: 'Text START to 88788',
    chat: 'thehotline.org',
    color: '#FFB5C2',
    emoji: '💜',
    description: '24/7 crisis support, safety planning, shelter referrals',
  },
  {
    name: 'Crisis Text Line',
    number: null,
    text: 'Text HOME to 741741',
    chat: 'crisistextline.org',
    color: '#C3B1E1',
    emoji: '💬',
    description: "Free 24/7 text support. Works when you can't make a call.",
  },
  {
    name: 'RAINN Hotline',
    number: '1-800-656-4673',
    text: 'rainn.org/get-help',
    chat: 'rainn.org',
    color: '#A7C7E7',
    emoji: '🌊',
    description: 'Sexual assault support and local resources finder',
  },
  {
    name: 'Legal Aid Finder',
    number: null,
    text: 'lawhelp.org',
    chat: 'lawhelp.org',
    color: '#B5EAD7',
    emoji: '⚖️',
    description: 'Free legal help including protective orders and housing',
  },
]

const EVIDENCE_TIPS = [
  'Screenshot threatening or controlling messages (include timestamps)',
  'Document incidents with dates, times, and what happened',
  'Save voicemails — forward to your own email if possible',
  'Photograph any physical evidence with your phone (date/time auto-saved)',
  "Store copies in a cloud account HE doesn't have access to",
  'Consider emailing evidence to a trusted friend or lawyer',
]

export default function ChapterResources() {
  const navigate = useNavigate()

  return (
    <div className="lined-paper min-h-screen">
      <PageHeader
        chapter="Chapter Five"
        title="My New Address Book"
        emoji="📒"
        subtitle="You are not alone — help is one call away"
        color="#FFDAA1"
      />

      <DiaryEntry>
        <p style={{ color: '#888' }}>
          Dear Diary, this chapter is different. I'm not alone in this —
          and these are the people who will prove it.
        </p>
      </DiaryEntry>

      <div className="px-4 pl-14 pb-6 space-y-4">

        {/* Hotlines */}
        <p className="font-handwriting text-lg font-bold" style={{ color: '#4A4A4A' }}>
          💜 24/7 Support Lines
        </p>

        {HOTLINES.map((h, i) => (
          <motion.div
            key={h.name}
            className="rounded-xl p-4 shadow-sm"
            style={{ background: `${h.color}15`, border: `2px solid ${h.color}` }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{h.emoji}</span>
              <div className="flex-1">
                <p className="font-handwriting text-base font-bold" style={{ color: '#4A4A4A' }}>{h.name}</p>
                {h.number && (
                  <a
                    href={`tel:${h.number}`}
                    className="font-handwriting text-lg font-bold block mt-1"
                    style={{ color: h.color }}
                  >
                    📞 {h.number}
                  </a>
                )}
                <p className="font-body text-sm mt-1" style={{ color: '#888' }}>{h.text}</p>
                <p className="font-body text-xs mt-1" style={{ color: '#aaa' }}>{h.description}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Evidence tips */}
        <motion.div
          className="rounded-xl p-4"
          style={{ background: 'rgba(255,218,161,0.15)', border: '2px dashed #FFDAA1' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-handwriting text-base font-bold mb-3" style={{ color: '#4A4A4A' }}>
            📸 Evidence Preservation Tips
          </p>
          <ul className="space-y-2">
            {EVIDENCE_TIPS.map((tip, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-handwriting text-sm flex-shrink-0" style={{ color: '#FFDAA1' }}>✦</span>
                <p className="font-body text-sm" style={{ color: '#4A4A4A' }}>{tip}</p>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Safety circle */}
        <motion.div
          className="rounded-xl p-4"
          style={{ background: 'rgba(255,181,194,0.1)', border: '2px solid #FFB5C2' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="font-handwriting text-base font-bold mb-2" style={{ color: '#4A4A4A' }}>
            💖 My Safety Circle
          </p>
          <p className="font-body text-sm mb-3" style={{ color: '#888' }}>
            Who are the people I trust? Write them here.
          </p>
          <textarea
            className="w-full p-3 rounded-lg font-handwriting text-sm resize-none"
            style={{
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid #FFB5C2',
              color: '#4A4A4A',
              minHeight: 80,
              lineHeight: '1.8',
            }}
            placeholder={"Name, phone number...\nName, phone number..."}
          />
        </motion.div>

        {/* CTA to Fresh Start */}
        <motion.button
          className="w-full py-4 rounded-xl font-handwriting text-xl font-bold text-white shadow-lg mt-2"
          style={{ background: 'linear-gradient(135deg, #FFB5C2, #C3B1E1, #A7C7E7)' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/fresh-start')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          ✨ See My Fresh Start Dashboard →
        </motion.button>

        <button
          onClick={() => navigate('/chapter/4')}
          className="w-full py-3 rounded-xl font-handwriting text-base border-2"
          style={{ borderColor: '#FFDAA1', color: '#FFDAA1' }}
        >
          ← Back
        </button>
      </div>
    </div>
  )
}
