# 💔 UNLINK — The Digital Breakup Kit

> *"Your diary. Your data. Your fresh start."*

**Live demo:** https://unlink-opal.vercel.app

A beautifully designed, interactive web app that guides people through the process of digitally untangling from an abusive or controlling relationship. Styled as an early-2000s teenage diary — handwritten fonts, pastel colors, stickers, lock-and-key motifs — it transforms an overwhelming, terrifying process into something that feels intimate, warm, and empowering.

Built for the **"Safety in the Digital Age"** hackathon.

---

## What It Does

UNLINK is structured as diary "chapters." The user works through them like pages of a journal.

| Chapter | Title | What It Covers |
|---|---|---|
| Cover | Open My Diary | Animated entry point with lock unlock sequence |
| Chapter 1 | I'm Starting Over | 6-question assessment → personalized checklist |
| Chapter 2 | Locking My Diary | Devices, passwords, 2FA, stalkerware check |
| Chapter 3 | Unfriending & Unfollowing | Social media, location sharing, platform guides |
| Chapter 4 | Splitting the Bill | Finances, phone plans, FCC Safe Connections Act |
| Chapter 5 | My New Address Book | Hotlines, evidence tips, safety circle |
| Fresh Start | My Fresh Start | Progress dashboard, achievements, "Dear Future Me" |

**Key design principles:**
- Zero data collection — everything stays on the user's device (localStorage)
- No backend, no accounts, no tracking
- Mobile-first (designed for use on a phone)
- Warm, non-clinical aesthetic that reduces anxiety

---

## Tech Stack

```
Framework:     Vite + React 18
Routing:       React Router v6
Animations:    Framer Motion (page flip, sticker pops, confetti)
Styling:       Tailwind CSS v3 + custom CSS
Fonts:         Google Fonts — Caveat (handwriting) + Nunito (body)
State:         React Context + localStorage
Deploy:        Vercel
```

---

## Project Structure

```
src/
├── components/
│   ├── ChecklistItem.jsx     # Animated checklist row with sticker pop
│   ├── DiaryBook.jsx         # Outer shell — spine, page flip animation
│   ├── DiaryEntry.jsx        # Lined paper block with handwriting font
│   ├── NavigationButtons.jsx # Back/Next page nav (shared)
│   ├── PageHeader.jsx        # Animated chapter header
│   ├── PlatformCard.jsx      # Expandable social media step-guide card
│   ├── ProgressSpine.jsx     # Spine navigation dots
│   ├── StickerBurst.jsx      # Confetti celebration animation
│   └── Stickers.jsx          # Inline SVG sticker library
├── context/
│   └── DiaryContext.jsx      # Global state + localStorage persistence
├── pages/
│   ├── DiaryCover.jsx        # Animated landing page
│   ├── ChapterOnboarding.jsx # Chapter 1 — Assessment quiz
│   ├── ChapterDevices.jsx    # Chapter 2 — Devices & passwords
│   ├── ChapterSocial.jsx     # Chapter 3 — Social media
│   ├── ChapterFinances.jsx   # Chapter 4 — Finances
│   ├── ChapterResources.jsx  # Chapter 5 — Emergency resources
│   └── FreshStartDashboard.jsx # Progress + Dear Future Me
└── index.css                 # Global styles, paper texture, animations
```

---

## Running Locally

```bash
git clone <repo-url>
cd unlink
npm install
npm run dev
```

Open http://localhost:5173

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
- **Body text / labels:** [Nunito](https://fonts.google.com/specimen/Nunito) — rounded, friendly, readable

### Key CSS Classes

| Class | Effect |
|---|---|
| `.lined-paper` | Cream background with ruled lines + red margin |
| `.font-handwriting` | Caveat font |
| `.font-body` | Nunito font |
| `.diary-perspective` | 3D perspective container for page flip |

---

## State Model

All state lives in `DiaryContext` and persists to `localStorage` under key `unlink_diary`.

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
  achievements: string[],       // 'ch2_complete' | 'ch3_complete' | 'ch4_complete'
  dearFutureMe: string,
  safetyCircle: string,
  assessmentComplete: boolean,
}
```

Chapter 1 assessment answers personalize later chapters (e.g., phone plan item is highlighted if `sharedPhonePlan: true`).

---

## Deploying

The project deploys to Vercel. `vercel.json` configures SPA rewrites so all routes serve `index.html`.

```bash
vercel --prod
```

---

## Design Handoff (for Figma)

This codebase was designed to be exported to Figma via [html.to.code](https://www.builder.io/blog/html-to-figma). The visual design is implemented entirely in code (no external assets required) so it can be:

1. Exported to Figma for visual refinement
2. Re-imported with updated assets/styles

**Figma designer focus areas:**
- Sticker assets (currently inline SVGs in `src/components/Stickers.jsx`)
- Background textures and paper effects (currently CSS in `src/index.css`)
- Chapter divider tab colors and the diary spine
- Celebration/achievement animations

---

## Emergency Resources (Chapter 5)

| Resource | Contact |
|---|---|
| National DV Hotline | 1-800-799-7233 · Text START to 88788 |
| Crisis Text Line | Text HOME to 741741 |
| RAINN | 1-800-656-4673 |
| Legal Aid | lawhelp.org |

**FCC Safe Connections Act (2022):** Wireless carriers are required by law to let domestic violence survivors separate from shared phone plans at no cost.

---

## Privacy

UNLINK collects **zero data**. There is no backend, no analytics, no tracking. Everything the user enters (checklist progress, assessment answers, their "Dear Future Me" letter, safety circle contacts) stays on their device in browser localStorage. Clearing browser data removes everything.

---

## Stats (for pitch)

- **85%** of DV shelters report abusers use technology for stalking/control (NNEDV)
- **1 in 4 women** experience intimate partner violence (WHO)
- Deepfake content targeting survivors increased **900%** between 2023–2025
- The most dangerous window for a survivor is **immediately after leaving** — digital safety is critical

---

*Built with 💜 for the Safety in the Digital Age hackathon.*
