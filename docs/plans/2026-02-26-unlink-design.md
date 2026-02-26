# UNLINK — Design Document
*"Your diary. Your data. Your fresh start."*

**Date:** 2026-02-26
**Status:** Approved

---

## Concept

A beautifully designed, interactive web app guiding people through digitally untangling from an abusive or controlling relationship. Styled as an early-2000s teenage diary — handwritten fonts, stickers, pastel colors, lock-and-key motifs. Transforms an overwhelming process into something intimate, warm, and empowering.

---

## Tech Stack

- **Framework:** Vite + React
- **Routing:** React Router v6
- **Styling:** Tailwind CSS + custom CSS for diary aesthetic
- **Animations:** Framer Motion (page flip, sticker pops, confetti)
- **Fonts:** Google Fonts — Caveat (handwriting), Nunito (body)
- **State:** React Context + localStorage persistence
- **Deploy:** Vercel

---

## Architecture: Multi-page with 3D Page Flip

Routes live inside a `<DiaryBook>` shell. Navigation forward/back triggers Framer Motion `AnimatePresence` with a CSS `perspective` + `rotateY` page-curl effect.

| Route | Component | Purpose |
|---|---|---|
| `/` | `DiaryCover` | Animated cover, lock latch click-to-open |
| `/chapter/1` | `ChapterOnboarding` | Quiz assessment → personalized checklist |
| `/chapter/2` | `ChapterDevices` | Password/device security walkthrough |
| `/chapter/3` | `ChapterSocial` | Social media + location sharing cards |
| `/chapter/4` | `ChapterFinances` | Shared accounts + finance separation |
| `/chapter/5` | `ChapterResources` | Emergency contacts, hotlines, evidence tips |
| `/fresh-start` | `FreshStartDashboard` | Progress, achievements, "Dear Future Me" letter |

---

## Data Model

```ts
// Persisted to localStorage under key "unlink_diary"
{
  assessment: {
    sharedPhonePlan: boolean,
    jointBankAccount: boolean,
    sharedStreaming: boolean,
    locationSharingOn: boolean,
    sharedCloud: boolean,
    sharedSocialLogins: boolean,
  },
  checklist: {
    [chapterId: string]: {
      [itemId: string]: boolean
    }
  },
  achievements: string[],     // earned sticker IDs
  dearFutureMe: string,       // letter content
  currentChapter: number,
}
```

Assessment answers drive which checklist items appear (personalization).

---

## Visual System

- **Diary book shell:** Two-panel at desktop (left/right pages), single panel mobile. Cream `#FFF8F0` paper. Spiral binding CSS. Chapter divider tabs on right edge.
- **Page flip:** CSS `transform-style: preserve-3d` + `rotateY` 0→-180°, spring physics via Framer Motion (~400ms).
- **Stickers:** Inline SVGs (lock, heart, star, butterfly, key, checkmark). Framer Motion `whileHover` scale+rotate bounce.
- **Typography:** Caveat for headers/diary entries; Nunito for body; lined paper via CSS `repeating-linear-gradient`.

### Color Palette

| Role | Color |
|---|---|
| Primary | Soft pink `#FFB5C2` |
| Secondary | Lavender `#C3B1E1` |
| Tertiary | Baby blue `#A7C7E7` + Mint `#B5EAD7` |
| Accent | Gold `#FFD700` |
| Background | Cream `#FFF8F0` |
| Text | Soft charcoal `#4A4A4A` |

---

## Shared Components

- `DiaryBook` — outer shell, book dimensions, binding
- `PageFlip` — AnimatePresence wrapper with 3D flip logic
- `ChecklistItem` — gel-pen strikethrough SVG draw animation + sticker pop
- `PlatformCard` — Polaroid-style card for each social/service platform
- `StickerBurst` — Confetti + floating sticker celebration
- `ProgressSpine` — Spine of book showing completed chapters
- `DiaryEntry` — Lined paper block with Caveat font "Dear Diary" content

---

## Delight Moments

| Trigger | Animation |
|---|---|
| Tap diary cover | Lock latch SVG clicks open, diary flies open |
| Navigate chapters | 3D page curl, spring physics |
| Check an item | Gel pen SVG path draws strikethrough, sticker pops in margin |
| Complete a chapter | Confetti burst + "you did it!" sticker bounce |
| Fresh Start page | Full-screen celebration, all earned stickers displayed |

---

## Chapter Content

### Chapter 1: "Dear Diary, I'm Starting Over"
6 yes/no quiz cards (diary-entry framing). Generates personalized checklist.
Questions: shared phone plan, joint bank, shared streaming, location on, shared cloud, shared social logins.

### Chapter 2: "Locking My Diary"
Checklist: phone PIN, laptop/tablet, email accounts, iCloud/Google safety check, 2FA, stalkerware check.
Visual: lock strength meter (flimsy → padlock → vault).

### Chapter 3: "Unfriending & Unfollowing"
Platform cards: Instagram, TikTok, Snapchat, Facebook, Twitter/X, Find My, Google Maps.
For each: turn off location, revoke app access, block/unfollow, privacy settings.

### Chapter 4: "Splitting the Bill"
Accounts: bank, credit cards, phone plan (FCC Safe Connections Act callout), streaming, Amazon, Venmo/PayPal.
Visual: receipt/ledger aesthetic, "paid in full" stamp on completion.

### Chapter 5: "My New Address Book"
Resources: National DV Hotline (1-800-799-7233), local shelter finder link, legal aid link.
Safety Circle: trusted contacts note-taking. Evidence tips: screenshots, documentation.

### Bonus: "My Fresh Start"
Progress tracker, achievement stickers earned, "Dear Future Me" textarea with save.

---

## Scope: Explicitly NOT Building

- No backend or user accounts
- No data collection of any kind (pitch point: "Your diary stays yours")
- No dark mode
- No i18n
- No PWA/offline
- No real stalkerware detection (link to guides)
