import WW, {
  Client,
  type GroupChat as WWSGroupChat,
  type Chat as WWSChat,
  type Message,
  type Contact as WWSContact,
} from "whatsapp-web.js";
const { LocalAuth } = WW;

import * as qrcode from "qrcode-terminal";

interface Chat extends WWSChat {
  isGroup: false;
}
interface GroupChat extends WWSGroupChat {
  isGroup: true;
}

interface Contact extends WWSContact {}

interface WhatsAppClientAbstracted {
  getAllChats: () => Promise<Array<Chat | GroupChat>>;
  getAllMessages: (chatId: string) => Promise<Message[]>;
  getContactById: (contactId: string) => Promise<Contact>;
}

// TODO: we need to create this client
export async function initializeWhatsAppClient(): Promise<WhatsAppClientAbstracted> {
  // TODO: reject
  return new Promise((resolve, reject) => {
    const client = new Client({
      puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
      authStrategy: new LocalAuth({
        dataPath: "./whatsapp-session", // TODO: we should use an remote Auth Strategy
      }),
    });

    client.once("ready", async () => {
      console.log("Client is ready!");
      resolve({
        getAllChats,
        getAllMessages,
        getContactById,
      });
    });

    async function getContactById(contactId: string): Promise<Contact> {
      if (!contactId) {
        throw new Error("Contact ID is required");
      }
      const contact = await client.getContactById(contactId);
      return contact as Contact;
    }

    async function getAllChats(): Promise<Array<Chat | GroupChat>> {
      const results = await client.getChats();

      return results.map((chat) => {
        if (chat.isGroup) {
          return chat as GroupChat;
        } else {
          return chat as Chat;
        }
      });
    }

    async function getAllMessages(chatId: string): Promise<Message[]> {
      const chat = await client.getChatById(chatId);
      return await chat.fetchMessages({
        limit: undefined, // Fetch all messages
        fromMe: false, // Exclude messages sent by the client
      });
    }

    // When the client received QR-Code
    client.on("qr", (qr) => {
      console.log("QR RECEIVED", qr);
      qrcode.generate(qr, { small: true });
    });

    client.on("loading_screen", (percent, message) => {
      console.log("LOADING SCREEN", percent, message);
    });

    console.log("initializing");
    client.initialize();

    return {
      getAllChats,
      getAllMessages,
    };
  });
}
