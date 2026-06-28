// Web Push VAPID public key. Trygt å committe — det er public key paret med
// den private nøkkelen som ligger i Netlify env (VAPID_PRIVATE_KEY).
// Re-generer kun hvis lekket: `node -e "console.log(require('web-push').generateVAPIDKeys())"`
export const VAPID_PUBLIC_KEY = 'BEKLDL72f6NxSLCU1C86TjRCz9PuLnfboWf7l_UN-Rb_XMHtSy51ul0Mc2Rybzmu72CueXYsckcBwZfacMsrxWQ'
