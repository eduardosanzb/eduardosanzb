import { getContext, runWithContext } from '../../lib/context/index.ts';
import { ensureSyncLock, setSyncLock } from './sync_lock.ts';


async function main() {
  const context = getContext();
  const { logger } = context;
  logger.info('Starting WhatsApp message fetcher...');
  await ensureSyncLock();

  const messages = await fetchWhatsAppMessages();
  logger.debug({ messages });
  await setSyncLock(false);
}


// TODO: do i have to wait this?
runWithContext(main)


// * **Purpose**: Fetches WhatsApp messages from an external source and sends them to the Core Backend for processing.
async function fetchWhatsAppMessages() {
  return []
}


