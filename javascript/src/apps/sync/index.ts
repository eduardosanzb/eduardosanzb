import { getContext, runWithContext } from '../../lib/context/index.ts';
import { ChatInput, chatRepository } from '../../lib/repository/entity/chat.ts';
import { ContactInput } from '../../lib/repository/entity/contacts.ts';
import { initializeWhatsAppClient } from '../../lib/whatsapp/index.ts';
import { ensureSyncLock, setSyncLock } from './sync_lock.ts';

(async () => {
  await runWithContext(async function main(){
  const context = getContext();
  const { logger } = context;
  logger.info('Starting WhatsApp message fetcher...');
  await ensureSyncLock();

  await processWhatsappChats();

  await setSyncLock(false);
  logger.info('WhatsApp message fetcher completed successfully.');

  }, async (error) => {

    const context = getContext();
    const { logger } = context;
    // TODO: Here we should report the error to the sync_lock
    logger.error(error, 'Error occurred in WhatsApp message fetcher.');

  }, async () => {

    const context = getContext();
    const { logger } = context;
    logger.info('Finally handler executed after WhatsApp message fetcher.');
    await setSyncLock(false);

  })
})();

// * **Purpose**:
// Fetches WhatsApp messages from an external source and sends them to the Core
// Backend for processing.
async function processWhatsappChats() {
  const { logger } = getContext();
  const { getAllChats } = await initializeWhatsAppClient();
  const chats = await getAllChats();
  logger.info(`Found ${chats.length} chats.`);
  debugger

  const chatsToInsert = [];

  // 1. First we are going to attempt to insert "resources"; Without link
  //  We are 100% sure the link will exists so is not a big issue.
  //  But to accelerate the batchInserting.

  for (const chat of chats){
    const chatInput:ChatInput = {
      externalId: chat.id._serialized,
      // chatLanguage: 'auto', // Default language, can be customized
      chatName: chat.name || null,
      chatType: chat.isGroup ? 'group' : 'private',
      createdAt: new Date().toISOString(), // Use current date for creation
      hasUnreadMessages: chat.unreadCount > 0,
      lastMessageDate: new Date(chat.timestamp).toISOString(),
    }
    const contact = await chat.getContact()

    const contactToInsert: ContactInput = {
      name: contact?.name || contact?.pushname || contact?.shortName || contact?.verifiedName,
      email: 'todo', // for this we have to check the convo
      phoneNumber: contact.number,
      chatAppUsername: contact.id._serialized,
      isCritical: false
    }

  }

  // const insertedChats = await chatRepository.bulkUpsertChart(chats.map(chat => ({
  // })));

  // Task:
  // now that we have the inserted chats; lets upsert the Contacts;
  // lets try to build them as much as possible using the values form the chats coming from the whatsapp client
  // we can see the interface of this in the node_modules/.../whatsapp-js or something like that
  // And then we can try to implement the mapping of the data



}


