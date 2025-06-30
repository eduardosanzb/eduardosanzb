import {  getContext, runWithContext } from '../../lib/context/index.ts';
import { isSyncRunning } from '../../lib/repository/index.ts';


async function main() {
  const context = getContext();
  const { logger } = context;
  logger.info('Starting WhatsApp message fetcher...');


  const isLockRunning = await isSyncRunning(context.db);
  logger.info(isLockRunning);
  const messages = await fetchWhatsAppMessages();

}


runWithContext(main);


// * **Purpose**: Fetches WhatsApp messages from an external source and sends them to the Core Backend for processing.
function fetchWhatsAppMessages() {
  throw new Error('Function not implemented.');
}

