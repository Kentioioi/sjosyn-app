# Firmware / SDK / driver strings angle (quick scan, 2026-10-08)

| date | finding | URL | confidence |
|---|---|---|---|
| 2026-09-10 | UploadVR (Luna): Phoenix visuals found in Horizon OS prescription-lens firmware package; "sensors visible on the sides and undersides of the temples". Article does NOT mention autofocus, poLight, TLens or camera part names (checked via page query). | https://www.uploadvr.com/meta-project-phoenix-headset-first-clear-visuals/ | confirmed (firmware leak exists; no poLight link) |
| 2026-09 | Roadtovr spec table for Meta VR Glasses lists "Autofocus: Yes" (search snippet only, not scraped). | https://roadtovr.com/meta-vr-glasses-unveiled-price-release-date/ | confirmed (autofocus claimed; actuator type unstated) |
| 2026-01 (reported) | idevice.com snippet: "GalaxyClub reported in January 2026 that the Galaxy Glasses cameras autofocus via poLight TLens." Adjacent, not Meta. | https://idevice.com/smart-glasses/samsung-galaxy-glasses/features/autofocus | rumor |
| n/a | Search for open-source/kernel/CodeLinaro polight/tlens driver returned no relevant driver repos (only unrelated camera drivers; poLight product pages). | - | - |

## Gaps
- No datamine/APK/firmware string tying poLight, TLens or a piezo AF actuator to Phoenix / VR Glasses was found.
- Did not search CodeLinaro/AOSP trees directly or the Reddit/UploadVR firmware threads in depth (budget).
- Not checked: Luna's X posts, Meta's published open-source/GPL tarballs for Quest.
