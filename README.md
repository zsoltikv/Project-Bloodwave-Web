<div align="center">

# 💥 Bloodwave Portal

[![Tech Stack](https://skillicons.dev/icons?i=html,css,tailwind,javascript,vite,vscode,github,npm)](https://skillicons.dev)

[![Android](https://img.shields.io/badge/Android-3DDC84?logo=android&logoColor=white)](#)
[![iOS](https://img.shields.io/badge/iOS-000000?&logo=apple&logoColor=white)](#)
![Repo Size](https://img.shields.io/github/repo-size/zsoltikv/Bloodwave-Portal?style=flat-square)
![Last Commit](https://img.shields.io/github/last-commit/zsoltikv/Project-Bloodwave-Web?style=flat-square)

This repository contains the web portal and mobile wrapper for Project Bloodwave. It provides user-facing pages (login/register), a centralized leaderboard viewer, achievement browsing, a backend status monitor and an Android APK download UI tied to GitHub Releases. The app is built with Vite and packaged for mobile with Capacitor.

</div>

---

## Overview

Bloodwave Portal is a lightweight, single-page web app that complements the Project: Bloodwave Unity game. Its main goals are:

- Give players a place to view previous matches, statistics, leaderboards and achievements
- Provide a trusted distribution point for Android APKs (GitHub Releases integration)
- Offer a simple backend status page for server monitoring
- Be packageable to Android via Capacitor as an in-app portal

The frontend is minimal, performant and styled to match the game's visual language.

---

## Highlights

- Vite + plain JavaScript for a fast dev experience
- Capacitor integration for Android packaging
- GitHub Releases based APK download flow with availability checks
- Modular page layout and CSS split per-page under `src/styles/pages`
- Built-in localization support via simple text files in `src/locales`

---

## Features

- Authentication UI (login/register) and client-side auth helper (`src/app/services/auth.js`)
- Leaderboard viewer with local persistence for sorting/filtering
- Achievements browser showing unlocked/locked states
- Backend status page that checks configured API endpoints
- AndroidDownload page offering multiple APKs linked from GitHub Releases
- Small visual effects (starfield background, custom cursor, button shimmer)

---

## Architecture & Project Layout

This is a small SPA without a heavy framework: pages are implemented as small modules under `src/app/pages`, styles live in `src/styles/pages`, and small services handle network logic.

- `src/app/pages/*` — page modules that render content into the app container
- `src/app/services/*` — network and auth helpers (`auth.js`, `backend-status.js`)
- `src/app/effects/*` — small visual effects (starfield, cursor)
- `src/styles/pages/*` — per-page CSS files that keep styling local and scannable
- `src/locales/*` — translation / copy files (en / hu)
- `android/`, `ios/` — Capacitor native projects (when synced)

Important files (examples):

- Pages: [src/app/pages/AndroidDownload.js](src/app/pages/AndroidDownload.js), [src/app/pages/BackendStatus.js](src/app/pages/BackendStatus.js), [src/app/pages/Leaderboard.js](src/app/pages/Leaderboard.js)
- Services: [src/app/services/auth.js](src/app/services/auth.js), [src/app/services/backend-status.js](src/app/services/backend-status.js)
- Styles: [src/styles/pages/AndroidDownload.css](src/styles/pages/AndroidDownload.css)

---

## Development — Getting started

Requirements:

- Node.js 16+ (LTS recommended)
- npm (or yarn)
- For Android packaging: Android SDK + Java JDK + Android Studio

Clone and install:

```bash
git clone https://github.com/zsoltikv/Project-Bloodwave-Web.git
cd Project-Bloodwave-Web
npm install
```

Run development server (Vite):

```bash
npm run dev
```

Open `http://localhost:5173` (or the URL Vite prints) to view the app.

Project tips:

- Pages are simple functions that receive a container element and render markup into it — see `src/app/pages/`.
- Styles are intentionally scoped per page, so add CSS in `src/styles/pages/`.
- Copy/strings live in `src/locales` as plain text — a minimal localization layer.

---

## Build & Mobile packaging (Capacitor)

Create a production web build and sync with Capacitor for Android:

```bash
npm run build
npx cap sync android
npx cap open android
```

Open the Android project in Android Studio and build/run on a device or emulator. If you modify the web output, run `npx cap copy android` (or `npx cap sync android`) before building in Android Studio.

Notes:

- The repository already contains an `android/` folder. Make sure your local Android SDK/NDK setup is correct before opening the project.
- Use `npx cap doctor` to validate platform dependencies.

---

## Testing & verification

- Manual QA: visit each page and verify the content and buttons work.
- APK availability: open `AndroidDownload` and confirm the status messages. The page queries GitHub Releases — if you hit rate limits, appearant availability may be affected.

Recommended dev workflow:

```bash
npm run dev               # hot-reload frontend
npm run build             # production bundle
npx cap sync android      # sync web build to Android project
npx cap open android      # open Android Studio
```

---

## Troubleshooting

- `npm run dev` fails: ensure Node version is compatible and reinstall with `npm ci`.
- Vite port conflict: `npm run dev -- --port 3000`.
- GitHub API rate limiting: if release checks fail, generate a small server-side proxy or use a GitHub token (do not commit tokens).
- Capacitor build errors: open Android Studio, inspect Gradle sync messages and install missing SDK components.

<div align="center">

## Made with ❤️ — contributors

</div>
