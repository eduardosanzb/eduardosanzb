-- migrate:up
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


-- migrate:down

DROP TABLE IF EXISTS ContactChats;
