# Project Brief: WTP Survey Offline-First Implementation

## Project Overview

This is a survey web app for an **economics research study in Colombia** focused on teaching students healthier phone usage habits. The app measures students' **willingness-to-pay** to accept restrictions on certain apps (like TikTok or WhatsApp) through a Becker-DeGroot-Marshak elicitation mechanism. Students make choices between receiving tokens (exchangeable for rewards) or blocking specific apps for a period of time.

The app is built with **React 19 + TypeScript + Vite** and currently deploys to GitHub Pages. It's a simple questionnaire that guides participants through:
- Participant ID entry
- Instructions and comprehension checks
- A series of choice questions (app/token combinations)
- Random selection of one choice for implementation
- Final results showing their token balance

## The Challenge

We're deploying this survey on **~50 Android phones in Colombian schools** where internet connectivity is limited or intermittent. Currently, the app only works online and data is stored in the browser's localStorage, which means:

1. **No offline functionality** - Students can't complete surveys without internet connection
2. **No data collection** - We have no way to retrieve survey responses
3. **Risk of data loss** - Browser data can be easily cleared

## What We Need

We need to implement:

1. **Offline-first capability** - Students must be able to complete surveys without internet connection
2. **Server-side storage** - All survey responses need to be stored centrally where researchers can access them
3. **Automatic sync** - When phones connect to WiFi, data should automatically upload to the server
4. **Manual backup** - Export functionality as a failsafe

## Suggested Implementation

The [server_plan.md](server_plan.md) document outlines a **Firebase-based solution** that would:
- Add **IndexedDB + localStorage** for dual redundant offline storage
- Implement **Firebase Firestore** for cloud storage with automatic sync
- Create a **PWA with service workers** for true offline functionality
- Add **sync status UI** and manual export buttons

This is just one possible approach—we're open to alternative solutions if you have experience with other technologies that might be better suited for this use case.

## Technical Details

For complete implementation details, code examples, and architecture diagrams, see:
- [server_plan.md](server_plan.md) - Full technical implementation plan
- [CLAUDE.md](CLAUDE.md) - Project structure and development guidelines
- [wtp-survey-app/](wtp-survey-app/) - Current application codebase
