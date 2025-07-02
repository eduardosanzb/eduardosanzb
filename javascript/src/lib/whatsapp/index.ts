import WhatsWebJS from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal';
const { Client, LocalAuth } = WhatsWebJS

// TODO: we need to create this client
export async function initializeWhatsAppClient(
  readyCallback: () => void = () => {},
) {
  const client = new Client({
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth({
      dataPath: './whatsapp-session',
    })
  });

  client.once('ready', async () => {
    console.log('Client is ready!');
    client.setProfilePicture
    const chats = await client.getChats()
    const state = await client.getState()
    console.log(`Client state: ${state}`);
    console.log(`Total chats: ${chats.length}`);
    // console.log(inspect(chats[0]))
    // For each of the chats we want to get all the Messages
  });




  // When the client received QR-Code
  client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
  });


  client.on('message_create', message => {
    if (message.fromMe) {
      console.log(message);
    }
  });
  client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
  });
  console.log('initializing')
  client.initialize();
}

// Create a new client instance

// When the client is ready, run this code (only once)

// Start your client
