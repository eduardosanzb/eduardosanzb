import WW, { Client, type Chat, type Message } from 'whatsapp-web.js';
const { LocalAuth } = WW;

import * as qrcode from 'qrcode-terminal';

interface WhatsAppClientAbstracted {
  getAllChats: () => Promise<Chat[]>;
  getAllMessages: (chatId: string) => Promise<Message[]>;
}

// TODO: we need to create this client
export async function initializeWhatsAppClient(
): Promise<WhatsAppClientAbstracted> {
  return new Promise((resolve, reject) => {

    const client = new Client({
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
      authStrategy: new LocalAuth({
        dataPath: './whatsapp-session', // TODO: we should use an remote Auth Strategy
      })
    });

    client.once('ready', async () => {
      console.log('Client is ready!');
      resolve({
        getAllChats,
        getAllMessages,
      });
    });

    function getAllChats(): Promise<Chat[]> {
      return client.getChats();
    }

    async function getAllMessages(chatId: string): Promise<Message[]> {
      const chat = await client.getChatById(chatId);
      return await chat.fetchMessages({
        limit: undefined, // Fetch all messages
        fromMe: false, // Exclude messages sent by the client
      });
    }

    // When the client received QR-Code
    client.on('qr', (qr) => {
      console.log('QR RECEIVED', qr);
      qrcode.generate(qr, { small: true });
    });

    client.on('loading_screen', (percent, message) => {
      console.log('LOADING SCREEN', percent, message);
    });

    console.log('initializing')
    client.initialize();

    return {
      getAllChats,
      getAllMessages,
    }
  })
};
