# Unlink — The Digital Breakup Kit

**Live demo:** https://unlink-opal.vercel.app

A privacy-first safety toolkit for survivors of controlling relationships, styled as an early-2000s teenage diary. Built for the **"Safety in the Digital Age"** hackathon.

---

## What It Is

Leaving a controlling relationship is terrifying. The digital aftermath — shared accounts, stalkerware, location tracking, joint finances — can keep survivors tethered and vulnerable long after they've physically left. Unlink guides them through cutting those ties, one diary page at a time.

The app is structured as six diary "chapters." The user works through them like pages of a journal, checking off items as they go. Chapter 1 asks six assessment questions; the answers personalize every checklist that follows (e.g., if you share a phone plan, that step gets highlighted in Chapter 4).

**Zero data leaves your device.** No backend. No accounts. No analytics. Everything — checklist progress, assessment answers, the "Dear Future Me" letter — lives in browser `localStorage`. Closing the tab doesn't erase it. Clearing your browser data does.

---

## Chapters

| # | Title | Covers |
|---|---|---|
| Cover | Open My Diary | Animated entry with lock-unlock sequence |
| 1 | I'm Starting Over | 6-question assessment → personalized checklist |
| 2 | Locking My Diary | Devices, passwords, 2FA, stalkerware check |
| 3 | Unfriending & Unfollowing | Social media, location sharing, platform-specific guides |
| 4 | Splitting the Bill | Finances, phone plans, FCC Safe Connections Act |
| 5 | My New Address Book | DV hotlines, evidence tips, safety circle |
| 6 | My Fresh Start | Progress dashboard, achievements, "Dear Future Me" |

---

## Design Philosophy

The aesthetic is deliberate: **early-2000s teenage diary** — cream lined paper, Caveat handwriting font, pastel chapter colors, sticker pops, a 3D page-flip animation. Every design choice is a rejection of clinical, sterile "safety tool" UI.

Survivors already feel surveilled and overwhelmed. The goal was to make this feel intimate and warm — like writing in a journal you keep under your pillow, not filling out a form at a government office.

**Key principles:**
- Privacy by architecture, not policy — no server to breach because there is no server
- Mobile-first — designed for the phone in your pocket, not a desktop
- Warm, non-clinical aesthetic to reduce anxiety at a high-stress moment
- Personalized via assessment so irrelevant steps don't add noise

**Stats that shaped it:**
- 85% of DV shelters report abusers use technology for stalking or control (NNEDV)
- 1 in 4 women experience intimate partner violence (WHO)
- Deepfake content targeting survivors grew 900% between 2023–2025
- The most dangerous window for a survivor is immediately after leaving — digital safety is critical

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Vite + React 19 |
| Routing | React Router v7 |
| Animations | Framer Motion — page flip, sticker pops, confetti |
| Styling | Tailwind CSS v3 + custom CSS |
| Fonts | Caveat (handwriting) + Nunito (body) via Google Fonts |
| State | React Context + `localStorage` |
| Deploy | Vercel |

No backend. No database. No auth.

---

## Running Locally

```bash
git clone https://github.com/upneja/unlink.git
cd unlink
npm install
npm run dev
```

Opens at http://localhost:5173

---

## Project Structure

```
src/
├── components/
│   ├── ChecklistItem.jsx      # Animated checklist row with sticker pop
│   ├── DiaryBook.jsx          # Outer shell — spine, 3D page flip
│   ├── DiaryEntry.jsx         # Lined paper block with handwriting font
│   ├── NavigationButtons.jsx  # Back/Next page nav
│   ├── PageHeader.jsx         # Animated chapter header
│   ├── PlatformCard.jsx       # Expandable social media step-guide card
│   ├── ProgressSpine.jsx      # Spine navigation dots
│   ├── StickerBurst.jsx       # Confetti celebration animation
│   └── Stickers.jsx           # Inline SVG sticker library
├── context/
│   └── DiaryContext.jsx       # Global state + localStorage persistence
├── pages/
│   ├── DiaryCover.jsx         # Animated landing page
│   ├── ChapterOnboarding.jsx  # Ch. 1 — Assessment quiz
│   ├── ChapterDevices.jsx     # Ch. 2 — Devices & passwords
│   ├── ChapterSocial.jsx      # Ch. 3 — Social media
│   ├── ChapterFinances.jsx    # Ch. 4 — Finances
│   ├── ChapterResources.jsx   # Ch. 5 — Emergency resources
│   └── FreshStartDashboard.jsx # Progress + Dear Future Me
└── index.css                  # Global styles, paper texture, animations
```

---

## State Model

All state lives in `DiaryContext` and persists to `localStorage` under the key `unlink_diary`. Nothing is ever sent anywhere.

```ts
{
  assessment: {
    sharedPhonePlan: boolean | null,
    jointBankAccount: boolean | null,
    sharedStreaming: boolean | null,
    locationSharingOn: boolean | null,
    sharedCloud: boolean | null,
    sharedSocialLogins: boolean | null,
  },
  checklist: {
    ch2: { [itemId: string]: boolean },
    ch3: { [itemId: string]: boolean },
    ch4: { [itemId: string]: boolean },
  },
  achievements: string[],     // 'ch2_complete' | 'ch3_complete' | 'ch4_complete'
  dearFutureMe: string,
  safetyCircle: string,
  assessmentComplete: boolean,
}
```

Chapter 1 answers personalize subsequent chapters — e.g., phone plan item is visually flagged if `sharedPhonePlan: true`.

---

## Design System

### Color Palette

| Role | Hex | Usage |
|---|---|---|
| Primary Pink | `#FFB5C2` | Chapter 1, cover, accents |
| Lavender | `#C3B1E1` | Chapter 2, checkboxes |
| Baby Blue | `#A7C7E7` | Chapter 3, social |
| Mint | `#B5EAD7` | Chapter 4, finances |
| Warm Amber | `#FFDAA1` | Chapter 5, resources |
| Gold | `#FFD700` | Stars, achievements |
| Cream | `#FFF8F0` | Paper background |
| Charcoal | `#4A4A4A` | Body text |

### Typography

- **Headers / diary entries:** [Caveat](https://fonts.google.com/specimen/Caveat) — handwritten feel
- **Body / labels:** [Nunito](https://fonts.google.com/specimen/Nunito) — rounded, friendly, readable

---

## Emergency Resources (Chapter 5)

| Resource | Contact |
|---|---|
| National DV Hotline | 1-800-799-7233 · Text START to 88788 |
| Crisis Text Line | Text HOME to 741741 |
| RAINN | 1-800-656-4673 |
| Legal Aid | lawhelp.org |

**FCC Safe Connections Act (2022):** Wireless carriers must let DV survivors separate from shared phone plans at no cost.

---

*Built for the Safety in the Digital Age hackathon.*
