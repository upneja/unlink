import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import DiaryBook from './components/DiaryBook'
import DiaryCover from './pages/DiaryCover'

// Stub pages — will be replaced in subsequent tasks
const Stub = ({ title, color }) => (
  <div className="p-8 pl-14 font-handwriting text-2xl" style={{ color: color || '#4A4A4A' }}>
    {title}
  </div>
)

function AppInner() {
  const location = useLocation()

  return (
    <DiaryBook>
      <Routes location={location}>
        <Route path="/" element={<DiaryCover />} />
        <Route path="/chapter/1" element={<Stub title="📖 Chapter 1: Starting Over" color="#FFB5C2" />} />
        <Route path="/chapter/2" element={<Stub title="🔒 Chapter 2: Locking My Diary" color="#C3B1E1" />} />
        <Route path="/chapter/3" element={<Stub title="📱 Chapter 3: Unfriending" color="#A7C7E7" />} />
        <Route path="/chapter/4" element={<Stub title="💳 Chapter 4: Splitting the Bill" color="#B5EAD7" />} />
        <Route path="/chapter/5" element={<Stub title="📒 Chapter 5: Address Book" color="#FFDAA1" />} />
        <Route path="/fresh-start" element={<Stub title="✨ Fresh Start Dashboard" color="#FFD700" />} />
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
