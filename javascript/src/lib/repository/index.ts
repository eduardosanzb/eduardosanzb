import { DummyDriver, Kysely, SqliteAdapter, SqliteIntrospector, SqliteQueryCompiler } from "kysely";
import BetterSqlite3 from "better-sqlite3";
import { type DB } from "./__schema.ts";
import { getContext } from "../context/index.ts";

const queryBuilder = new Kysely<DB>({
  dialect: {
    createAdapter: () => new SqliteAdapter(),
    createDriver: () => new DummyDriver(),
    createIntrospector: (db) => new SqliteIntrospector(db),
    createQueryCompiler: () => new SqliteQueryCompiler(),
  },
})

export const isSyncRunning = () => {
const db = getDbClient();
  db.executeQuery(
  queryBuilder.selectFrom('SyncLock').select('lock_status').compile())}

export function getDbClient(){
  const ctx = getContext();
  if (!ctx) {
    throw new Error("Context is not available. Ensure you are running within a context.");
  }
  const { config } = ctx;
  if (!config.databaseUrl) {
    throw new Error("Database path is not configured.");
  }

  const client = new BetterSqlite3(config.databaseUrl, {
    fileMustExist: true,
    timeout: 5000, // 5 seconds timeout
    verbose: config.isProduction ? undefined : ctx.logger.info.bind(ctx.logger),
    }
  );

  return client;
}

