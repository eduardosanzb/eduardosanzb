import WhatsWebJS from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal';
const { Client, LocalAuth } = WhatsWebJS
import { inspect } from 'util'
import fs from 'node:fs';
console.log('WhatsApp Web JS Example');

// Create a new client instance
const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  authStrategy: new LocalAuth({
    dataPath: './whatsapp-session',
  })
});

// When the client is ready, run this code (only once)
client.once('ready', async () => {
  console.log('Client is ready!');
  client.setProfilePicture
  const chats = await client.getChats()
  const state = await client.getState()
  console.log(`Client state: ${state}`);
  fs.writeFileSync('state.txt', state);
  console.log(`Total chats: ${chats.length}`);
  // console.log(inspect(chats[0]))
  fs.writeFileSync('chats.json', JSON.stringify(chats, null, 2));
  // For each of the chats we want to get all the Messages
});



// When the client received QR-Code
client.on('qr', (qr) => {
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr, { small: true });

});


client.on('message_create', message => {
  if (!message.fromMe) {
    console.log(message.from);
  }
});

// Start your client
client.initialize();

