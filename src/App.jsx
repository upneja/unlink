import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import DiaryBook from './components/DiaryBook'
import DiaryCover from './pages/DiaryCover'
import ChapterOnboarding from './pages/ChapterOnboarding'
import ChapterDevices from './pages/ChapterDevices'
import ChapterSocial from './pages/ChapterSocial'
import ChapterFinances from './pages/ChapterFinances'
import ChapterResources from './pages/ChapterResources'
import FreshStartDashboard from './pages/FreshStartDashboard'

const ROUTE_ORDER = ['/', '/chapter/1', '/chapter/2', '/chapter/3', '/chapter/4', '/chapter/5', '/fresh-start']

function AppInner() {
  const location = useLocation()
  const [direction, setDirection] = useState(1)
  const prevPath = useRef(location.pathname)

  useEffect(() => {
    const prev = ROUTE_ORDER.indexOf(prevPath.current)
    const next = ROUTE_ORDER.indexOf(location.pathname)
    setDirection(next >= prev ? 1 : -1)
    prevPath.current = location.pathname
  }, [location.pathname])

  return (
    <DiaryBook direction={direction}>
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
