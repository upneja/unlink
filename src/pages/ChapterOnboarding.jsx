import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DiaryEntry from '../components/DiaryEntry'
import { useDiary } from '../context/DiaryContext'
import { StarSticker } from '../components/Stickers'
import StickerBurst from '../components/StickerBurst'

const QUESTIONS = [
  {
    id: 'sharedPhonePlan',
    question: 'Are you on a shared phone plan together?',
    diary: 'He could see my call logs and texts through the carrier...',
    yes: 'Yes, shared plan',
    no: 'No, separate plans',
  },
  {
    id: 'jointBankAccount',
    question: 'Do you have any joint bank accounts or shared credit cards?',
    diary: 'Money is one of the ways control can hide...',
    yes: 'Yes, shared accounts',
    no: 'No, all separate',
  },
  {
    id: 'sharedStreaming',
    question: 'Do you share Netflix, Spotify, Apple ID, or other streaming accounts?',
    diary: 'Even knowing what I watch felt like surveillance...',
    yes: 'Yes, sharing accounts',
    no: 'No, all mine',
  },
  {
    id: 'locationSharingOn',
    question: 'Is location sharing turned on anywhere? (Find My, Google Maps, Snapchat, Life360...)',
    diary: 'Every place I went, he knew. That has to change.',
    yes: 'Yes, location is shared',
    no: 'No location sharing',
  },
  {
    id: 'sharedCloud',
    question: 'Do you share iCloud, Google account, or any cloud storage?',
    diary: 'Photos, notes, documents — all potentially visible...',
    yes: 'Yes, shared cloud',
    no: 'No, my own account',
  },
  {
    id: 'sharedSocialLogins',
    question: 'Does he know your passwords for social media, email, or any apps?',
    diary: 'Changing these is step one. My accounts, my business.',
    yes: 'Yes, knows my passwords',
    no: 'No, all private',
  },
]

export default function ChapterOnboarding() {
  const navigate = useNavigate()
  const { setAssessment, diary } = useDiary()
  const [answers, setAnswers] = useState(diary.assessment)
  const [currentQ, setCurrentQ] = useState(0)
  const [showSummary, setShowSummary] = useState(diary.assessmentComplete)
  const [burst, setBurst] = useState(false)

  const answeredCount = QUESTIONS.filter(q => answers[q.id] !== null).length

  function answer(questionId, value) {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)

    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300)
    } else if (Object.values(newAnswers).every(v => v !== null)) {
      setTimeout(() => {
        setAssessment(newAnswers)
        setBurst(true)
        setTimeout(() => setShowSummary(true), 800)
      }, 300)
    }
  }

  const needsItems = QUESTIONS.filter(q => answers[q.id] === true)

  if (showSummary) {
    return (
      <div className="lined-paper min-h-screen">
        <StickerBurst trigger={burst} />
        <PageHeader
          chapter="Chapter One"
          title="Here's Your Plan"
          emoji="📋"
          subtitle="Your personalized digital breakup checklist"
          color="#FFB5C2"
        />
        <div className="px-4 py-4 pl-14">
          <motion.div
            className="bg-opacity-10 rounded-xl p-4 mb-4 border-2"
            style={{ background: 'rgba(255,181,194,0.1)', borderColor: '#FFB5C2', borderStyle: 'dashed' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-handwriting text-xl mb-2" style={{ color: '#4A4A4A' }}>
              ✨ Based on your answers, I found {needsItems.length} things to tackle.
            </p>
            <p className="font-body text-sm" style={{ color: '#888' }}>
              Your chapters are personalized to what you need. Let's go through them one by one — there's no rush.
            </p>
          </motion.div>

          {needsItems.length === 0 && (
            <motion.div
              className="rounded-xl p-4 mb-4 text-center"
              style={{ background: '#B5EAD7' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="font-handwriting text-2xl">🎉 Amazing!</p>
              <p className="font-body text-sm mt-1">Looks like you're already well-separated. Work through the chapters to double-check everything.</p>
            </motion.div>
          )}

          {needsItems.map((q, i) => (
            <motion.div
              key={q.id}
              className="flex items-start gap-3 mb-3 p-3 rounded-lg"
              style={{ background: 'rgba(255,181,194,0.1)' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <StarSticker size={20} color="#FFD700" />
              <div>
                <p className="font-body text-sm font-semibold" style={{ color: '#4A4A4A' }}>{q.question}</p>
                <p className="font-handwriting text-xs mt-0.5" style={{ color: '#888', fontStyle: 'italic' }}>"{q.diary}"</p>
              </div>
            </motion.div>
          ))}

          <motion.button
            className="w-full mt-6 py-4 rounded-xl font-handwriting text-xl font-bold text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #FFB5C2, #C3B1E1)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/chapter/2')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Start Chapter 2: Locking My Diary 🔒
          </motion.button>

          <p className="font-body text-xs text-center mt-3" style={{ color: '#ccc' }}>
            You can always come back to any chapter from the spine on the left.
          </p>
        </div>
      </div>
    )
  }

  const q = QUESTIONS[currentQ]

  return (
    <div className="lined-paper min-h-screen">
      <PageHeader
        chapter="Chapter One"
        title="I'm Starting Over"
        emoji="📖"
        subtitle="Let's figure out what you need to take back"
        color="#FFB5C2"
      />

      <DiaryEntry>
        <p className="mb-6">
          Dear Diary,<br />
          <span style={{ color: '#888' }}>Today I answer a few questions to build my plan.
          No judgment here — this is just for me.</span>
        </p>
      </DiaryEntry>

      {/* Progress dots */}
      <div className="flex gap-2 justify-center mb-6">
        {QUESTIONS.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              height: 10,
              background: i < answeredCount ? '#C3B1E1' : i === currentQ ? '#FFB5C2' : '#eee',
            }}
            animate={{ width: i === currentQ ? 20 : 10 }}
          />
        ))}
      </div>

      {/* Question card */}
      <div className="px-4 pl-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="rounded-2xl p-5 mb-4 shadow-sm"
            style={{ background: 'rgba(255,255,255,0.8)', border: '2px solid #FFB5C2' }}
          >
            <p className="font-handwriting text-xs mb-2" style={{ color: '#FFB5C2', fontStyle: 'italic' }}>
              "{q.diary}"
            </p>
            <p className="font-body text-base font-semibold mb-4" style={{ color: '#4A4A4A' }}>
              {q.question}
            </p>

            <div className="flex gap-3">
              <motion.button
                className="flex-1 py-3 rounded-xl font-handwriting text-base font-bold"
                style={{
                  background: answers[q.id] === true ? '#FFB5C2' : 'transparent',
                  border: '2px solid #FFB5C2',
                  color: answers[q.id] === true ? '#fff' : '#FFB5C2',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => answer(q.id, true)}
              >
                {q.yes}
              </motion.button>
              <motion.button
                className="flex-1 py-3 rounded-xl font-handwriting text-base font-bold"
                style={{
                  background: answers[q.id] === false ? '#B5EAD7' : 'transparent',
                  border: '2px solid #B5EAD7',
                  color: answers[q.id] === false ? '#fff' : '#888',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => answer(q.id, false)}
              >
                {q.no}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="font-body text-xs text-center" style={{ color: '#ccc' }}>
          Question {currentQ + 1} of {QUESTIONS.length}
        </p>
      </div>
    </div>
  )
}
