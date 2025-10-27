#!/usr/bin/env Rscript

# Survey Data Processing Script
# Processes WTP survey JSON files into cleaned CSV and markdown report

library(jsonlite)
library(dplyr)
library(tidyr)
library(purrr)

# Define paths (relative to project root)
raw_data_path <- "../data/raw"
cleaned_data_path <- "../data/cleaned"
outputs_path <- "../outputs"

# Create output directories if they don't exist
dir.create(cleaned_data_path, showWarnings = FALSE, recursive = TRUE)
dir.create(outputs_path, showWarnings = FALSE, recursive = TRUE)

# Get all JSON files from data/raw
json_files <- list.files(raw_data_path, pattern = "\\.json$", full.names = TRUE)

cat(sprintf("Found %d JSON files to process\n", length(json_files)))

# Function to process a single survey file
process_survey_file <- function(filepath) {
  survey_data <- fromJSON(filepath, flatten = FALSE)

  # Extract filename without extension to use as session_id
  session_id <- tools::file_path_sans_ext(basename(filepath))

  # Extract choices and add participant info
  choices_df <- survey_data$choices %>%
    mutate(
      session_id = session_id,
      participantId = survey_data$participantId,
      appOrder = paste(survey_data$appOrder, collapse = ", "),
      tokenOrder = survey_data$tokenOrder,
      startedAt = survey_data$startedAt,
      completedAt = survey_data$completedAt,
      finalTokenBalance = survey_data$tokenBalance,
      selectedChoiceId = survey_data$selectedChoice$id,
      comprehension_tokenValue = survey_data$comprehensionAnswers$tokenValue,
      comprehension_rewardType = survey_data$comprehensionAnswers$rewardType
    )

  return(choices_df)
}

# Process all files
all_choices <- map_df(json_files, process_survey_file)

# Add additional calculated columns
all_choices <- all_choices %>%
  mutate(
    # Flag if this choice was randomly selected
    wasSelected = (id == selectedChoiceId),
    # Calculate time to answer (seconds) - will be NA for first choice
    timestamp_posix = as.POSIXct(timestamp, format = "%Y-%m-%dT%H:%M:%OSZ", tz = "UTC")
  ) %>%
  group_by(session_id) %>%
  mutate(
    choiceNumber = row_number(),
    timeToAnswer_sec = as.numeric(difftime(timestamp_posix, lag(timestamp_posix), units = "secs"))
  ) %>%
  ungroup() %>%
  select(-timestamp_posix) %>%
  # Reorder columns to put session_id first
  select(session_id, participantId, everything())

# Save to CSV
output_csv <- file.path(cleaned_data_path,
                        sprintf("survey_choices_%s.csv", format(Sys.Date(), "%Y%m%d")))
write.csv(all_choices, output_csv, row.names = FALSE)

cat(sprintf("Saved CSV to: %s\n", output_csv))

# ============================================================================
# Generate Markdown Report
# ============================================================================

md_file <- file.path(outputs_path,
                     sprintf("survey_report_%s.md", format(Sys.Date(), "%Y%m%d")))

# Start building markdown content
md_lines <- c(
  "# WTP Survey Data Report",
  sprintf("Generated: %s", Sys.time()),
  "",
  "---",
  "",
  "## Summary Statistics",
  "",
  sprintf("- **Total Survey Sessions**: %d", n_distinct(all_choices$session_id)),
  sprintf("- **Unique Participants**: %d", n_distinct(all_choices$participantId)),
  sprintf("- **Total Choices**: %d", nrow(all_choices)),
  sprintf("- **Date Range**: %s to %s",
          min(as.Date(all_choices$startedAt)),
          max(as.Date(all_choices$completedAt))),
  "",
  "### Overall Choice Distribution",
  ""
)

# Overall choice distribution
choice_dist <- all_choices %>%
  count(selectedOption) %>%
  mutate(percentage = round(n / sum(n) * 100, 1))

md_lines <- c(md_lines,
  "| Option | Count | Percentage |",
  "|--------|-------|------------|")
for (i in 1:nrow(choice_dist)) {
  md_lines <- c(md_lines,
    sprintf("| %s | %d | %.1f%% |",
            choice_dist$selectedOption[i],
            choice_dist$n[i],
            choice_dist$percentage[i]))
}

md_lines <- c(md_lines, "", "---", "")

# ============================================================================
# Individual Session Reports
# ============================================================================

sessions <- unique(all_choices$session_id)

for (sid in sessions) {
  session_data <- all_choices %>% filter(session_id == sid)

  md_lines <- c(md_lines,
    sprintf("## Session: %s", sid),
    sprintf("*(Participant ID: %s)*", session_data$participantId[1]),
    "",
    "### Survey Details",
    ""
  )

  # Basic info
  first_row <- session_data[1, ]
  md_lines <- c(md_lines,
    sprintf("- **Session ID**: `%s`", first_row$session_id),
    sprintf("- **Started**: %s", first_row$startedAt),
    sprintf("- **Completed**: %s", first_row$completedAt),
    sprintf("- **App Order**: %s", first_row$appOrder),
    sprintf("- **Token Order**: %s", first_row$tokenOrder),
    sprintf("- **Final Token Balance**: %d", first_row$finalTokenBalance),
    ""
  )

  # Comprehension check answers
  md_lines <- c(md_lines,
    "### Comprehension Check Answers",
    "",
    sprintf("- **Token Value**: %s COP", first_row$comprehension_tokenValue),
    sprintf("- **Reward Type**: %s", first_row$comprehension_rewardType),
    ""
  )

  # Selected choice for implementation
  selected <- session_data %>% filter(wasSelected)
  if (nrow(selected) > 0) {
    md_lines <- c(md_lines,
      "### Randomly Selected Choice (Implemented)",
      "",
      sprintf("- **App**: %s", selected$app),
      sprintf("- **Token Amount**: %d", selected$tokenAmount),
      sprintf("- **Choice Made**: %s", selected$selectedOption),
      ""
    )
  }

  # All choices breakdown
  md_lines <- c(md_lines,
    "### All Choices",
    "",
    "| # | App | Token Amount | Choice | Time to Answer (sec) | Implemented? |",
    "|---|-----|--------------|--------|----------------------|--------------|"
  )

  for (i in 1:nrow(session_data)) {
    row <- session_data[i, ]
    time_str <- ifelse(is.na(row$timeToAnswer_sec), "-", sprintf("%.1f", row$timeToAnswer_sec))
    selected_str <- ifelse(row$wasSelected, "**YES**", "No")

    md_lines <- c(md_lines,
      sprintf("| %d | %s | %d | %s | %s | %s |",
              row$choiceNumber,
              row$app,
              row$tokenAmount,
              row$selectedOption,
              time_str,
              selected_str)
    )
  }

  # Summary by app
  md_lines <- c(md_lines, "", "### Summary by App", "")

  for (app in unique(session_data$app)) {
    app_data <- session_data %>% filter(app == !!app)

    # Count choices
    limit_count <- sum(app_data$selectedOption == "limit")
    tokens_count <- sum(app_data$selectedOption == "tokens")

    md_lines <- c(md_lines,
      sprintf("**%s**:", app),
      sprintf("- Chose to limit: %d times", limit_count),
      sprintf("- Chose tokens: %d times", tokens_count)
    )

    # Find switching point (if any)
    app_data <- app_data %>% arrange(tokenAmount)

    # Look for switches from limit to tokens
    switches <- c()
    for (j in 2:nrow(app_data)) {
      if (app_data$selectedOption[j-1] == "limit" && app_data$selectedOption[j] == "tokens") {
        switches <- c(switches,
          sprintf("  - Switched from 'limit' to 'tokens' between token amounts %d and %d",
                  app_data$tokenAmount[j-1],
                  app_data$tokenAmount[j]))
      }
      if (app_data$selectedOption[j-1] == "tokens" && app_data$selectedOption[j] == "limit") {
        switches <- c(switches,
          sprintf("  - Switched from 'tokens' to 'limit' between token amounts %d and %d",
                  app_data$tokenAmount[j-1],
                  app_data$tokenAmount[j]))
      }
    }

    if (length(switches) > 0) {
      md_lines <- c(md_lines, "- Switching points:", switches)
    }

    md_lines <- c(md_lines, "")
  }

  md_lines <- c(md_lines, "---", "")
}

# Write markdown file
writeLines(md_lines, md_file)

cat(sprintf("Saved markdown report to: %s\n", md_file))
cat("\nProcessing complete!\n")
