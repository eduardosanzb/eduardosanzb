import { AsyncLocalStorage } from 'node:async_hooks';

import { type Config, createConfig } from "../config/index.ts";
import { createLogger, type Logger } from "../logger/index.ts";

const asyncLocalStorage = new AsyncLocalStorage<Context>();

export interface Context {
  config: Config;
  logger: Logger
  jobId: string;
}

function createContext(): Context {
  const config = createConfig();
  const jobId = Math.random().toString(36).substring(2, 15);
  const logger = createLogger(config);
  return {
    config,
    logger,
    jobId,
  };
}

export function getContext(): Context | undefined {
  return asyncLocalStorage.getStore();
}

export async function runWithContext<T>(
  fn: () => T,
  errorHandler?: (error: Error) => Promise<void>,
  finallyHandler?: () => Promise<void>,
) {
  const context = createContext();

  await asyncLocalStorage.run(context, async () => {
    try {
      await  fn();
    } catch (error) {
      context.logger.error('Error in runWithContext:', error);
      if (errorHandler) {
        await errorHandler(error as Error);
      } else {
        context.logger.error('No error handler provided, rethrowing error.');
        throw error;
      }
    } finally {
      context.logger.info(`Job "${context.jobId}" completed.`);
      if (finallyHandler) {
        await finallyHandler();
      } else {
        context.logger.info('No finally handler provided.');
      }
    }
  });
}


