# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a willingness-to-pay (WTP) survey web application for research on students' preferences for blocking/limiting certain apps on their phones. The app implements a Becker-DeGroot-Marshak-style elicitation mechanism where participants make choices between paying tokens (reducing their reward) to avoid blocking specific apps, or choosing to block the apps for one week.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + PostCSS
- **State Management**: React Context API (SurveyContext)
- **Backend**: Firebase Firestore (cloud database)
- **Authentication**: Firebase Anonymous Auth
- **Local Storage**: localStorage + IndexedDB (dual redundancy)
- **Offline Support**: PWA with Service Worker
- **Testing**: Custom console error testing with Selenium WebDriver
- **Deployment**: GitHub Pages (hosting), Firebase (database)

## Development Commands

All commands are run from the [wtp-survey-app](wtp-survey-app/) directory:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview

# Run console error tests
npm run test:console

# Deploy to GitHub Pages
npm run deploy

# Deploy Firebase security rules
firebase deploy --only firestore:rules

# View Firebase logs
firebase functions:log
```

## Deployment Workflow

**IMPORTANT**: After pushing commits to the main branch, always deploy to GitHub Pages:

```bash
git push                    # Push to GitHub
cd wtp-survey-app          # Navigate to app directory
npm run deploy             # Deploy to GitHub Pages
```

This ensures the live site stays in sync with the repository.

### GitHub Pages Asset Path Issue

**CRITICAL**: GitHub Pages deploys to `https://username.github.io/repo-name/`, which requires the correct `base` path in [vite.config.ts](wtp-survey-app/vite.config.ts).

**Symptom**: If the deployed site shows 404 errors for assets (CSS, JS, images), the `base` path is incorrect.

**Solution**: The `base` in [vite.config.ts](wtp-survey-app/vite.config.ts) must match the repository name:

```typescript
export default defineConfig({
  base: '/wtp-survey/',  // Must match repo name for GitHub Pages
  plugins: [react()],
})
```

**Important Notes**:
- For GitHub Pages: `base: '/wtp-survey/'` (repository name with slashes)
- For custom domain deployments (like Netlify): `base: '/'`
- After changing the base path, always rebuild and redeploy: `npm run deploy`
- The `homepage` field in [package.json](wtp-survey-app/package.json) should match: `https://dmbwebb.github.io/wtp-survey`

## Architecture

### Offline-First Architecture (v0.4+)

The app implements a robust offline-first architecture designed for field deployment on ~50 Android phones in environments with limited or intermittent internet connectivity. The system ensures zero data loss through multiple redundancy layers.

#### Data Flow

```
Student completes survey (offline OK)
         ↓
[Survey Data Generated]
         ↓
    ┌────┴────┐
    ↓         ↓
localStorage  IndexedDB (dual redundancy on device)
         ↓
   [Sync Queue]
         ↓
   Internet available?
         ↓
    ┌────┴────┐
    Yes       No
     ↓         ↓
  Firebase   Wait & Retry
     ↓
[Cloud Database]
     ↓
Export to CSV/JSON
```

#### Storage Layers (Zero Data Loss Strategy)

**Layer 1: Dual Local Storage**
- **Primary**: localStorage (existing implementation, fast access)
- **Backup**: IndexedDB (redundant copy, larger capacity)
- Both updated simultaneously on every data change
- Device survives even if one storage layer fails

**Layer 2: Cloud Database**
- Firebase Firestore for production data
- Automatic sync when internet becomes available
- Persistent queue for failed sync attempts
- Each survey assigned unique UUID on device

**Layer 3: Manual Export**
- JSON file download capability via "Export Data" button
- Contains all surveys (synced + unsynced)
- User-initiated failsafe backup mechanism
- Works completely offline

#### File Structure (Offline Features)

```
wtp-survey-app/
├── src/
│   ├── config/
│   │   └── firebase.ts              # Firebase initialization
│   ├── utils/
│   │   ├── indexedDB.ts             # IndexedDB operations
│   │   └── firebase.ts              # Firebase sync utilities
│   ├── components/
│   │   ├── SyncStatus.tsx           # Sync status indicator (top-right)
│   │   ├── ExportButton.tsx         # Manual export button (bottom-right)
│   │   └── ManualSyncButton.tsx     # Manual sync trigger (bottom-left)
│   └── contexts/
│       └── SurveyContext.tsx        # Enhanced with sync logic
├── public/
│   ├── service-worker.js            # PWA offline support
│   └── manifest.json                # PWA configuration
├── firestore.rules                  # Firebase security rules
└── firebase.json                    # Firebase config
```

### Survey Flow

The app follows a strict linear flow through screens, managed by the `SurveyFlow` component in [App.tsx](wtp-survey-app/src/App.tsx):

1. **ParticipantIdScreen** - Collect participant ID
2. **InstructionsScreen** - Explain token system and survey mechanics
3. **ComprehensionCheckScreen** - Verify understanding (token value, reward type)
4. **TokenAllocationScreen** - Initialize participant with starting tokens
5. **ChoiceInstructionsScreen** - Explain choice questions
6. **ChoiceQuestionScreen** (repeated) - Present all app/token combinations
7. **RandomSelectionScreen** - Randomly select one choice for implementation
8. **ResultsScreen** - Display selected choice and final token balance
9. **ThankYouScreen** - Survey completion

### State Management

All survey state is managed through [SurveyContext.tsx](wtp-survey-app/src/contexts/SurveyContext.tsx), which provides:

**Core Survey State:**
- **Persistence**: Automatically saves/restores survey data to localStorage + IndexedDB
- **App randomization**: Randomizes app presentation order on initialization
- **Choice tracking**: Records all participant choices with timestamps
- **Token management**: Tracks token balance throughout survey
- **Random selection**: Selects one choice for implementation

**Offline Sync State (v0.4+):**
- **currentSurveyId**: Unique UUID for each survey session
- **syncStatus**: Tracks pending, synced, and failed survey counts
- **deviceId**: Auto-generated unique identifier for each device
- **exportAllData()**: Downloads all surveys as JSON backup
- **triggerManualSync()**: Manually triggers sync to Firebase
- **Auto-sync triggers**: On survey completion, app load, and when going online

**Key Context Methods:**
```typescript
interface SurveyContextType {
  // Existing methods
  surveyData: SurveyData;
  setParticipantId: (id: string) => void;
  addChoice: (choice: Choice) => void;
  completeSurvey: () => void;  // Now async, triggers sync
  resetSurvey: () => void;

  // New offline/sync methods (v0.4+)
  currentSurveyId: string;
  syncStatus: SyncStatus;
  exportAllData: () => Promise<void>;
  triggerManualSync: () => Promise<void>;
}
```

### Type Definitions

[survey.ts](wtp-survey-app/src/types/survey.ts) defines the core data structures:

**Survey Constants:**
- `TOKEN_AMOUNTS = [0, -2, -3, -5, -8, -10]` - All token values presented to participants (all payment amounts, no positive "receive" values)
- `APPS = ['TikTok', 'WhatsApp']` - Apps participants can choose to block
- `TOKEN_VALUE_COP = 1000` - Each token worth 1000 COP
- `INITIAL_TOKENS = 10` - Starting token allocation

**Core Types:**
- `SurveyData` - Main survey data structure
- `Choice` - Individual app/token choice with timestamp
- `SwitchingPoint` - Tracks switching point detection and confirmation

**Offline/Sync Types (v0.4+):**
```typescript
interface SyncStatus {
  pending: number;        // Surveys waiting to sync
  synced: number;         // Successfully synced surveys
  failed: number;         // Failed sync attempts
  lastSyncAttempt: string | null;
  lastSuccessfulSync: string | null;
}

interface StoredSurvey {
  id: string;            // UUID
  surveyData: SurveyData;
  synced: boolean;
  syncedAt: string | null;
  createdAt: string;
  deviceId: string;
}
```

### Choice Generation

The survey generates all choice questions as a cartesian product:
- For each app in randomized `appOrder`
- Present each token amount from `TOKEN_AMOUNTS`
- Results in 12 total choice questions (2 apps × 6 token amounts)

All token amounts are payment values (0, 2, 3, 5, 8, 10 tokens to pay), with no positive "receive" amounts. The question framing is: "Would you rather pay X tokens to avoid limiting the app, or limit the app?"

## Key Implementation Details

### Screen Navigation

Navigation is handled by `goToNextScreen()` in [App.tsx](wtp-survey-app/src/App.tsx:35-69). Screens are rendered conditionally based on `currentScreen` state. When at the `choices` screen, it increments through all generated choice combinations before proceeding.

### Data Persistence

**v0.4+ Dual Storage System:**

The SurveyContext automatically persists all survey data using a dual-storage approach:

1. **localStorage** (Primary, Fast)
   - Stores current survey session
   - Keys: `surveyData`, `currentSurveyId`, `deviceId`
   - Allows participants to resume if they refresh the page

2. **IndexedDB** (Backup, Larger Capacity)
   - Stores all completed surveys
   - Database: `WTPSurveyDB`
   - Object Store: `surveys`
   - Indexed by: `participantId`, `synced`, `createdAt`
   - Can store 5,000+ surveys per device

**Storage Flow:**
- Every state change → saves to localStorage
- Every state change → saves to IndexedDB (via `safeIndexedDBOperation`)
- On survey completion → marks in IndexedDB as ready for sync
- On successful Firebase sync → updates `synced: true` in IndexedDB

**Data Recovery:**
If localStorage fails or is cleared, data can be recovered from IndexedDB using the utilities in [src/utils/indexedDB.ts](wtp-survey-app/src/utils/indexedDB.ts).

### Reusable Components

**Core Components:**
- **TokenCounter** - Displays current token balance (appears on most screens)
- **Button** - Standardized button component with consistent styling
- **VersionInfo** - Displays app version and refresh button (bottom-left corner)
- **LanguageToggle** - Switches between English and Spanish

**Offline/Sync UI Components (v0.4+):**
- **SyncStatus** ([SyncStatus.tsx](wtp-survey-app/src/components/SyncStatus.tsx))
  - Location: Top-right corner, fixed position
  - Displays: Online/offline status (green/red dot)
  - Shows: Synced count, pending count, failed count (if any)
  - Updates: Real-time as sync status changes

- **ExportButton** ([ExportButton.tsx](wtp-survey-app/src/components/ExportButton.tsx))
  - Location: Bottom-right corner, fixed position
  - Action: Downloads all surveys as JSON file
  - Works: Completely offline
  - Shows: Total survey count in button label
  - Disabled: When no surveys exist

- **ManualSyncButton** ([ManualSyncButton.tsx](wtp-survey-app/src/components/ManualSyncButton.tsx))
  - Location: Bottom-left corner, fixed position
  - Visibility: Only appears when pending surveys exist
  - Action: Manually triggers sync to Firebase
  - Shows: Pending count in button label
  - Disabled: When offline
  - Warning: Shows "Connect to internet to sync" when offline

### Version Management

The app displays its current version in the bottom right corner of all screens, along with a refresh button to clear cache and localStorage.

**IMPORTANT**: When making changes to the application:
1. Update the version number in [src/version.ts](wtp-survey-app/src/version.ts)
2. Use semantic versioning (e.g., v0.1 → v0.2 for minor changes, v1.0 for major releases)
3. Include the version number update in your commit message
4. This helps users on mobile devices force-refresh to get the latest version when GitHub Pages caching causes issues

## Working with this Codebase

When adding new screens:
1. Create screen component in [src/screens/](wtp-survey-app/src/screens/)
2. Add screen type to `Screen` union in [App.tsx](wtp-survey-app/src/App.tsx:14-23)
3. Add conditional render in `SurveyFlow` component
4. Update `goToNextScreen()` logic to include new screen in flow

When modifying survey data structure:
1. Update types in [survey.ts](wtp-survey-app/src/types/survey.ts)
2. Update `createInitialSurveyData()` in [SurveyContext.tsx](wtp-survey-app/src/contexts/SurveyContext.tsx:26-38)
3. Consider localStorage compatibility (may need migration logic)

When adding new context methods:
1. Add to `SurveyContextType` interface
2. Implement in `SurveyProvider` component
3. Include in context provider value object

## Firebase Integration (v0.4+)

### Configuration

Firebase configuration is stored in [src/config/firebase.ts](wtp-survey-app/src/config/firebase.ts):

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Firebase config with API keys
const firebaseConfig = { ... };

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Auto sign-in anonymously
signInAnonymously(auth);
```

**Important:** Firebase API keys are safe to commit to the repository. Security is enforced through Firestore security rules, not by hiding the API key.

### Firestore Data Model

**Collection:** `surveys`

**Document Structure:**
```typescript
{
  surveyId: string;           // UUID
  deviceId: string;           // Unique device identifier
  participantId: string;
  startedAt: Timestamp;
  completedAt: Timestamp;
  appOrder: string[];         // e.g., ['TikTok', 'WhatsApp']
  tokenOrder: string;         // 'ascending' | 'descending'
  tokenBalance: number;
  comprehensionAnswers: {
    tokenValue: string;
    rewardType: string;
  };
  choices: Array<{
    id: string;
    app: string;
    tokenAmount: number;
    selectedOption: string;   // 'tokens' | 'limit'
    timestamp: Timestamp;
    autoFilled?: boolean;
  }>;
  switchingPoints: {...};
  selectedChoice: object;
  syncedAt: Timestamp;        // Server timestamp
  version: string;            // App version (e.g., 'v0.4')
}
```

### Security Rules

Firestore security rules ([firestore.rules](wtp-survey-app/firestore.rules)):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /surveys/{surveyId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
      allow update: if request.auth != null &&
                       resource.data.deviceId == request.resource.data.deviceId;
      allow delete: if false; // Prevent accidental deletion
    }
  }
}
```

**Deploy rules:**
```bash
firebase deploy --only firestore:rules
```

### Sync Utilities

[src/utils/firebase.ts](wtp-survey-app/src/utils/firebase.ts) provides:

- `getDeviceId()` - Gets or creates unique device identifier
- `syncSurveyToFirebase(survey)` - Uploads a single survey to Firestore
- `isFirebaseReachable()` - Checks Firebase connectivity

### Sync Behavior

**Automatic Sync Triggers:**
1. On survey completion (if online)
2. On app load (if online)
3. When device goes from offline → online (event listener)

**Sync Process:**
1. Get all unsynced surveys from IndexedDB
2. For each survey: attempt upload to Firebase
3. On success: mark as synced in IndexedDB
4. On failure: keep as pending, retry later
5. Update sync status counts in UI

**Manual Sync:**
User can trigger sync manually via "Sync Now" button, which calls `triggerManualSync()`.

## PWA Configuration (v0.4+)

### Service Worker

[public/service-worker.js](wtp-survey-app/public/service-worker.js):

- Caches app assets for offline use
- Implements cache-first strategy for app shell
- Updates cache on service worker activation
- Registered in [src/main.tsx](wtp-survey-app/src/main.tsx)

**Cache Strategy:**
- App shell (HTML, CSS, JS) → cached on install
- Runtime requests → network first, fallback to cache
- Cache version: `wtp-survey-v1` (update when deploying major changes)

### PWA Manifest

[public/manifest.json](wtp-survey-app/public/manifest.json):

```json
{
  "name": "WTP Survey App",
  "short_name": "WTP Survey",
  "start_url": "/wtp-survey/",
  "display": "standalone",
  "theme_color": "#3b82f6",
  "icons": [
    { "src": "/wtp-survey/icon-192.png", "sizes": "192x192" },
    { "src": "/wtp-survey/icon-512.png", "sizes": "512x512" }
  ]
}
```

### Installing as PWA

**On Android:**
1. Open app URL in Chrome
2. Browser shows "Add to Home Screen" prompt
3. App installs as standalone PWA
4. Appears in app drawer like native app
5. Works offline after first load

**Testing PWA Locally:**
1. Build production version: `npm run build`
2. Serve built files: `npx serve dist`
3. Open in Chrome DevTools → Lighthouse → Run PWA audit

## Data Access & Monitoring

### Accessing Survey Data

**From Firebase Console:**
1. Visit: https://console.firebase.google.com/project/wtp-survey-production
2. Navigate: Firestore Database → surveys collection
3. View: Individual survey documents
4. Export: Click menu → Export to JSON/CSV

**From Manual Exports:**
- Click "Export Data" button in app
- Downloads: `wtp-survey-export-{deviceId}-{timestamp}.json`
- Contains: All surveys from that device (synced + unsynced)

**From IndexedDB (Browser DevTools):**
- Chrome DevTools → Application → IndexedDB → WTPSurveyDB
- Useful for debugging local storage issues

### Monitoring Sync Health

**Daily Checks:**
1. Firebase Console → Check survey count matches expected
2. Review devices that haven't synced recently
3. Check for any failed sync patterns

**Per Device:**
- Sync status indicator shows real-time counts
- Manual export provides backup even if sync fails
- Device ID allows tracking which device collected which surveys

## Field Deployment Guide

### Pre-Deployment Checklist

- [ ] Firebase project configured and security rules deployed
- [ ] App built and deployed to GitHub Pages
- [ ] PWA icons created (192x192 and 512x512)
- [ ] Tested offline functionality on test device
- [ ] Verified sync to Firebase works

### Per-Device Setup

1. **Load App:**
   - Navigate to: https://dmbwebb.github.io/wtp-survey/
   - Wait for full page load

2. **Install PWA:**
   - Chrome shows "Add to Home Screen" prompt
   - Accept to install as standalone app
   - App appears in device app drawer

3. **Test Installation:**
   - Complete one test survey
   - Verify it syncs (check Firebase Console)
   - Enable airplane mode → complete another survey
   - Verify it saves locally (check sync status)
   - Disable airplane mode → verify auto-sync works

4. **Ready for Field:**
   - Each device has unique auto-generated device ID
   - Can collect surveys completely offline
   - Auto-syncs when WiFi available

### Daily Field Workflow

**Morning:**
- Ensure all phones charged
- Open app to verify it loads
- Check sync status from previous day

**During Surveys:**
- Students complete surveys (works offline)
- Survey staff can see pending count increase
- No need to manually sync between surveys

**Evening:**
- Connect all phones to WiFi
- Verify auto-sync completes (watch sync status)
- **IMPORTANT:** Click "Export Data" on each phone as backup
- Upload exported JSON files to secure storage (Google Drive, etc.)
- Check Firebase Console to verify expected survey count

### Troubleshooting

**Issue: Sync Failed**
- Check internet connection
- Try manual sync button
- If still failing, use "Export Data" as backup

**Issue: App won't load offline**
- App must be loaded once while online to cache
- After first load, works fully offline

**Issue: Storage full**
- Each survey ~5-10 KB
- Device can store 5,000+ surveys
- Clear old synced surveys if needed (future feature)

**Issue: Lost data concerns**
- Data exists in 3+ places: localStorage, IndexedDB, Firebase
- Manual exports provide additional backup
- Check IndexedDB in DevTools to verify local storage
