-- Disable the enforcement of foreign-keys constraints
PRAGMA foreign_keys = off;
-- Create "new_user_profiles" table
CREATE TABLE `new_user_profiles` (`id` int NOT NULL, `name` text NULL, `email` text NOT NULL, `preferred_language` text NOT NULL DEFAULT 'en', `theme` text NOT NULL DEFAULT 'system', `timezone` text NOT NULL DEFAULT 'UTC', PRIMARY KEY (`id`));
-- Copy rows from old table "user_profiles" to new temporary table "new_user_profiles"
INSERT INTO `new_user_profiles` (`id`, `name`, `email`, `preferred_language`, `theme`, `timezone`) SELECT `id`, `name`, `email`, `preferred_language`, `theme`, `timezone` FROM `user_profiles`;
-- Drop "user_profiles" table after copying rows
DROP TABLE `user_profiles`;
-- Rename temporary table "new_user_profiles" to "user_profiles"
ALTER TABLE `new_user_profiles` RENAME TO `user_profiles`;
-- Enable back the enforcement of foreign-keys constraints
PRAGMA foreign_keys = on;
