import z from "zod";
import { getDbClient, queryBuilder } from "../index.ts";
import { getContext } from "../../context/index.ts";

/**
 * DTOs
 */
const contactSchema = z.object({
  contactId: z.ulid(),
  name: z.string(),
  email: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  chatAppUsername: z.string().nullable(),
  isCritical: z.boolean().default(false),
});

const contactSchemaInput = z.object({
  ...contactSchema.shape,
  contactId: z.ulid().optional(),
});

const contactChatSchemaInput = z.object({
  contactId: z.ulid(),
  chatId: z.ulid(),
  isAdmin: z.boolean().optional().default(false),
});

export type ContactOutput = z.infer<typeof contactSchema>;
export type ContactInput = z.input<typeof contactSchemaInput>;
export type ContactChatInput = z.input<typeof contactChatSchemaInput>;

/**
 * Repository
 */
export const contactsRepository = {
  bulkUpsertContact: async (contacts: ContactInput[]) => {
    const { logger } = getContext();
    const contactsValid = []
    const invalidContacts = []

    for (const contact of contacts) {
      const parsedContact = contactSchemaInput.safeParse(contact);
      if (parsedContact.success) {
        contactsValid.push(parsedContact.data);
      } else {
        invalidContacts.push(contact);
      }
    }

    if (invalidContacts.length > 0) {
      logger.error(
        `Contact validation error for ${invalidContacts.length} contacts.`,
      );
      }

    const db = getDbClient();

    const query = queryBuilder
      .insertInto("Contacts")
      .values(
        contactsValid.map((contact) => ({
          contact_id: contact.contactId,
          name: contact.name,
          email_address: contact.email === undefined ? null : contact.email,
          phone_number:
            contact.phoneNumber === undefined ? null : contact.phoneNumber,
          chat_app_username:
            contact.chatAppUsername === undefined
              ? null
              : contact.chatAppUsername,
          is_critical: contact.isCritical ? 1 : 0,
        })),
      )
      .onConflict((oc) =>
        oc.column("contact_id").doUpdateSet((eb) => ({
          name: eb.ref("excluded.name"),
          email_address: eb.ref("excluded.email_address"),
          phone_number: eb.ref("excluded.phone_number"),
          chat_app_username: eb.ref("excluded.chat_app_username"),
          is_critical: eb.ref("excluded.is_critical"),
        })),
      )
      .returningAll()
      .compile();

    const result = await db.executeQuery(query);

    if (result.rows.length === 0) {
      throw new Error("Failed to upsert contact");
    }

    return contactSchema.array().parse(
      result.rows.map((row) => ({
        contactId: row.contact_id,
        name: row.name,
        email: row.email_address === null ? undefined : row.email_address,
        phoneNumber: row.phone_number === null ? undefined : row.phone_number,
        chatAppUsername:
          row.chat_app_username === null ? undefined : row.chat_app_username,
        isCritical: Boolean(row.is_critical),
      })),
    );
  },

  assignContactToChat: async (params: ContactChatInput) => {
    contactChatSchemaInput.parse(params);
    const { contactId, chatId } = params;

    const query = queryBuilder
      .insertInto("ContactChats")
      .values({
        contact_id: contactId,
        chat_id: chatId,
        joined_at: new Date().toISOString(), // TODO: we need logic here
        is_admin: params.isAdmin ? 1 : 0,
      })
      .onConflict((oc) =>
        oc.columns(["chat_id", "contact_id"]).doUpdateSet({
          is_admin: params.isAdmin ? 1 : 0,
          // joined_at: <somethind>
        }),
      );

    const db = getDbClient();
    await db.executeQuery(query);
  },
};
