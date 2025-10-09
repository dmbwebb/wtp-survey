# GitHub Pages Deployment Issue

## Problem
GitHub Pages deployments are failing to complete. The automatic "pages build and deployment" workflows get stuck in "queued" or "waiting" status indefinitely and never deploy the site.

## Root Cause
The built-in GitHub Pages deployment system (when set to "Deploy from a branch") creates automatic workflows that can get stuck in the queue. This is a known GitHub issue where the deploy job completes the build step but the actual deployment step never gets a runner assigned.

## Solution Attempted
Created a custom GitHub Actions workflow (`.github/workflows/deploy.yml`) to handle deployments, but it's not being triggered. GitHub may require:
1. Manual enabling of the workflow in the Actions UI
2. Additional repository permissions
3. The workflow to exist on the default branch (main) - this was done

## Current Status
- Custom workflow file exists in both `main` and `gh-pages` branches
- Repository settings changed to "GitHub Actions" as the Pages source
- Workflow permissions set to "Read and write"
- Workflow still not appearing in Actions UI or triggering on pushes

## Next Steps
Check if the "Deploy to GitHub Pages" workflow appears in the left sidebar at https://github.com/dmbwebb/wtp-survey/actions and manually enable it if present.
