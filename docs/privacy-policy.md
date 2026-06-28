# Personvernerklæring — Sjøsyn

*Sist oppdatert: 16. juni 2026*

Sjøsyn drives av **[Sjøsyn AS / Kenneth K. — fyll inn]**, organisasjonsnummer **[fyll inn]**, kontakt: **kenneth222.kn@gmail.com**.

Vi tar personvernet ditt på alvor. Denne erklæringen forklarer hvilke opplysninger vi behandler, hvorfor, og hvilke rettigheter du har under GDPR og personopplysningsloven.

## 1. Hvilke opplysninger lagrer vi?

### Lokalt på enheten din (aldri sendt til oss)
- **BarentsWatch-credentials** for AIS-tilkobling (kryptert med PIN, kun på din enhet)
- **Tripwire-linjer** du har tegnet (lat/lon-koordinater)
- **Lagrede fartøy** (flåte — MMSI + navn + type)
- **Hjem-posisjon** (hvis satt)
- **App-innstillinger** (kart-stil, varselmodus osv.)

Disse forsvinner hvis du sletter app-data eller avinstallerer.

### På Sjøsyn-server (kun hvis du aktiverer bakgrunnsvarsling)
- **Push-abonnement** — et opaque endepunkt fra din nettleser (Firefox/Chrome/Safari) som lar oss sende varsler. Inneholder ingen direkte identifiserende info (navn/e-post/IP).
- **Tripwire-konfigurasjon** — for hver linje: MMSI, koordinatpar, valgfritt fartøynavn.
- **Sist-kjente posisjoner** for armerte fartøy (lat/lon, oppdatert hvert minutt). Maks 24 timers historikk.
- **Sist-sendt-varsel-timestamp** per MMSI (cooldown-mekanisme).
- **Anti-misbruk-data** — IP-adresse aggregert per minutt for rate-limiting (slettes etter 2 min).

Vi lagrer **ingen** konto, e-post, navn, eller telefonnummer.

## 2. Hvorfor

| Formål | Lovlig grunnlag (GDPR Art. 6) |
|---|---|
| Levere AIS- og bølge-data til appen | Berettiget interesse (Art. 6.1(f)) — appens kjernefunksjon |
| Sende bakgrunnsvarsler om kryssing | Avtale + samtykke (Art. 6.1(a) + (b)) — eksplisitt aktivert av deg |
| Forhindre misbruk (rate-limit) | Berettiget interesse (Art. 6.1(f)) |

## 3. Hvor lenge

- **Push-abonnement + tripwire-data**: så lenge du har abonnement aktivt + 90 dager uten oppdatering, deretter automatisk slettet
- **Sist-kjente posisjoner**: maks 24 timer
- **Rate-limit-data**: 2 minutter
- **Lokale enhetsdata**: til du sletter dem selv

## 4. Hvem deler vi med?

Tredjeparter som behandler data på våre vegne (subprosessorer):

| Tjeneste | Hva | Lokasjon | Lovlig overføring |
|---|---|---|---|
| **Netlify** (USA) | Hosting + funksjoner + Blobs | USA/EU | Standard kontraktsklausuler (SCC) |
| **Google FCM** | Push-levering til Android/Chrome | USA | EU-US Data Privacy Framework |
| **Apple APNs** | Push-levering til iOS Safari | USA | EU-US Data Privacy Framework |
| **Mozilla Push** | Push-levering til Firefox | USA | EU-US Data Privacy Framework |

Datakilder vi henter fra (ingen brukerdata sendt til dem):
- BarentsWatch (Norge) — AIS-data
- MET Norway (Norge) — bølgevarsel
- Kartverket (Norge) — sjøkart
- Fiskeridirektoratet (Norge) — oppdrettsanlegg

Vi selger aldri data. Vi viser ingen reklame.

## 5. Dine rettigheter

Under GDPR har du rett til:

| Rett | Hvordan i Sjøsyn |
|---|---|
| **Innsyn** (Art. 15) | All lokal data er synlig i appen. Server-data: send e-post |
| **Sletting** (Art. 17) | Innstillinger → Bakgrunnsvarsling → "Slett alle mine data" |
| **Trekke tilbake samtykke** (Art. 7.3) | Skru av bakgrunnsvarsling i innstillinger |
| **Dataportabilitet** (Art. 20) | Send forespørsel til kontakt-e-post |
| **Klage til Datatilsynet** (Art. 77) | datatilsynet.no |

## 6. Cookies + sporing

Sjøsyn bruker **ingen** cookies eller analyseverktøy. Ingen Google Analytics, ingen Facebook-piksel, ingen tredjeparts sporing. localStorage brukes kun for å lagre dine app-innstillinger lokalt.

## 7. Sikkerhet

- AIS-credentials krypteres med din PIN på enheten, sendes aldri til oss
- Push-abonnement er identifisert med en hemmelig token (unsubToken) som forhindrer at andre kan slette eller endre ditt abonnement
- All trafikk over HTTPS
- Web Push-payload er kryptert end-to-end med VAPID

## 8. Endringer

Vi varsler om vesentlige endringer i appen før de trer i kraft. Mindre endringer publiseres her med oppdatert dato over.

## Kontakt

Spørsmål eller forespørsler: **kenneth222.kn@gmail.com**

Klage: **Datatilsynet** — postkasse@datatilsynet.no — datatilsynet.no
