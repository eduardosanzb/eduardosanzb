-- migrate:up
DROP INDEX IF EXISTS idx_chats_external_id;
CREATE UNIQUE INDEX idx_chats_external_id ON Chats(external_id);

-- migrate:down
DROP INDEX IF EXISTS idx_chats_external_id;
CREATE INDEX idx_chats_external_id ON Chats(external_id);

