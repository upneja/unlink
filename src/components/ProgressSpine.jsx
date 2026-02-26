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
