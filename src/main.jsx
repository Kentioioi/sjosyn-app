import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.jsx'
import PinGate from './components/PinGate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PinGate>
      {pin => <App pin={pin} />}
    </PinGate>
  </StrictMode>,
)
