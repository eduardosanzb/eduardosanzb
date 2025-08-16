import { AsyncLocalStorage } from "node:async_hooks";

import { type Config, createConfig } from "../config/index.ts";
import { createLogger, type Logger } from "../logger/index.ts";
import { repositories } from "../repository/index.ts";

const asyncLocalStorage = new AsyncLocalStorage<Context>();

export interface Context {
  config: Config;
  logger: Logger;
  jobId: string;
}

function createContext(): Context {
  const config = createConfig();
  const jobId = Math.random().toString(36).substring(2, 15); // TODO: use Ulid
  const logger = createLogger(config);
  return {
    config,
    logger,
    jobId,
    ...repositories,
  };
}

export function getContext(): Context {
  const context = asyncLocalStorage.getStore();
  if (!context) {
    console.trace(); // TODO: maybe we do not need this.
    throw new Error(
      "No context found. Ensure you are running within a context.",
    );
  }
  return context;
}

export async function runWithContext<T>(
  fn: () => T,
  errorHandler?: (error: Error) => Promise<void>,
  finallyHandler?: () => Promise<void>,
) {
  const context = createContext();

  await asyncLocalStorage.run(context, async () => {
    try {
      await fn();
    } catch (error) {
      context.logger.error("Error in runWithContext:", error);
      if (errorHandler) {
        await errorHandler(error as Error);
      } else {
        context.logger.error("No error handler provided, rethrowing error.");
        throw error;
      }
    } finally {
      context.logger.info(`Job "${context.jobId}" completed.`);
      if (finallyHandler) {
        await finallyHandler();
      } else {
        context.logger.info("No finally handler provided.");
      }
    }
  });
}
