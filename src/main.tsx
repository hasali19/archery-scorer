import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import { HomePage } from './pages/HomePage'
import { SessionPage } from './pages/SessionPage'
import { ScoresPage } from './pages/ScoresPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/session/:id" element={<SessionPage />} />
          <Route path="/session/:id/archer/:archerId/scores" element={<ScoresPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
)
