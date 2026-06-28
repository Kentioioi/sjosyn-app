// PIN-encrypted credential storage.
// The Barentswatch client ID/secret are encrypted with AES-GCM using a key
// derived from the user's PIN (PBKDF2, 150k iterations). The stored blob is
// useless without the PIN — the PIN gate is a real lock, not just a curtain.

const STORAGE_KEY = 'mw_creds'

function b64(bytes) {
  return btoa(String.fromCharCode(...bytes))
}

function unb64(str) {
  return Uint8Array.from(atob(str), c => c.charCodeAt(0))
}

async function deriveKey(pin, salt) {
  const baseKey = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 150_000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function saveCredentials(creds, pin) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(pin, salt)
  const plaintext = new TextEncoder().encode(JSON.stringify(creds))
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext)
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    salt: b64(salt),
    iv: b64(iv),
    data: b64(new Uint8Array(ciphertext)),
  }))
}

// Returns the stored credentials, or null if nothing stored / wrong PIN.
export async function loadCredentials(pin) {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const { salt, iv, data } = JSON.parse(raw)
    const key = await deriveKey(pin, unb64(salt))
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: unb64(iv) }, key, unb64(data),
    )
    return JSON.parse(new TextDecoder().decode(plaintext))
  } catch {
    return null
  }
}

export function clearCredentials() {
  localStorage.removeItem(STORAGE_KEY)
}

export function hasStoredCredentials() {
  return localStorage.getItem(STORAGE_KEY) != null
}
