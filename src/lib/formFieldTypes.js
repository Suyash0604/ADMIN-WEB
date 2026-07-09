const NUMERIC_SELECT_TYPES = new Set([
  "client",
  "user",
  "designation",
  "buLocation",
  "masterDocument",
  "product",
  "channel",
  "clientProductChannel",
  "llmModel",
  "sttModel",
  "ttsModel",
  "provider",
  "languageId",
]);

const STRING_SELECT_TYPES = new Set(["language"]);

export const isNumericSelectType = (type) => NUMERIC_SELECT_TYPES.has(type);

export const isStringSelectType = (type) => STRING_SELECT_TYPES.has(type);

export const isApiSelectType = (type) =>
  isNumericSelectType(type) || isStringSelectType(type);
