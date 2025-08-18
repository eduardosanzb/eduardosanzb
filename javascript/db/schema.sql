CREATE TABLE IF NOT EXISTS "schema_migrations" (version varchar(128) primary key);
CREATE TABLE SyncLock (
    lock_id INTEGER PRIMARY KEY AUTOINCREMENT,
    lock_status BOOLEAN NOT NULL DEFAULT FALSE,
    latest_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    running_job_id TEXT DEFAULT NULL
);
CREATE TABLE UserProfile (
    user_profile_id ulid PRIMARY KEY DEFAULT(ulid()),
    name TEXT NOT NULL,
    email TEXT,
    preferred_language TEXT DEFAULT 'en',
    theme TEXT DEFAULT 'system',
    timezone TEXT DEFAULT 'UTC'
);
CREATE TABLE SummaryPreferences (
    summary_preferences_id ulid PRIMARY KEY DEFAULT(ulid()),
    user_profile_id TEXT NOT NULL UNIQUE,
    summary_frequency TEXT NOT NULL DEFAULT 'daily',
    daily_summary_time TEXT DEFAULT '09:00',
    weekly_summary_day TEXT DEFAULT 'Monday',
    scheduled_summary_times TEXT, -- JSON array of times.
    summarize_chat_types TEXT NOT NULL DEFAULT 'all',
    keywords_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    keywords_list TEXT, -- JSON array of keywords.
    FOREIGN KEY (user_profile_id) REFERENCES UserProfile(user_profile_id)
);
CREATE TABLE Contacts (
    contact_id ulid PRIMARY KEY DEFAULT(ulid()),
    name TEXT NOT NULL,
    phone_number TEXT,
    email_address TEXT,
    chat_app_username TEXT,
    is_critical BOOLEAN NOT NULL DEFAULT FALSE,
    contact_language TEXT
);
CREATE TABLE Chats (
    chat_id ulid PRIMARY KEY DEFAULT(ulid()),
    chat_type TEXT NOT NULL DEFAULT 'private', -- 'private', 'group'
    chat_name TEXT,
    chat_language TEXT DEFAULT NULL,
    creation_date TEXT,
    last_message_date TEXT,
    has_unread_messages BOOLEAN NOT NULL DEFAULT FALSE
, external_id TEXT);
CREATE TABLE Messages (
    message_id INT NOT NULL PRIMARY KEY,
    chat_id ulid NOT NULL,
    sender_type TEXT NOT NULL DEFAULT 'contact',
    sender_id TEXT NOT NULL, -- References either UserProfile or Contacts.
    sent_date TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'text',
    text_content TEXT,
    media_url TEXT,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    is_forwarded BOOLEAN NOT NULL DEFAULT FALSE,
    has_media BOOLEAN NOT NULL DEFAULT FALSE,
    message_embedding BLOB, -- Vector embedding.
    FOREIGN KEY (chat_id) REFERENCES Chats(chat_id)
);
CREATE TABLE Summary (
    summary_id ulid PRIMARY KEY DEFAULT(ulid()),
    user_profile_id TEXT NOT NULL,
    summary_timestamp TIMESTAMP NOT NULL,
    metadata_section_data TEXT, -- JSON object.
    top_ranked_conversations_data TEXT, -- JSON array.
    key_conversation_topics_data TEXT, -- JSON object.
    status TEXT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    completion_time TIMESTAMP,
    error_message TEXT,
    FOREIGN KEY (user_profile_id) REFERENCES UserProfile(user_profile_id)
);
CREATE TABLE ReplyTask (
    task_id ulid PRIMARY KEY DEFAULT(ulid()),
    user_profile_id TEXT NOT NULL,
    context_data TEXT, -- JSONB/NVARCHAR(MAX)
    status VARCHAR(20) NOT NULL,
    result_text TEXT,
    attempts_count INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Initial value
    error_message TEXT,
    retrieved_context TEXT, -- RAG Augmented Context.
    retrieval_sources TEXT, -- RAG Source Metadata.
    FOREIGN KEY (user_profile_id) REFERENCES UserProfile(user_profile_id)
);
CREATE TRIGGER update_replytask_updated_at
AFTER UPDATE ON ReplyTask
BEGIN
  UPDATE ReplyTask SET updated_at = CURRENT_TIMESTAMP WHERE task_id = NEW.task_id;
END;
CREATE INDEX idx_summary_user_profile_id ON Summary(user_profile_id);
CREATE INDEX idx_messages_chat_id ON Messages(chat_id);
CREATE TABLE ContactChats (
  contact_id ulid NOT NULL,
  chat_id ulid NOT NULL,

  is_admin BOOLEAN NOT NULL DEFAULT FALSE,

  joined_at TIMESTAMP NOT NULL,

  -- Foreign keys
  CONSTRAINT fk_contact FOREIGN KEY (contact_id) REFERENCES Contacts(contact_id),
  CONSTRAINT fk_chat FOREIGN KEY (chat_id) REFERENCES Chats(chat_id),

  -- Unique constraints
  CONSTRAINT unique_relationship UNIQUE (contact_id, chat_id)
);
CREATE TRIGGER prevent_is_admin_for_private_chats
BEFORE INSERT ON ContactChats
FOR EACH ROW
WHEN (
    NEW.is_admin = TRUE
    AND (SELECT chat_type FROM Chats WHERE chat_id = NEW.chat_id) != 'group'
)
BEGIN
    SELECT RAISE(ABORT, 'is_admin can only be set for group chats');
END;
CREATE UNIQUE INDEX idx_chats_external_id ON Chats(external_id);
-- Dbmate schema migrations
INSERT INTO "schema_migrations" (version) VALUES
  ('20250627065305'),
  ('20250630063153'),
  ('20250710043830'),
  ('20250711085358'),
  ('20250816214331'),
  ('20250816214428');
