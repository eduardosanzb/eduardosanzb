-- migrate:up
ALTER TABLE Chats
  ADD COLUMN external_id TEXT;

CREATE INDEX IF NOT EXISTS idx_chats_external_id ON Chats(external_id);

-- migrate:down
ALTER TABLE Chats
  DROP COLUMN external_id;
DROP INDEX IF EXISTS idx_chats_external_id;

