import z from "zod";
import { getDbClient, queryBuilder } from "../index.ts";
import { getContext } from "../../context/index.ts";

/**
* DTOs
**/
const chatSchema = z.object({
  chatId: z.string(),
  externalId: z.string(),
  chatLanguage: z.enum(['es', 'en', 'de', 'auto']).default('auto'),
  chatName: z.string().nullable(),
  chatType: z.enum(['group', 'private']).default('private'),
  createdAt: z.iso.datetime(),
  hasUnreadMessages: z.boolean().default(false),
  lastMessageDate: z.iso.datetime().nullable(),
});
const chatSchemaInput = z.object({
  ...chatSchema.shape,
  chatId: z.string().optional(),
});

export type ChatOutput = z.infer<typeof chatSchema>;
export type ChatInput = z.input<typeof chatSchemaInput>;

/**
* Repository
**/
export const chatRepository = {
  bulkUpsertChart: async (chats: ChatInput[]) => {
    const { logger } = getContext();
    const parsedChats = chatSchemaInput.array().safeParse(chats);
    if (parsedChats.error) {
      logger.error(z.prettifyError(parsedChats?.error), 'Chat validation error');
    }

    debugger
    const chatsValid = parsedChats.data
    const db = getDbClient();
    const query = queryBuilder
      .insertInto('Chats')
      .values(chatsValid.map((chat) => ({
        chat_id: chat.chatId,
        external_id: chat.externalId,
        chat_language: chat.chatLanguage,
        chat_name: chat.chatName,
        chat_type: chat.chatType,
        creation_date: chat.createdAt,
        has_unread_messages: chat.hasUnreadMessages ? 1 : 0,
        last_message_date: chat.lastMessageDate ? chat.lastMessageDate : null,
      })))
      .onConflict((oc) => oc
        .column('chat_id')
        .doUpdateSet((eb) => ({
          external_id: eb.ref('excluded.external_id'),
          chat_language: eb.ref('excluded.chat_language'),
          chat_name: eb.ref('excluded.chat_name'),
          chat_type: eb.ref('excluded.chat_type'),
          creation_date: eb.ref('excluded.creation_date'),
          has_unread_messages: eb.ref('excluded.has_unread_messages'),
          last_message_date: eb.ref('excluded.last_message_date'),
        })))
      .returningAll()
      .compile();
    const result = await db.executeQuery(query);
    if (result.rows.length === 0) {
      throw new Error('Failed to upsert chat');
    }
    return chatSchema.array().parse(result.rows.map(row => ({
      chatId: row.chat_id,
      externalId: row.external_id,
      chatLanguage: row.chat_language,
      chatName: row.chat_name,
      chatType: row.chat_type,
      createdAt: row.creation_date,
      hasUnreadMessages: Boolean(row.has_unread_messages),
      lastMessageDate: row.last_message_date,
    })));
  }
};
