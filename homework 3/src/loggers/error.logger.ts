import winston, { Logger, format } from 'winston';
const { timestamp, colorize, printf } = format;


export const errorLogger: Logger = winston.createLogger({
  level: 'error',
  format: format.combine(
    timestamp(),
    colorize(),
    printf(({ level, message, timestamp, requestMethod, parsedArguments }) => {
        if (requestMethod) {
            return `${level}: ${timestamp} \u2192 ${message}\n \u2193 Request info \u2193\n Request method \u2192 ${requestMethod}\n Request arguments \u2192 ${parsedArguments ? parsedArguments : 'no arguments'}`; // \u2193 - arrow right, \u2193 - arrow down
        }
        return `${level}: ${timestamp} \u2192 ${message} `;
    }),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});
