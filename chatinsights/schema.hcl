schema "main" {}

table "user_profiles" {
  schema = schema.main

  column "id" {
    type    = int
  }
  column "name" {
    type    = text
    null    = true
  }
  column "email" {
    type    = text
  }
  column "preferred_language" {
    type    = text
    default   = "en"
  }
  column "theme" {
    type    = text
    default   = "system"
  }
  column "timezone" {
    type    = text
    default   = "UTC"
  }

  primary_key {
    columns = [column.id]
  }
}

table "summary_preferences" {
  schema = schema.main # Corrected: Added schema attribute

  column "id" {
    type    = int
  }
  column "user_profile_id" {
    type    = int
    null    = false
  }
  column "summary_frequency" {
    type    = text
    null    = false
    default   = "daily"
  }
  column "daily_summary_time" {
    type    = text
    default   = "09:00"
  }
  column "weekly_summary_day" {
    type    = text
    default   = "Monday"
  }
  column "scheduled_summary_times" {
    type    = text
  }
  column "summarize_chat_types" {
    type    = text
    null    = false
    default   = "all"
  }
  column "keywords_enabled" {
    type    = boolean
    null    = false
    default   = false
  }
  column "keywords_list" {
    type    = text
  }

  primary_key  {
    columns = [column.id]
  }

  foreign_key "fk_user_profile" {
    columns = [column.user_profile_id]
    ref_columns = [table.user_profiles.column.id]
    comment = "The summary preferences for the user profile."
    on_update = NO_ACTION
    on_delete = CASCADE
  }
}
