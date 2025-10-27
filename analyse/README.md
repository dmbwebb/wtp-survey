# Survey Data Analysis Scripts

## Overview

This directory contains R scripts for processing and analyzing WTP (Willingness-to-Pay) survey data.

## Requirements

Install required R packages:

```r
install.packages(c("jsonlite", "dplyr", "tidyr", "purrr"))
```

## Usage

### Processing Survey Data

To process all JSON files in `data/raw/` and generate cleaned CSV + markdown report:

```bash
cd analyse
Rscript process_survey_data.R
```

Or from the project root:

```bash
Rscript analyse/process_survey_data.R
```

### Output Files

The script generates:

1. **CSV file**: `data/cleaned/survey_choices_YYYYMMDD.csv`
   - Contains all choice-by-choice data for all survey sessions
   - **session_id**: Unique identifier extracted from JSON filename (e.g., `survey-99-1760542380767`)
   - **participantId**: Self-reported participant ID (may have multiple sessions)
   - Includes calculated fields like time to answer, choice number, etc.
   - One row per choice (with session and participant info repeated)

2. **Markdown report**: `outputs/survey_report_YYYYMMDD.md`
   - Summary statistics across all sessions (total sessions, unique participants)
   - Detailed breakdown for each session including:
     - Session ID and associated participant ID
     - Survey metadata (start/completion times, randomization order)
     - Comprehension check answers
     - All choices in table format with timing
     - Summary by app (switching points, choice counts)

### Data Structure

The script expects JSON files in `data/raw/` with this structure:

```json
{
  "participantId": "99",
  "startedAt": "ISO-8601 timestamp",
  "completedAt": "ISO-8601 timestamp",
  "appOrder": ["App1", "App2"],
  "tokenOrder": "ascending|descending",
  "choices": [
    {
      "id": "unique-id",
      "app": "AppName",
      "tokenAmount": 5,
      "selectedOption": "limit|tokens",
      "timestamp": "ISO-8601 timestamp"
    }
  ],
  "selectedChoice": { /* same structure as choice */ },
  "tokenBalance": 10,
  "comprehensionAnswers": {
    "tokenValue": "1000",
    "rewardType": "Store type"
  }
}
```

### Adding New Survey Data

Simply place new JSON files in `data/raw/` and run the script again. It will process all JSON files in that directory.
