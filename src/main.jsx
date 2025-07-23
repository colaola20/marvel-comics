import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import './index.css'
import App from './App.jsx'
import Layout from './routes/Layout'
import DetailView from './routes/DetailView.jsx'
import { ComicsProvider } from './ComicsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ComicsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<App />} />
            <Route path="/comicDetails/:id" element={<DetailView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ComicsProvider>
  </StrictMode>,
)
