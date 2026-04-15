# Senlo Landing

Standalone marketing landing page for Senlo, an AI chatbot management platform built around the MAX messenger.

## Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Framer Motion
- Three.js + @react-three/fiber (shader hero background)
- i18next (RU / EN)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

```
src/
  components/
    landing/
      LandingPage.tsx      # composition root
      LandingChat.tsx      # animated chat mock in hero
      sections/            # problem/solution, features, how, integrations, demo, faq, footer
    ui/
      SenloLogo.tsx
      LanguageSwitcher.tsx
      expandable-tabs.tsx
  i18n/                    # ru/en translation resources
  utils/cn.ts              # tailwind-merge helper
  App.tsx
  main.tsx
  index.css
```

## Build

```bash
npm run build
```
