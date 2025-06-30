import { DummyDriver, Kysely, SqliteAdapter, SqliteDialect, SqliteIntrospector, SqliteQueryCompiler } from "kysely";
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


export const isSyncRunning = async () => {
  const db = getDbClient();
  const [result] =await db.selectFrom('SyncLock').select('lock_status').execute();
  return result.lock_status === 1;

}

export function getDbClient() {
  const ctx = getContext();
  if (!ctx) {
    throw new Error("Context is not available. Ensure you are running within a context.");
  }
  const { config } = ctx;
  if (!config.databaseUrl) {
    throw new Error("Database path is not configured.");
  }

  ctx.logger.debug(`current path is ${process.cwd()}`);
  ctx.logger.debug(`Connecting to database at ${config.databaseUrl}`);
  const client = new BetterSqlite3(config.databaseUrl, {
    fileMustExist: true,
    timeout: 5000, // 5 seconds timeout
    verbose: config.isProduction ? undefined : ctx.logger.info.bind(ctx.logger),
  }
  );


  const dialect = new SqliteDialect({
    database: client,
  })

  // Database interface is passed to Kysely's constructor, and from now on, Kysely
  // knows your database structure.
  // Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
  // to communicate with your database.
  const db = new Kysely<DB>({
    dialect,
  })
  // client.pragma('journal_mode = WAL');


  return db
}

