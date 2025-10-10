# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a willingness-to-pay (WTP) survey web application for research on students' preferences for blocking/limiting certain apps on their phones. The app implements a Becker-DeGroot-Marshak-style elicitation mechanism where participants make choices between receiving tokens (exchangeable for rewards) or blocking specific apps for one week.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + PostCSS
- **State Management**: React Context API (SurveyContext)
- **Testing**: Custom console error testing with Selenium WebDriver
- **Deployment**: gh-pages

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

- **Persistence**: Automatically saves/restores survey data to/from localStorage
- **App randomization**: Randomizes app presentation order on initialization
- **Choice tracking**: Records all participant choices with timestamps
- **Token management**: Tracks token balance throughout survey
- **Random selection**: Selects one choice for implementation

### Type Definitions

[survey.ts](wtp-survey-app/src/types/survey.ts) defines the core data structures:

- `TOKEN_AMOUNTS = [10, 5, 3, 2, 0, -2, -5]` - All token values presented to participants
- `APPS = ['TikTok', 'WhatsApp']` - Apps participants can choose to block
- `TOKEN_VALUE_COP = 1000` - Each token worth 1000 COP
- `INITIAL_TOKENS = 10` - Starting token allocation

### Choice Generation

The survey generates all choice questions as a cartesian product:
- For each app in randomized `appOrder`
- Present each token amount from `TOKEN_AMOUNTS`
- Results in 14 total choice questions (2 apps × 7 token amounts)

## Key Implementation Details

### Screen Navigation

Navigation is handled by `goToNextScreen()` in [App.tsx](wtp-survey-app/src/App.tsx:35-69). Screens are rendered conditionally based on `currentScreen` state. When at the `choices` screen, it increments through all generated choice combinations before proceeding.

### Data Persistence

The SurveyContext automatically persists all survey data to localStorage on every state change, allowing participants to resume if they refresh the page.

### Reusable Components

- **TokenCounter** - Displays current token balance (appears on most screens)
- **Button** - Standardized button component with consistent styling
- **VersionInfo** - Displays app version and refresh button (always visible in bottom right corner)

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
