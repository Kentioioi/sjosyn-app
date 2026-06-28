import { useState } from 'react'

const CORRECT_PIN = import.meta.env.VITE_APP_PIN ?? '3476'
// Session-only unlock: the PIN is needed to decrypt stored API credentials,
// so it must be entered once per app launch. sessionStorage survives reloads
// within the same session but is wiped when the PWA is closed.
const SESSION_KEY = 'mw_session_pin'

export default function PinGate({ children }) {
  const [pin, setPin] = useState(() => {
    // Clean up the old persistent-unlock flag from previous versions
    localStorage.removeItem('mw_unlocked')
    const saved = sessionStorage.getItem(SESSION_KEY)
    return saved === CORRECT_PIN ? saved : null
  })
  const [digits, setDigits] = useState('')
  const [shake, setShake] = useState(false)

  function press(d) {
    if (digits.length >= 4) return
    const next = digits + d
    setDigits(next)

    if (next.length === 4) {
      if (next === CORRECT_PIN) {
        sessionStorage.setItem(SESSION_KEY, next)
        // Brief pause so the last dot fills before revealing the app
        setTimeout(() => setPin(next), 200)
      } else {
        setShake(true)
        setTimeout(() => { setDigits(''); setShake(false) }, 600)
      }
    }
  }

  function backspace() {
    setDigits(d => d.slice(0, -1))
  }

  // Children can be a render function receiving the PIN (used to decrypt
  // stored credentials) or plain elements.
  if (pin) return typeof children === 'function' ? children(pin) : children

  return (
    <div className="pin-screen">
      <div className="pin-logo">⚓</div>
      <div className="pin-title">Sjøsyn</div>

      {/* 4 dot indicators */}
      <div className={`pin-dots${shake ? ' pin-shake' : ''}`}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`pin-dot${i < digits.length ? ' filled' : ''}`} />
        ))}
      </div>

      {/* Number pad */}
      <div className="pin-pad">
        {['1','2','3','4','5','6','7','8','9'].map(d => (
          <button key={d} className="pin-key" onClick={() => press(d)}>{d}</button>
        ))}
        {/* Bottom row: blank, 0, backspace */}
        <div />
        <button className="pin-key" onClick={() => press('0')}>0</button>
        <button className="pin-key pin-key--back" onClick={backspace}>⌫</button>
      </div>
    </div>
  )
}
