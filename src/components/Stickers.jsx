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
