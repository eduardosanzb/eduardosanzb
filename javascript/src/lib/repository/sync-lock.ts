import { getDbClient, queryBuilder } from "./index.ts";
import { z } from "zod";

const syncLockSchema = z.object({
  lock_id: z.number(),
  lock_status: z.coerce.boolean(),
  running_job_id: z.string().nullable(),
});
export type SyncLock = z.infer<typeof syncLockSchema>;
const THE_SYNC_LOCK_ID = 1;

export const syncLockRepository = {
  getTheSyncLock: async (): Promise<SyncLock> => {
    const db = getDbClient();
    const query = queryBuilder
      .selectFrom('SyncLock')
      .selectAll()
      .where('lock_id', '=', THE_SYNC_LOCK_ID)
      .compile();
    const result = await db.executeQuery(query);
    if (result.rows.length === 0) {
      throw new Error(`Sync lock with ID ${THE_SYNC_LOCK_ID} not found.`);
    }

    return syncLockSchema.parse(result.rows[0]);
  },
  updateSyncLock: async (lockStatus: boolean, jobId: string) => {
    const db = getDbClient();
    const query = queryBuilder
      .updateTable('SyncLock')
      .set({
        lock_status: lockStatus ? 1 : 0,
        running_job_id: jobId,
      })
      .where('lock_id', '=', 1)
      .compile();
    return await db.executeQuery(query);
  },
};
