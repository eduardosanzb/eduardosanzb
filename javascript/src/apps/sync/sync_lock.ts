import { getContext } from "../../lib/context/index.ts";
import { syncLockRepository } from "../../lib/repository/index.ts";

export async function ensureSyncLock(){
  const isSyncAlreadyRunning = await isSyncRunning();
  if (isSyncAlreadyRunning) {
    throw new Error('Sync is already running');
  }
  await setSyncLock(true);
}

const isSyncRunning = async () => {
  const result = await syncLockRepository.getTheSyncLock();
  return result.lock_status === true;
}

export const setSyncLock = async (status: boolean) => {
  const ctx = getContext();
  await syncLockRepository.updateSyncLock(status, ctx.jobId);
}
