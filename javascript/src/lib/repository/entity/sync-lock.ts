import { z } from "zod";
import { getDbClient, queryBuilder } from "../index.ts";

/**
* DTOs
**/
const syncLockSchema = z.object({
  lockId: z.number(),
  lockStatus: z.coerce.boolean(),
  runningJobId: z.string().nullable(),
});
export type SyncLock = z.infer<typeof syncLockSchema>;
const THE_SYNC_LOCK_ID = 1;

/**
* Repository
**/
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

    return syncLockSchema.parse({
      lockId: result.rows[0].lock_id,
      lockStatus: result.rows[0].lock_status === 1,
      runningJobId: result.rows[0].running_job_id,
    });
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
