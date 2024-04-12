// src/server/core/error.ts
var createErrorResult = (code, message, e) => {
  return {
    code,
    message,
    stack: e.stack || new Error().stack,
    rawMessage: e.message
  };
};
export {
  createErrorResult
};
