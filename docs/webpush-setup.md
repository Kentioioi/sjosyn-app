# Web Push bakgrunnsvarsling — Netlify-oppsett

For å aktivere bakgrunnsvarsling på Sjøsyn-deployen, må disse environment-variablene være satt i Netlify-prosjektet (Site settings → Environment variables):

| Variable | Verdi | Hvor fra |
|---|---|---|
| `VAPID_PUBLIC_KEY` | `BEKLDL72f6NxSLCU1C86TjRCz9PuLnfboWf7l_UN-Rb_XMHtSy51ul0Mc2Rybzmu72CueXYsckcBwZfacMsrxWQ` | Generert lokalt (samme som i `src/utils/pushConfig.js`) |
| `VAPID_PRIVATE_KEY` | `1-FQFmHe-eYUKiLkmy1aCzAkFnUKkFzpoMKfOeTFScQ` | Generert lokalt — **hold hemmelig** |
| `VAPID_SUBJECT` | `mailto:kenneth222.kn@gmail.com` | Kontakt-e-post (kreves av push-tjenester) |
| `BW_BG_CLIENT_ID` | `<din-nye-Sjøsyn-AIS-klient-id>` | Registreres på barentswatch.no/minside (egen klient for backend) |
| `BW_BG_CLIENT_SECRET` | `<din-nye-Sjøsyn-AIS-klient-secret>` | Samme registrering |
| `CRON_SECRET` | `c091ddead74791980f68228cf52903501c4eca5fba5c8abeba50a22890cbb625` | Generert lokalt — ekstern cron må sende dette i Authorization-header |

## Ekstern cron-oppsett

Netlify Scheduled Functions er ikke pålitelig på 1-minutt cadence. Vi bruker
ekstern cron som ringer `/bg-poll-trigger` hvert minutt.

### Alternativ A: cron-job.org (gratis)
1. cron-job.org → Create cronjob
2. URL: `https://din-domene.netlify.app/bg-poll-trigger`
3. Method: POST
4. Headers: `Authorization: Bearer c091ddead74791980f68228cf52903501c4eca5fba5c8abeba50a22890cbb625`
5. Schedule: hvert minutt (`* * * * *`)
6. Enable

### Alternativ B: GitHub Actions
```yaml
# .github/workflows/cron.yml
name: tripwire-cron
on:
  schedule: [{ cron: '* * * * *' }]
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -X POST https://din-domene.netlify.app/bg-poll-trigger \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```
(GitHub Actions cron har 5-min minimum og kan drifte 10-30 min — bruk cron-job.org for 1-min cadence.)

## UptimeRobot heartbeat-alert
1. uptimerobot.com → New Monitor → HTTP(s)
2. URL: `https://din-domene.netlify.app/heartbeat-status`
3. Interval: 5 min
4. Alert hvis status != 200 → varsler deg på e-post hvis bg-poll stopper

## Registrere Sjøsyn-backend BW-klient

1. Logg inn på https://www.barentswatch.no/minside
2. API-tilgang (for utviklere) → Ny klient
3. **Type: AIS-klient** (scope=ais)
4. Navn: `sjosyn-bg-push` (eller noe gjenkjennelig)
5. Velg passord (= client_secret)
6. Lagre. Kopier client_id og secret inn i Netlify env vars over.

Dette er en separat klient fra brukerens egen — brukerne deler aldri sine credentials med backenden.

## Verifikasjon etter deploy

1. Netlify → Functions-fanen → `bg-poll-tripwires` skal vise siste kjøring (hvert minutt)
2. Etter første gang en bruker aktiverer bakgrunnsvarsling: Netlify Blobs → `tripwire-subs` skal ha minst én entry
3. Test: arm tripwire med fartøy som beveger seg → bakgrunns-poll oppdager kryssing → push leveres
