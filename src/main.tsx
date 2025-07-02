import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '../apps/page.tsx'
import SheltersPage from '../apps/shelter/page.tsx'
import ShelterDetailPage from '../apps/shelter/detail/page.tsx'
import '../apps/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shelter" element={<SheltersPage />} />
        <Route path="/shelter/:id" element={<ShelterDetailPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
