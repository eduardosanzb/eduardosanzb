import pino from 'pino';
import { type Config } from '../config/index.ts';
import { getContext } from '../context/index.ts';

export interface Logger extends pino.Logger {}

export function createLogger(config: Config): Logger {
  const mixin =() => ({
    jobId: (getContext()).jobId,
  });
  if (config.isProduction) {
    return pino();
  }

  return pino({
    level: config.logLevel,
      mixin,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
      },
    },
  });
}
