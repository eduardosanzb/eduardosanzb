import { getContext } from "../../lib/context/index.ts";
import { syncLockRepository } from "../../lib/repository/index.ts";

// TODO: actually we should store each of the syncs that are running
// and store the status of the sync; most importantly we should store the errors if it failed
// we can use the context to create a report of the sync

export async function ensureSyncLock(){
  const isSyncAlreadyRunning = await isSyncRunning();
  if (isSyncAlreadyRunning) {
    throw new Error('Sync is already running');
  }
  await setSyncLock(true);
}

const isSyncRunning = async () => {
  const result = await syncLockRepository.getTheSyncLock();
  return result.lockStatus === true;
}

export const setSyncLock = async (status: boolean) => {
  const ctx = getContext();
  await syncLockRepository.updateSyncLock(status, ctx.jobId);
}
