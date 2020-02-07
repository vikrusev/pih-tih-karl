import config from '../../config'
import strackTrace from 'stack-trace'

import * as constants from '../../globals/constants'

/**
 * Logs message with log level (error, warn, info)
 * @param {string} logLevel - can be error, warn and info
 * @param {string} message - a message to be logged
 */
export const appLog = (logLevel: string, message: string): void => {

    const logger = config.logger;

    logLevel = logLevel.toLowerCase().trim();

    if (logLevel == 'error') {
        if (message && !(message.includes(constants.unhandledException) || message.includes(constants.unhandledRejection))) {
            const trace = strackTrace.get();

            message = `${message} > Stack:`;

            for (let i = 1; i < 4; i++) {
                if (trace[i]) {
                    message += `\n\tat ${trace[i].getFileName()} line: ${trace[i].getLineNumber()}`;
                }
            };
        }
    }

    logger.log(logLevel, `> ${message}`);
}