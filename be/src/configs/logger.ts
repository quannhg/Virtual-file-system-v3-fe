import { FastifyError } from 'fastify';
import { PinoLoggerOptions } from 'fastify/types/logger';
import { envs } from './env';
import pino from 'pino';

const errorSerialize = (err: FastifyError) => {
    const isInternalServerError = !err.statusCode || err.statusCode === 500;
    return {
        type: err.name,
        stack: isInternalServerError && err.stack ? err.stack : 'null',
        message: err.message,
        statusCode: err.statusCode
    };
};

const loggerConfig: PinoLoggerOptions = {
    level: envs.isDevelopment ? 'debug' : 'info',
    transport: envs.isDev
        ? {
              target: 'pino-pretty',
              options: {
                  translateTime: 'dd/mm/yy HH:MM:ss',
                  ignore: 'pid,hostname'
              }
          }
        : undefined,
    serializers: { err: errorSerialize }
};

export const logger = pino(loggerConfig);
