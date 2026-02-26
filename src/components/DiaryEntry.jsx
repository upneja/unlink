export default function DiaryEntry({ children, className = '' }) {
  return (
    <div className={`relative pl-14 pr-4 py-4 ${className}`}>
      <div className="font-handwriting text-base leading-8" style={{ color: '#4A4A4A' }}>
        {children}
      </div>
    </div>
  )
}
