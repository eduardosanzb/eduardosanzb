<<<<<<< Updated upstream
import { getContext, runWithContext } from '../../lib/context/index.ts';
import {  type ChatInput, chatRepository } from '../../lib/repository/entity/chat.ts';
import { contactsRepository, type ContactInput } from '../../lib/repository/entity/contacts.ts';
import { initializeWhatsAppClient } from '../../lib/whatsapp/index.ts';
import { ensureSyncLock, setSyncLock } from './sync_lock.ts';
import readline  from 'readline';

function askQuestion(query:string) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}
=======
import { getContext, runWithContext } from "../../lib/context/index.ts";
import {
  type ChatInput,
  chatRepository,
} from "../../lib/repository/entity/chat.ts";
import {
  type ContactChatInput,
  type ContactInput,
  contactsRepository,
} from "../../lib/repository/entity/contacts.ts";
import { initializeWhatsAppClient } from "../../lib/whatsapp/index.ts";
import { ensureSyncLock, setSyncLock } from "./sync_lock.ts";
import { ulid } from "ulid";
>>>>>>> Stashed changes

(async () => {
  await runWithContext(
    async function main() {
      const context = getContext();
      const { logger } = context;
      logger.info("Starting WhatsApp message fetcher...");
      await ensureSyncLock();

      await processWhatsappChats();

      await setSyncLock(false);
      logger.info("WhatsApp message fetcher completed successfully.");
    },
    async (error) => {
      const context = getContext();
      const { logger } = context;
      // TODO: Here we should report the error to the sync_lock
      logger.error(error, "Error occurred in WhatsApp message fetcher.");
    },
    async () => {
      const context = getContext();
      const { logger } = context;
      logger.info("Finally handler executed after WhatsApp message fetcher.");
      await setSyncLock(false);
    },
  );
})();

// * **Purpose**:
// Fetches WhatsApp messages from an external source and sends them to the Core
// Backend for processing.
async function processWhatsappChats() {
  const { logger } = getContext();
  const { getAllChats, getContactById } = await initializeWhatsAppClient();
  const chats = await getAllChats();
  logger.info(`Found ${chats.length} chats.`);
<<<<<<< Updated upstream

  const chatsToInsert: ChatInput[] = [];
  const contactsToInsert: ContactInput[] = [];
  // problems
  // 1. we are inserting double contact
  //    we can also use the  chatAppUsername and or phoneNumber to identify the contact
  //    also we are inserting ourselves as a contact.
  // 2. we are missing the connection between contacts and chats

  for (const chat of chats){
    logger.debug(`contactsInserted: ${contactsToInsert.length}`);
    logger.debug(`chatsInserted: ${chatsToInsert.length}`);
    const chatInput:ChatInput = {
      externalId: chat.id._serialized,
      // chatLanguage: 'auto', // Default language, can be customized
      chatName: chat.name || null,
      chatType: chat.isGroup ? 'group' : 'private',
      createdAt: new Date().toISOString(), // Use current date for creation
      hasUnreadMessages: chat.unreadCount > 0,
      lastMessageDate: new Date(chat.timestamp).toISOString(),
    }
    chatsToInsert.push(chatInput);

    if(chat.isGroup){
        logger.info(`Processing group chat: ${chat.name} (${chat.id._serialized})`);
        const participants = chat.participants
        logger.info(`Group has ${participants.length} participants.`);
        const promises = participants.map(async (participant) => {
        // TODO: i should paralize this
            const contact  = await getContactById(participant.id._serialized);
        if(contact){
            const contactToInsert: ContactInput = {
              name: contact?.name || contact?.pushname || contact?.shortName || contact?.verifiedName || participant.id.user,
              email: 'todo', // for this we have to check the convo
              phoneNumber: contact.number,
              chatAppUsername: contact.id._serialized,
              isCritical: false
            }
            contactsToInsert.push(contactToInsert);
        }
        })
        await Promise.allSettled(promises);
    } else {
    // 2. Now we are going to fetch the contact and insert it
    const contact = await chat.getContact()
=======
  debugger;

  const chatsToInsert = [];
  const contactsToInsert = new Set<ContactInput>();
  const relationshipsToInsert: ContactChatInput[] = [];

  for (const chat of chats) {
    // i want to log how many every 10
    if (chatsToInsert.length % 10 === 0) {
      logger.info(`Processing chat ${chatsToInsert.length} of ${chats.length}`);
    }
    const chatInput: ChatInput = {
      chatId: ulid(),
      externalId: chat.id._serialized,
      // chatLanguage: 'auto', // Default language, can be customized
      chatName: chat.name || null,
      chatType: chat.isGroup ? "group" : "private",
      createdAt: new Date().toISOString(), // TODO: maybe we can get from api
      hasUnreadMessages: chat?.unreadCount > 0,
      // chat.timestamp can be undefined
      lastMessageDate: (() => {
        if (chat.lastMessage) {
          return new Date(chat.lastMessage.timestamp).toISOString();
        }
        return null;
      })(),
    };
    chatsToInsert.push(chatInput);
>>>>>>> Stashed changes

    const contact = await chat.getContact();
    if (!contact) {
      logger.warn(`Chat ${chatInput.chatId} has no contact associated.`);
      continue;
    }
    const contactToInsert: ContactInput = {
      contactId: ulid(),
      name:
        contact?.name ||
        contact?.pushname ||
        contact?.shortName ||
        contact?.verifiedName,
      email: "todo", // for this we have to check the convo
      phoneNumber: contact.number,
      chatAppUsername: contact.id._serialized,
<<<<<<< Updated upstream
      isCritical: false
    }
    contactsToInsert.push(contactToInsert);

    }
  }

  await askQuestion('Press enter to continue...'); // This is just to pause the execution for the
  // 3. Now we are going to insert the chats and contacts in batch
  await chatRepository.bulkUpsertChat(chatsToInsert);
  logger.info(`Inserted ${chatsToInsert.length} chats.`);
  const contacts = await contactsRepository.bulkUpsertContact(contactsToInsert);
  logger.info(`Inserted ${contactsToInsert.length} contacts.`);

  await askQuestion('Press enter to continue...'); // This is just to pause the execution for the
  for (const contact of contacts) {
    logger.info(`Contact inserted: ${contact.contactId} - ${contact.name}`);
    await contactsRepository.assignContactToChat({
      contactId: contact.contactId,
      chatId: contact.chatAppUsername || contact.phoneNumber || '',
      isAdmin: false, // TODO: we need logic here
    }
    )
  }
=======
      isCritical: false,
    };
    logger.debug(`Contact to insert: ${JSON.stringify(contactToInsert)}`);
    // if (contactsToInsert) {
    //   if (contactsToInsert.has(contactsToInsert)) {
    //     continue;
    //   }
    // }
    contactsToInsert.add(contactToInsert);

    // now we need to create the relationship between the chat and the contact
    const relationship: ContactChatInput = {
      contactId: contactToInsert.contactId,
      chatId: chatInput.chatId,
      // isAdmin: chat.isGroup ? chat.groupMetadata?.owner === contact.id._serialized : false,
    };
    relationshipsToInsert.push(relationship);
  }

  const insertedChats = await chatRepository.bulkUpsertChart(chatsToInsert);
  logger.info(`Inserted ${insertedChats.length} chats into the database.`);
  await contactsRepository.bulkUpsertContact(Array.from(contactsToInsert));
  logger.info(`Inserted ${contactsToInsert.size} contacts into the database.`);

  relationshipsToInsert.forEach(async (relationship) => {
    await contactsRepository.assignContactToChat(relationship);
  });

  // Task:
  // now that we have the inserted chats; lets upsert the Contacts;
  // lets try to build them as much as possible using the values form the chats coming from the whatsapp client
  // we can see the interface of this in the node_modules/.../whatsapp-js or something like that
  // And then we can try to implement the mapping of the data
>>>>>>> Stashed changes
}
