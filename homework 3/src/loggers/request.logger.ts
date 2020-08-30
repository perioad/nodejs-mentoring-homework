import winston, { Logger } from 'winston';

export const requestLogger: Logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(info => `${info.level}: ${info.timestamp} -> ${info.message}`)
      ),
    }),
  ],
});
