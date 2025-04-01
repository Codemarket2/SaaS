import { createLogger, transports, format } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [new transports.Console()],
});

export function info(logMessage) {
  logger.info(logMessage);
}

export function error(logMessage) {
  logger.error(logMessage);
}

const loggerWithContext = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message, tenantId }) => {
      return `${timestamp} [${level.toUpperCase()}] [TenantId: ${
        tenantId || "N/A"
      }] ${message}`;
    })
  ),
  transports: [new transports.Console()],
});

// Function to log with tenant context
export const logWithTenantContext = (event, logMessage) => {
  const tenantId =
    event.requestContext?.authorizer?.tenantId || "UnknownTenant";

  loggerWithContext.info(logMessage, { tenantId });
};
export default { info, error, logWithTenantContext, logWithTenantContext };
