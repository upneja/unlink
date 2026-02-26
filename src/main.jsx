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
