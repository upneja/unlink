import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import DiaryBook from './components/DiaryBook'
import DiaryCover from './pages/DiaryCover'
import ChapterOnboarding from './pages/ChapterOnboarding'
import ChapterDevices from './pages/ChapterDevices'
import ChapterSocial from './pages/ChapterSocial'
import ChapterFinances from './pages/ChapterFinances'

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
        <Route path="/chapter/1" element={<ChapterOnboarding />} />
        <Route path="/chapter/2" element={<ChapterDevices />} />
        <Route path="/chapter/3" element={<ChapterSocial />} />
        <Route path="/chapter/4" element={<ChapterFinances />} />
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
