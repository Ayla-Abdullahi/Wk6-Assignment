// Simple logger utility (placeholder for winston/morgan usage)
function logInfo(message, meta = {}) {
  // In real app integrate with Winston or pino.
  // For test visibility keep console.log.
  console.log(JSON.stringify({ level: 'info', message, ...meta }));
}

function logError(message, meta = {}) {
  console.error(JSON.stringify({ level: 'error', message, ...meta }));
}

module.exports = { logInfo, logError };
