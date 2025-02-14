import WhatsWebJS from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal';
const { Client, LocalAuth } = WhatsWebJS
import { inspect } from 'util'

// Create a new client instance
const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  authStrategy: new LocalAuth()
});

// When the client is ready, run this code (only once)
client.once('ready', async () => {
  console.log('Client is ready!');
  const chats = await client.getChats()
  console.log(chats)
  console.log(inspect(chats[0]))

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

