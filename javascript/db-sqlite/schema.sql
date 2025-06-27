CREATE TABLE IF NOT EXISTS "schema_migrations" (version varchar(128) primary key);
CREATE TABLE UserProfile (
    user_profile_id ulid PRIMARY KEY DEFAULT(ulid()),
    name TEXT NOT NULL,
    email TEXT,
    preferred_language TEXT DEFAULT 'en',
    theme TEXT DEFAULT 'system',
    timezone TEXT DEFAULT 'UTC'
);
CREATE TABLE SummaryPreferences (
    summary_preferences_id TEXT PRIMARY KEY,
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
    contact_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone_number TEXT,
    email_address TEXT,
    chat_app_username TEXT,
    is_critical BOOLEAN NOT NULL DEFAULT FALSE,
    contact_language TEXT
);
CREATE TABLE Chats (
    chat_id TEXT PRIMARY KEY,
    chat_type TEXT NOT NULL DEFAULT 'one_to_one',
    chat_name TEXT,
    chat_language TEXT DEFAULT NULL,
    creation_date TEXT,
    last_message_date TEXT,
    has_unread_messages BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE Messages (
    message_id TEXT PRIMARY KEY,
    chat_id TEXT NOT NULL,
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
    summary_id TEXT PRIMARY KEY,
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
    task_id TEXT PRIMARY KEY,
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
-- Dbmate schema migrations
INSERT INTO "schema_migrations" (version) VALUES
  ('20250627065305');
