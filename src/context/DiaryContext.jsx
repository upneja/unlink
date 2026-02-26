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
  safetyCircle: '',
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
    setDiary(prev => {
      if (prev.achievements.includes(id)) return prev
      return { ...prev, achievements: [...prev.achievements, id] }
    })
  }

  function setDearFutureMe(text) {
    setDiary(prev => ({ ...prev, dearFutureMe: text }))
  }

  function setSafetyCircle(text) {
    setDiary(prev => ({ ...prev, safetyCircle: text }))
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
      setSafetyCircle,
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
