# Missing Assets — Manual Setup Required

The following assets need to be added to the `public/` directory before deployment.

## Fonts (Required)

Download from the sources below and place in `public/fonts/`:

1. **Plus Jakarta Sans** — https://www.fontshare.com/fonts/plus-jakarta-sans
   - Download `.woff2` format
   - Required weights: 400 (Regular), 500 (Medium), 700 (Bold)
   - Files:
     - `PlusJakartaSans-Regular.woff2`
     - `PlusJakartaSans-Medium.woff2`
     - `PlusJakartaSans-Bold.woff2`

2. **JetBrains Mono** — https://www.jetbrains.com/lp/mono/
   - Download `.woff2` format
   - Required weight: 400 (Regular only)
   - File:
     - `JetBrainsMono-Regular.woff2`

## Images (Required)

Create the following images and place in `public/`:

1. **favicon-32.png** (32×32 px)
   - The SyncSet logo/mark in 32×32 format

2. **apple-touch-icon.png** (180×180 px)
   - iOS bookmark icon, 180×180 format
   - Safe area: center 180×180 (no corner radius applied by Safari)

3. **og-image.png** (1200×630 px)
   - Open Graph image for social sharing
   - Background: #FBFAF7 (paper)
   - Content: SyncSet logo + "Every missed enquiry becomes a booked job."
   - Footer: "syncset.com.au" in 16px, #55585E (graphite)

## Notes

- `favicon.svg` is already created (placeholder SVG)
- `robots.txt` and `llms.txt` are ready
- All other configuration files are complete
- Fonts are critical for LCP performance — they must be `.woff2` format and self-hosted

## Deployment Checklist

- [ ] Add all 4 `.woff2` font files to `public/fonts/`
- [ ] Add `favicon-32.png` (32×32)
- [ ] Add `apple-touch-icon.png` (180×180)
- [ ] Add `og-image.png` (1200×630)
- [ ] Run `npm run build` to verify no asset warnings
- [ ] Test font loading with Lighthouse (check LCP < 2.0s)
