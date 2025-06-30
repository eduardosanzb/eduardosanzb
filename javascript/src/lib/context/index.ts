import { AsyncLocalStorage } from 'node:async_hooks';

import { type Config, createConfig } from "../config/index.ts";
import { createLogger, type Logger } from "../logger/index.ts";

const asyncLocalStorage = new AsyncLocalStorage<Context>();

export interface Context {
  config: Config;
  logger: Logger
  jobId: string;
}

function createContext():Context {
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

export function runWithContext<T>(fn: () => T) {
  const context = createContext();

  asyncLocalStorage.run(context, () => {
  try {
    return fn();
  } catch (error) {
    context.logger.error('Error in runWithContext:', error);
    throw error;
  } finally {
    context.logger.info(`Job "${context.jobId}" completed.`);
  }

})
}


