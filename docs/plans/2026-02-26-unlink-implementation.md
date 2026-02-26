# UNLINK Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a beautifully designed, interactive "digital breakup kit" web app styled as a 2000s teenage diary that guides survivors through reclaiming their digital life.

**Architecture:** Multi-page React app with React Router v6. Each chapter is a route. Navigation between chapters triggers a 3D CSS page-flip animation via Framer Motion AnimatePresence. All state (assessment answers, checklist progress, achievements) lives in a React Context backed by localStorage — no backend, no data collection.

**Tech Stack:** Vite + React 18, React Router v6, Framer Motion, Tailwind CSS v3, Google Fonts (Caveat + Nunito)

---

## VISUAL TESTING NOTE

This is a UI-heavy hackathon app. Instead of unit tests, each task ends with:
1. Run `npm run dev`
2. Open `http://localhost:5173` in browser
3. Visually verify the described behavior
4. Only commit when it looks right

---

### Task 0: Scaffold the project

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`

**Step 1: Initialize Vite + React project**

```bash
cd /Users/upneja/Projects/unlink
npm create vite@latest . -- --template react
npm install
```

**Step 2: Install all dependencies at once**

```bash
npm install react-router-dom framer-motion
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Step 3: Configure Tailwind**

Edit `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        handwriting: ["Caveat", "cursive"],
        body: ["Nunito", "sans-serif"],
      },
      colors: {
        pink: { diary: "#FFB5C2" },
        lavender: { diary: "#C3B1E1" },
        blue: { diary: "#A7C7E7" },
        mint: { diary: "#B5EAD7" },
        gold: { diary: "#FFD700" },
        cream: { diary: "#FFF8F0" },
        charcoal: { diary: "#4A4A4A" },
      },
    },
  },
  plugins: [],
}
```

**Step 4: Set up global CSS with fonts and paper texture**

Replace `src/index.css` entirely:
```css
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Nunito:wght@400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --pink: #FFB5C2;
  --lavender: #C3B1E1;
  --blue: #A7C7E7;
  --mint: #B5EAD7;
  --gold: #FFD700;
  --cream: #FFF8F0;
  --charcoal: #4A4A4A;
  --red-line: #FFAAAA;
}

* {
  box-sizing: border-box;
}

body {
  background: #e8dfd8;
  background-image:
    radial-gradient(ellipse at 20% 50%, #d4c4b8 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, #e0d4cc 0%, transparent 60%);
  min-height: 100vh;
  font-family: "Nunito", sans-serif;
  color: var(--charcoal);
  overflow-x: hidden;
}

/* Lined paper effect */
.lined-paper {
  background-color: var(--cream);
  background-image:
    /* Red margin line */
    linear-gradient(90deg, transparent 48px, var(--red-line) 48px, var(--red-line) 50px, transparent 50px),
    /* Horizontal lines */
    repeating-linear-gradient(
      transparent,
      transparent 30px,
      #d4d0c8 30px,
      #d4d0c8 31px
    );
  background-attachment: local;
}

/* Spiral binding dots */
.spiral-binding {
  background:
    radial-gradient(circle at 50% 50%, #888 0%, #555 40%, transparent 41%) 0 20px / 24px 24px repeat-y,
    linear-gradient(#777, #777) 50% 0 / 2px 100% no-repeat;
}

/* Gel pen strikethrough animation */
@keyframes strikethrough {
  from { stroke-dashoffset: 100; }
  to { stroke-dashoffset: 0; }
}

.gel-pen-strike {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: strikethrough 0.4s ease-out forwards;
}

/* Sticker pop */
@keyframes stickerPop {
  0% { transform: scale(0) rotate(-10deg); }
  60% { transform: scale(1.2) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.sticker-pop {
  animation: stickerPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Page perspective for 3D flip */
.diary-perspective {
  perspective: 2000px;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #d4c4b8; }
::-webkit-scrollbar-thumb { background: var(--lavender); border-radius: 3px; }
```

**Step 5: Stub out App.jsx**

```jsx
import './index.css'

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="font-handwriting text-4xl text-pink-diary">UNLINK 💔</h1>
    </div>
  )
}

export default App
```

**Step 6: Verify**

```bash
npm run dev
```
Expected: Pink "UNLINK 💔" in Caveat font centered on brownish background.

**Step 7: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Vite React project with Tailwind + Framer Motion"
```

---

### Task 1: DiaryContext — State management + localStorage

**Files:**
- Create: `src/context/DiaryContext.jsx`

**Step 1: Create the context file**

```jsx
// src/context/DiaryContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const defaultState = {
  assessment: {
    sharedPhonePlan: null,
    jointBankAccount: null,
    sharedStreaming: null,
    locationSharingOn: null,
    sharedCloud: null,
    sharedSocialLogins: null,
  },
  checklist: {
    ch2: {},
    ch3: {},
    ch4: {},
    ch5: {},
  },
  achievements: [],
  dearFutureMe: '',
  assessmentComplete: false,
}

const DiaryContext = createContext(null)

export function DiaryProvider({ children }) {
  const [diary, setDiary] = useState(() => {
    try {
      const saved = localStorage.getItem('unlink_diary')
      return saved ? JSON.parse(saved) : defaultState
    } catch {
      return defaultState
    }
  })

  useEffect(() => {
    localStorage.setItem('unlink_diary', JSON.stringify(diary))
  }, [diary])

  function setAssessment(answers) {
    setDiary(prev => ({
      ...prev,
      assessment: { ...prev.assessment, ...answers },
      assessmentComplete: true,
    }))
  }

  function toggleChecklistItem(chapterId, itemId) {
    setDiary(prev => {
      const current = prev.checklist[chapterId]?.[itemId] || false
      return {
        ...prev,
        checklist: {
          ...prev.checklist,
          [chapterId]: {
            ...prev.checklist[chapterId],
            [itemId]: !current,
          },
        },
      }
    })
  }

  function isChecked(chapterId, itemId) {
    return !!diary.checklist[chapterId]?.[itemId]
  }

  function chapterProgress(chapterId, itemIds) {
    const checked = itemIds.filter(id => isChecked(chapterId, id)).length
    return { checked, total: itemIds.length, percent: itemIds.length ? (checked / itemIds.length) * 100 : 0 }
  }

  function earnAchievement(id) {
    if (!diary.achievements.includes(id)) {
      setDiary(prev => ({ ...prev, achievements: [...prev.achievements, id] }))
    }
  }

  function setDearFutureMe(text) {
    setDiary(prev => ({ ...prev, dearFutureMe: text }))
  }

  function resetAll() {
    setDiary(defaultState)
  }

  return (
    <DiaryContext.Provider value={{
      diary,
      setAssessment,
      toggleChecklistItem,
      isChecked,
      chapterProgress,
      earnAchievement,
      setDearFutureMe,
      resetAll,
    }}>
      {children}
    </DiaryContext.Provider>
  )
}

export function useDiary() {
  const ctx = useContext(DiaryContext)
  if (!ctx) throw new Error('useDiary must be used inside DiaryProvider')
  return ctx
}
```

**Step 2: Wrap app in provider in main.jsx**

```jsx
// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DiaryProvider } from './context/DiaryContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DiaryProvider>
      <App />
    </DiaryProvider>
  </StrictMode>,
)
```

**Step 3: Verify (no visual change, just no console errors)**

```bash
npm run dev
```

**Step 4: Commit**

```bash
git add src/context/DiaryContext.jsx src/main.jsx
git commit -m "feat: add DiaryContext with localStorage persistence"
```

---

### Task 2: Routing + DiaryBook shell

**Files:**
- Create: `src/components/DiaryBook.jsx`
- Create: `src/components/ProgressSpine.jsx`
- Modify: `src/App.jsx`

**Step 1: Create the DiaryBook shell**

```jsx
// src/components/DiaryBook.jsx
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
    <div className="flex items-start justify-center min-h-screen py-8 px-4">
      <div className="relative w-full max-w-md">
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
                className="lined-paper min-h-screen"
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
```

**Step 2: Create the ProgressSpine**

```jsx
// src/components/ProgressSpine.jsx
import { useDiary } from '../context/DiaryContext'
import { useNavigate, useLocation } from 'react-router-dom'

const CHAPTERS = [
  { path: '/', label: '✦', title: 'Cover' },
  { path: '/chapter/1', label: '1', title: 'Starting Over' },
  { path: '/chapter/2', label: '2', title: 'Locking My Diary' },
  { path: '/chapter/3', label: '3', title: 'Unfriending' },
  { path: '/chapter/4', label: '4', title: 'Splitting the Bill' },
  { path: '/chapter/5', label: '5', title: 'Address Book' },
  { path: '/fresh-start', label: '★', title: 'Fresh Start' },
]

export default function ProgressSpine({ accentColor }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      {CHAPTERS.map((ch) => {
        const isActive = location.pathname === ch.path
        return (
          <button
            key={ch.path}
            onClick={() => navigate(ch.path)}
            title={ch.title}
            className="w-6 h-6 rounded-full text-xs font-handwriting font-bold transition-all duration-200 flex items-center justify-center"
            style={{
              background: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
              color: isActive ? accentColor : '#fff',
              transform: isActive ? 'scale(1.2)' : 'scale(1)',
            }}
          >
            {ch.label}
          </button>
        )
      })}
    </div>
  )
}
```

**Step 3: Set up routing in App.jsx**

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import DiaryBook from './components/DiaryBook'
import DiaryCover from './pages/DiaryCover'
import ChapterOnboarding from './pages/ChapterOnboarding'
import ChapterDevices from './pages/ChapterDevices'
import ChapterSocial from './pages/ChapterSocial'
import ChapterFinances from './pages/ChapterFinances'
import ChapterResources from './pages/ChapterResources'
import FreshStartDashboard from './pages/FreshStartDashboard'

// Stub pages so routing works before each is built
const Stub = ({ title }) => (
  <div className="p-8 font-handwriting text-2xl text-charcoal-diary">{title} — coming soon</div>
)

const ROUTE_ORDER = ['/', '/chapter/1', '/chapter/2', '/chapter/3', '/chapter/4', '/chapter/5', '/fresh-start']

function AppInner() {
  const location = useLocation()
  const directionRef = useRef(1)

  return (
    <DiaryBook direction={directionRef.current}>
      <Routes location={location}>
        <Route path="/" element={<DiaryCover />} />
        <Route path="/chapter/1" element={<ChapterOnboarding />} />
        <Route path="/chapter/2" element={<ChapterDevices />} />
        <Route path="/chapter/3" element={<ChapterSocial />} />
        <Route path="/chapter/4" element={<ChapterFinances />} />
        <Route path="/chapter/5" element={<ChapterResources />} />
        <Route path="/fresh-start" element={<FreshStartDashboard />} />
      </Routes>
    </DiaryBook>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
```

**Step 4: Create stub page files (so imports don't break)**

Create each of these with just a stub:

`src/pages/DiaryCover.jsx`:
```jsx
export default function DiaryCover() {
  return <div className="p-8 font-handwriting text-2xl">Cover stub</div>
}
```

Repeat for: `ChapterOnboarding`, `ChapterDevices`, `ChapterSocial`, `ChapterFinances`, `ChapterResources`, `FreshStartDashboard`

**Step 5: Verify**

```bash
npm run dev
```
Expected: Diary book shell with colored spine on left, lined paper background, spine navigation dots. Clicking dots navigates routes.

**Step 6: Commit**

```bash
git add src/
git commit -m "feat: add routing, DiaryBook shell, and ProgressSpine"
```

---

### Task 3: Shared Components — DiaryEntry, ChecklistItem, PageHeader

**Files:**
- Create: `src/components/DiaryEntry.jsx`
- Create: `src/components/ChecklistItem.jsx`
- Create: `src/components/PageHeader.jsx`
- Create: `src/components/StickerBurst.jsx`
- Create: `src/components/Stickers.jsx`

**Step 1: Create inline SVG sticker library**

```jsx
// src/components/Stickers.jsx
export function LockSticker({ size = 32, color = '#C3B1E1' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="6" y="14" width="20" height="14" rx="3" fill={color} />
      <rect x="6" y="14" width="20" height="14" rx="3" stroke="#fff" strokeWidth="1.5" />
      <path d="M10 14v-4a6 6 0 0112 0v4" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="16" cy="21" r="2" fill="#fff" />
    </svg>
  )
}

export function HeartSticker({ size = 32, color = '#FFB5C2' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 27s-11-7-11-14a7 7 0 0111-5.7A7 7 0 0127 13c0 7-11 14-11 14z" fill={color} stroke="#fff" strokeWidth="1.5" />
    </svg>
  )
}

export function StarSticker({ size = 32, color = '#FFD700' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 3l3.09 9.5H29l-8 5.82 3.09 9.5L16 22.6l-8.09 5.22L11 18.32 3 12.5h9.91L16 3z" fill={color} stroke="#fff" strokeWidth="1" />
    </svg>
  )
}

export function ButterflySticker({ size = 36, color = '#A7C7E7' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <ellipse cx="10" cy="14" rx="8" ry="10" fill={color} opacity="0.8" transform="rotate(-15 10 14)" />
      <ellipse cx="26" cy="14" rx="8" ry="10" fill={color} opacity="0.8" transform="rotate(15 26 14)" />
      <ellipse cx="11" cy="22" rx="6" ry="7" fill={color} opacity="0.6" transform="rotate(15 11 22)" />
      <ellipse cx="25" cy="22" rx="6" ry="7" fill={color} opacity="0.6" transform="rotate(-15 25 22)" />
      <line x1="18" y1="8" x2="18" y2="28" stroke="#4A4A4A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 8 Q15 4 12 5" stroke="#4A4A4A" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M18 8 Q21 4 24 5" stroke="#4A4A4A" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function CheckSticker({ size = 28, color = '#B5EAD7' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="12" fill={color} />
      <path d="M8 14l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function KeySticker({ size = 32, color = '#FFD700' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="11" cy="13" r="7" fill={color} stroke="#fff" strokeWidth="1.5" />
      <circle cx="11" cy="13" r="3" fill="#fff" />
      <rect x="18" y="12" width="10" height="3" rx="1.5" fill={color} />
      <rect x="24" y="15" width="3" height="4" rx="1" fill={color} />
      <rect x="19" y="15" width="3" height="3" rx="1" fill={color} />
    </svg>
  )
}
```

**Step 2: Create ChecklistItem component**

```jsx
// src/components/ChecklistItem.jsx
import { motion } from 'framer-motion'
import { CheckSticker } from './Stickers'

export default function ChecklistItem({ id, chapterId, label, sublabel, isChecked, onToggle, stickerColor }) {
  return (
    <motion.div
      className="flex items-start gap-3 py-3 px-2 rounded-lg cursor-pointer group"
      whileHover={{ backgroundColor: 'rgba(255,181,194,0.1)' }}
      onClick={() => onToggle(chapterId, id)}
    >
      {/* Custom checkbox */}
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

      {/* Label */}
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

      {/* Sticker that pops on completion */}
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
```

**Step 3: Create DiaryEntry component (lined paper block)**

```jsx
// src/components/DiaryEntry.jsx
export default function DiaryEntry({ children, className = '' }) {
  return (
    <div className={`relative pl-14 pr-4 py-4 ${className}`}>
      {/* Margin line already provided by CSS background on .lined-paper */}
      <div className="font-handwriting text-base leading-8 text-charcoal-diary">
        {children}
      </div>
    </div>
  )
}
```

**Step 4: Create PageHeader component**

```jsx
// src/components/PageHeader.jsx
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
```

**Step 5: Create StickerBurst (confetti celebration)**

```jsx
// src/components/StickerBurst.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const EMOJIS = ['⭐', '💜', '🦋', '✨', '🔑', '💖', '🌸', '🎉']

function Particle({ emoji, delay }) {
  const x = (Math.random() - 0.5) * 300
  const y = (Math.random() - 0.5) * 300
  const rotation = Math.random() * 720 - 360

  return (
    <motion.div
      className="absolute text-2xl pointer-events-none"
      style={{ top: '50%', left: '50%' }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
      animate={{ x, y, opacity: 0, scale: 1.5, rotate: rotation }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    >
      {emoji}
    </motion.div>
  )
}

export default function StickerBurst({ trigger, onComplete }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        emoji: EMOJIS[i % EMOJIS.length],
        delay: i * 0.04,
      }))
      setParticles(newParticles)
      const t = setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, 1200)
      return () => clearTimeout(t)
    }
  }, [trigger])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <AnimatePresence>
        {particles.map(p => (
          <Particle key={p.id} emoji={p.emoji} delay={p.delay} />
        ))}
      </AnimatePresence>
    </div>
  )
}
```

**Step 6: Verify** — Run dev server, no errors expected.

**Step 7: Commit**

```bash
git add src/components/
git commit -m "feat: add shared components (stickers, checklist, diary entry, page header)"
```

---

### Task 4: DiaryCover — The animated diary landing page

**Files:**
- Modify: `src/pages/DiaryCover.jsx`

**Step 1: Build the diary cover page**

```jsx
// src/pages/DiaryCover.jsx
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

        {/* Divider with stars */}
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
          className="w-full py-4 rounded-xl font-handwriting text-xl font-bold text-white shadow-lg transition-all"
          style={{
            background: 'linear-gradient(135deg, #FFB5C2, #C3B1E1)',
          }}
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

      {/* Doodle text at bottom */}
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
```

**Step 2: Verify**
Open browser. Should see: gradient pink→purple→blue cover with animated stickers, UNLINK title, "Open My Diary" button. Clicking should animate and navigate to `/chapter/1`.

**Step 3: Commit**

```bash
git add src/pages/DiaryCover.jsx
git commit -m "feat: build DiaryCover with lock animation and opening sequence"
```

---

### Task 5: Chapter 1 — Assessment Quiz ("Dear Diary, I'm Starting Over")

**Files:**
- Modify: `src/pages/ChapterOnboarding.jsx`
- Create: `src/components/NavigationButtons.jsx`

**Step 1: Create shared navigation buttons**

```jsx
// src/components/NavigationButtons.jsx
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const ROUTE_ORDER = ['/', '/chapter/1', '/chapter/2', '/chapter/3', '/chapter/4', '/chapter/5', '/fresh-start']

export default function NavigationButtons({ currentPath, canContinue = true, onContinue }) {
  const navigate = useNavigate()
  const currentIndex = ROUTE_ORDER.indexOf(currentPath)
  const prevPath = currentIndex > 0 ? ROUTE_ORDER[currentIndex - 1] : null
  const nextPath = currentIndex < ROUTE_ORDER.length - 1 ? ROUTE_ORDER[currentIndex + 1] : null

  function handleNext() {
    if (onContinue) onContinue()
    if (nextPath) navigate(nextPath)
  }

  return (
    <div className="flex items-center justify-between px-4 py-6">
      {prevPath ? (
        <motion.button
          onClick={() => navigate(prevPath)}
          className="font-handwriting text-base px-4 py-2 rounded-full border-2 transition-colors"
          style={{ borderColor: '#C3B1E1', color: '#C3B1E1' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>
      ) : <div />}

      {nextPath && (
        <motion.button
          onClick={handleNext}
          disabled={!canContinue}
          className="font-handwriting text-base px-6 py-2 rounded-full text-white font-bold shadow-md transition-all"
          style={{
            background: canContinue
              ? 'linear-gradient(135deg, #FFB5C2, #C3B1E1)'
              : '#ddd',
            cursor: canContinue ? 'pointer' : 'not-allowed',
          }}
          whileHover={canContinue ? { scale: 1.05 } : {}}
          whileTap={canContinue ? { scale: 0.95 } : {}}
        >
          Next Page →
        </motion.button>
      )}
    </div>
  )
}
```

**Step 2: Build Chapter 1 — Assessment quiz**

```jsx
// src/pages/ChapterOnboarding.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DiaryEntry from '../components/DiaryEntry'
import { useDiary } from '../context/DiaryContext'
import { StarSticker, HeartSticker } from '../components/Stickers'
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

  const allAnswered = QUESTIONS.every(q => answers[q.id] !== null)
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
            className="bg-pink-diary bg-opacity-10 rounded-xl p-4 mb-4 border-2"
            style={{ borderColor: '#FFB5C2', borderStyle: 'dashed' }}
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
              width: i === currentQ ? 20 : 10,
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
```

**Step 3: Verify**

Open browser, navigate to `/chapter/1`. Should see: animated quiz cards, yes/no buttons, progress dots advancing, confetti when done, personalized summary.

**Step 4: Commit**

```bash
git add src/pages/ChapterOnboarding.jsx src/components/NavigationButtons.jsx
git commit -m "feat: build Chapter 1 assessment quiz with personalized summary"
```

---

### Task 6: Chapter 2 — Devices & Passwords ("Locking My Diary")

**Files:**
- Modify: `src/pages/ChapterDevices.jsx`

**Step 1: Build Chapter 2**

```jsx
// src/pages/ChapterDevices.jsx
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DiaryEntry from '../components/DiaryEntry'
import ChecklistItem from '../components/ChecklistItem'
import { useDiary } from '../context/DiaryContext'
import { LockSticker, StarSticker } from '../components/Stickers'
import StickerBurst from '../components/StickerBurst'
import { useState, useEffect } from 'react'

const CHAPTER_ID = 'ch2'

const ITEMS = [
  { id: 'phone_pin', label: 'Change your phone PIN / passcode', sublabel: 'Settings → Face ID & Passcode (iPhone) or Screen Lock (Android)' },
  { id: 'laptop_pw', label: 'Change your laptop/computer password', sublabel: 'System Settings → Login Password' },
  { id: 'email_pw', label: 'Change your primary email password', sublabel: 'Gmail, Outlook, Apple Mail — do this first' },
  { id: 'email_2fa', label: 'Enable 2-factor authentication on email', sublabel: 'Use an authenticator app, NOT SMS if possible' },
  { id: 'icloud_safety', label: 'Run Apple Safety Check (iPhone users)', sublabel: 'Settings → Privacy & Security → Safety Check → Emergency Reset' },
  { id: 'google_safety', label: 'Run Google Security Checkup (Android/Gmail)', sublabel: 'myaccount.google.com → Security → Security Checkup' },
  { id: 'cloud_pw', label: 'Change iCloud / Google Account password', sublabel: 'This covers photos, backups, and Find My' },
  { id: 'stalkerware', label: 'Check for unfamiliar apps (stalkerware check)', sublabel: 'Look for apps you didn\'t install. Coalition Against Stalkerware has a guide.' },
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
      setBurst(true)
      setCelebrated(true)
      earnAchievement('ch2_complete')
    }
  }, [percent])

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
```

**Step 2: Verify**

Navigate to `/chapter/2`. Should see: checklist items, lock meter that fills as you check items, confetti when all done.

**Step 3: Commit**

```bash
git add src/pages/ChapterDevices.jsx
git commit -m "feat: build Chapter 2 devices/passwords checklist with lock meter"
```

---

### Task 7: Chapter 3 — Social Media & Location ("Unfriending & Unfollowing")

**Files:**
- Modify: `src/pages/ChapterSocial.jsx`
- Create: `src/components/PlatformCard.jsx`

**Step 1: Create PlatformCard component**

```jsx
// src/components/PlatformCard.jsx
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function PlatformCard({ platform, icon, color, steps, chapterId, cardId, isComplete, onComplete }) {
  const [expanded, setExpanded] = useState(false)
  const [done, setDone] = useState(isComplete)

  function markDone() {
    setDone(true)
    onComplete?.(cardId)
    setExpanded(false)
  }

  return (
    <motion.div
      className="mb-3 rounded-xl overflow-hidden shadow-sm"
      style={{ border: `2px solid ${done ? '#B5EAD7' : color}` }}
      whileHover={{ y: -2 }}
    >
      {/* Card header — Polaroid style */}
      <button
        className="w-full flex items-center gap-3 p-3 text-left"
        style={{ background: done ? '#B5EAD720' : `${color}15` }}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <p className="font-handwriting text-base font-bold" style={{ color: done ? '#B5EAD7' : '#4A4A4A' }}>
            {platform}
          </p>
          <p className="font-body text-xs" style={{ color: '#aaa' }}>
            {done ? '✓ Done!' : `${steps.length} steps`}
          </p>
        </div>
        {done ? (
          <motion.span
            className="text-xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            ✅
          </motion.span>
        ) : (
          <span style={{ color: '#ccc' }}>{expanded ? '▲' : '▼'}</span>
        )}
      </button>

      {/* Steps dropdown */}
      {expanded && !done && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 pb-3"
        >
          <ol className="mt-2 space-y-2">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-handwriting text-sm font-bold flex-shrink-0" style={{ color }}>
                  {i + 1}.
                </span>
                <p className="font-body text-sm" style={{ color: '#4A4A4A' }}>{step}</p>
              </li>
            ))}
          </ol>
          <motion.button
            className="mt-3 w-full py-2 rounded-lg font-handwriting text-sm font-bold text-white"
            style={{ background: color }}
            whileTap={{ scale: 0.97 }}
            onClick={markDone}
          >
            ✓ Mark as Done
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}
```

**Step 2: Build Chapter 3**

```jsx
// src/pages/ChapterSocial.jsx
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DiaryEntry from '../components/DiaryEntry'
import PlatformCard from '../components/PlatformCard'
import { useDiary } from '../context/DiaryContext'
import StickerBurst from '../components/StickerBurst'
import { useState, useEffect } from 'react'

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
    color: '#FFFC00',
    steps: [
      'Profile → ⚙️ → See My Location → set to Ghost Mode',
      'Block: profile → ⋮ → Block',
      'Settings → Privacy → change "Who can contact me" to Friends',
    ],
  },
  {
    id: 'tiktok',
    platform: 'TikTok',
    icon: '🎵',
    color: '#000000',
    steps: [
      'Settings → Privacy → set account to Private',
      'Block: profile → ··· → Block',
      'Settings → Privacy → turn off "Suggest your account to others"',
    ],
  },
  {
    id: 'facebook',
    platform: 'Facebook',
    icon: '📘',
    color: '#1877F2',
    steps: [
      'Settings → Privacy → "Who can see your future posts" → Friends',
      'Settings → Location → turn off location services for Facebook app',
      'Block: profile → ··· → Block',
      'Settings → Security → Where You're Logged In → remove unknown sessions',
    ],
  },
  {
    id: 'findmy',
    platform: 'Find My / Life360',
    icon: '📍',
    color: '#4CD964',
    steps: [
      'iPhone: Settings → [Your Name] → Find My → Share My Location → toggle OFF',
      'Or select who you\'re sharing with and tap "Stop Sharing My Location"',
      'Life360: Settings → turn off location sharing or leave the circle',
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

  useEffect(() => {
    if (percent === 100 && !celebrated) {
      setBurst(true)
      setCelebrated(true)
      earnAchievement('ch3_complete')
    }
  }, [percent])

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
            {Math.round(percent / (100/PLATFORMS.length))} / {PLATFORMS.length}
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
              chapterId={CHAPTER_ID}
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
```

**Step 3: Verify** — Navigate to `/chapter/3`. Platform cards expand/collapse, marking done checks the item, progress bar fills.

**Step 4: Commit**

```bash
git add src/pages/ChapterSocial.jsx src/components/PlatformCard.jsx
git commit -m "feat: build Chapter 3 social media cards with step-by-step guides"
```

---

### Task 8: Chapter 4 — Finances ("Splitting the Bill")

**Files:**
- Modify: `src/pages/ChapterFinances.jsx`

**Step 1: Build Chapter 4**

```jsx
// src/pages/ChapterFinances.jsx
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DiaryEntry from '../components/DiaryEntry'
import ChecklistItem from '../components/ChecklistItem'
import { useDiary } from '../context/DiaryContext'
import StickerBurst from '../components/StickerBurst'
import { useState, useEffect } from 'react'

const CHAPTER_ID = 'ch4'

const ITEMS = [
  { id: 'bank_acct', label: 'Open a new bank account in your name only', sublabel: 'Many banks let you do this online in 10 minutes' },
  { id: 'bank_remove', label: 'Remove him as an authorized user from joint accounts', sublabel: 'Call the bank directly — you may need to close and reopen' },
  { id: 'credit_card', label: 'Remove him from any shared credit cards', sublabel: 'Contact card issuer — authorized user removal is usually instant' },
  { id: 'phone_plan', label: 'Separate from the shared phone plan', sublabel: 'FCC Safe Connections Act (2022) — carriers must let survivors separate. Call your carrier and say you\'re a domestic violence survivor.' },
  { id: 'direct_deposit', label: 'Update your direct deposit to your new account', sublabel: 'Contact HR or your bank with your new account info' },
  { id: 'streaming', label: 'Change passwords or cancel shared streaming accounts', sublabel: 'Netflix, Spotify, Disney+, Hulu, HBO Max, Apple One' },
  { id: 'amazon', label: 'Remove him from Amazon Household / change payment method', sublabel: 'amazon.com → Account → Amazon Household → leave or manage members' },
  { id: 'venmo_paypal', label: 'Update Venmo/PayPal/Cash App privacy settings', sublabel: 'Set transactions to Private. Remove any linked shared accounts.' },
  { id: 'subscriptions', label: 'Audit and update billing info for all subscriptions', sublabel: 'Check your email for "receipt" emails to find every service' },
]

function ReceiptStamp({ visible }) {
  if (!visible) return null
  return (
    <motion.div
      className="absolute top-4 right-4 rotate-[-15deg]"
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
      setBurst(true)
      setCelebrated(true)
      earnAchievement('ch4_complete')
    }
  }, [percent])

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
```

**Step 2: Verify** — Navigate to `/chapter/4`. Receipt aesthetic, "PAID IN FULL" stamp animates when 100% done.

**Step 3: Commit**

```bash
git add src/pages/ChapterFinances.jsx
git commit -m "feat: build Chapter 4 finances with receipt aesthetic and FCC callout"
```

---

### Task 9: Chapter 5 — Emergency Resources ("My New Address Book")

**Files:**
- Modify: `src/pages/ChapterResources.jsx`

**Step 1: Build Chapter 5**

```jsx
// src/pages/ChapterResources.jsx
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import DiaryEntry from '../components/DiaryEntry'
import { HeartSticker, StarSticker } from '../components/Stickers'

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
    description: 'Free 24/7 text support. Works when you can\'t make a call.',
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
  'Store copies in a cloud account HE doesn\'t have access to',
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
          style={{ background: 'rgba(255,210,161,0.15)', border: '2px dashed #FFDAA1' }}
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
            placeholder="Name, phone number...&#10;Name, phone number..."
          />
        </motion.div>

        {/* CTA to final chapter */}
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
```

**Step 2: Verify** — Navigate to `/chapter/5`. Hotline cards, evidence tips, safety circle textarea, navigation to Fresh Start.

**Step 3: Commit**

```bash
git add src/pages/ChapterResources.jsx
git commit -m "feat: build Chapter 5 resources with hotlines and evidence tips"
```

---

### Task 10: Fresh Start Dashboard

**Files:**
- Modify: `src/pages/FreshStartDashboard.jsx`

**Step 1: Build the Fresh Start page**

```jsx
// src/pages/FreshStartDashboard.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDiary } from '../context/DiaryContext'
import { LockSticker, HeartSticker, StarSticker, ButterflySticker, KeySticker } from '../components/Stickers'
import StickerBurst from '../components/StickerBurst'
import { useState, useEffect } from 'react'

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

        {/* Overall progress ring (simplified as bar) */}
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

        {/* Chapter progress */}
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
            placeholder="Dear future me,&#10;&#10;I did it. I took back..."
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

        {/* Reset option */}
        <div className="text-center">
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
```

**Step 2: Verify** — Navigate to `/fresh-start`. See: overall progress bar, earned achievements, chapter progress cards, "Dear Future Me" letter textarea, empowerment message.

**Step 3: Commit**

```bash
git add src/pages/FreshStartDashboard.jsx
git commit -m "feat: build Fresh Start dashboard with achievements, progress, and Dear Future Me letter"
```

---

### Task 11: Final Polish — Typography, mobile layout, accessibility

**Files:**
- Modify: `src/index.css`
- Modify: `src/components/DiaryBook.jsx`
- Modify: `index.html`

**Step 1: Add Google Fonts to index.html**

```html
<!-- Add in <head> before other stylesheets -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet">
<title>UNLINK — The Digital Breakup Kit</title>
<meta name="description" content="Your diary. Your data. Your fresh start. A guide to reclaiming your digital life.">
```

**Step 2: Add font utilities to Tailwind config**

Verify `tailwind.config.js` has:
```js
fontFamily: {
  handwriting: ["Caveat", "cursive"],
  body: ["Nunito", "sans-serif"],
},
```

And add utility classes to index.css:
```css
.font-handwriting { font-family: "Caveat", cursive; }
.font-body { font-family: "Nunito", sans-serif; }
```

**Step 3: Improve DiaryBook mobile layout**

Update `DiaryBook.jsx` — add better padding and ensure content area respects safe areas:
```jsx
// In the outer container div, change py-8 to:
className="flex items-start justify-center min-h-screen py-4 px-2 sm:py-8 sm:px-4"

// In max-w wrapper, add:
className="relative w-full max-w-sm sm:max-w-md"
```

**Step 4: Add meta viewport and safe area to index.html**

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

**Step 5: Final run-through**

Go through every page manually:
- [ ] Cover: loads, lock animation works, navigates to Chapter 1
- [ ] Chapter 1: quiz works, personalized summary generates
- [ ] Chapter 2: checklist items check/uncheck, meter fills, confetti fires at 100%
- [ ] Chapter 3: platform cards expand, steps show, "Mark as Done" works
- [ ] Chapter 4: checklist works, PAID IN FULL stamp appears at 100%
- [ ] Chapter 5: hotlines display, textarea accepts input
- [ ] Fresh Start: progress shows, achievements display, letter saves
- [ ] Spine nav: clicking dots navigates between chapters
- [ ] Refresh page: localStorage persists all state

**Step 6: Final commit**

```bash
git add .
git commit -m "feat: complete UNLINK app — all 5 chapters, Fresh Start, and polish"
```

---

### Task 12: Deploy to Vercel

**Step 1: Push to GitHub**

```bash
gh repo create unlink --public --source=. --push
```

**Step 2: Deploy**

```bash
npx vercel --yes
```

Or connect the GitHub repo at vercel.com for automatic deploys on push.

**Step 3: Verify live URL**

Open the Vercel URL in mobile browser. Test on iPhone viewport.

---

## Summary

Total commits: ~12
Estimated build time: 8-10 hours
Output: A fully working, beautifully designed 7-page diary app with animations, interactive checklists, progress tracking, achievements, and zero data collection.
