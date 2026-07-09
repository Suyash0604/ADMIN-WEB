import { isNumericSelectType } from "./formFieldTypes";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/.+/i;
const HOST_RE =
  /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$|^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
const PERSON_NAME_RE = /^[a-zA-Z\s.'-]{2,}$/;
const TEXT_NAME_RE = /^[a-zA-Z\s.'&()-]+$/;
const SLUG_RE = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

const normalizeValue = (raw) => (typeof raw === "string" ? raw.trim() : raw);

/** Fields that collect a human-readable name — letters only, no digits. */
export const isTextNameField = (field) =>
  field.type === "text" &&
  (field.validate === "name" ||
    field.validate === "personName" ||
    field.name === "name" ||
    field.name.endsWith("_name"));

export const sanitizeTextNameInput = (value) =>
  String(value ?? "").replace(/\d/g, "");

const validateTextName = (field, normalized) => {
  if (/\d/.test(normalized)) {
    return `${field.label} cannot contain numbers.`;
  }
  if (!TEXT_NAME_RE.test(normalized)) {
    return `${field.label} can only contain letters and spaces.`;
  }
  return undefined;
};

export const validateField = (field, raw, { isEdit = false } = {}) => {
  if (field.type === "file") {
    if (field.required && !isEdit && !(raw instanceof File)) {
      return `${field.label} is required.`;
    }
    return undefined;
  }

  if (field.type === "boolean") return undefined;

  const normalized = normalizeValue(raw);

  if (field.required && !normalized) {
    return `${field.label} is required.`;
  }

  if (!normalized) return undefined;

  if (field.minLength != null && normalized.length < field.minLength) {
    return `${field.label} must be at least ${field.minLength} characters.`;
  }

  if (field.maxLength != null && normalized.length > field.maxLength) {
    return `${field.label} must be at most ${field.maxLength} characters.`;
  }

  if (field.type === "email" && !EMAIL_RE.test(normalized)) {
    return "Enter a valid email address.";
  }

  if (field.type === "url" && !URL_RE.test(normalized)) {
    return `${field.label} must start with http:// or https://`;
  }

  if (field.type === "phone" || field.validate === "phone") {
    const maxDigits = field.maxLength ?? 10;
    const minDigits = field.minLength ?? maxDigits;
    if (!/^\d+$/.test(normalized)) {
      return `${field.label} must contain only digits.`;
    }
    if (normalized.length < minDigits) {
      return `${field.label} must be ${minDigits} digits.`;
    }
    if (normalized.length > maxDigits) {
      return `${field.label} must be at most ${maxDigits} digits.`;
    }
  }

  if (field.validate === "personName" && !PERSON_NAME_RE.test(normalized)) {
    return `${field.label} must be at least 2 letters and may include spaces.`;
  }

  if (isTextNameField(field)) {
    const nameError = validateTextName(field, normalized);
    if (nameError) return nameError;
  }

  if (field.validate === "host" && !HOST_RE.test(normalized)) {
    return `Enter a valid hostname (e.g. mail.acme.com).`;
  }

  if (field.validate === "slug" && !SLUG_RE.test(normalized)) {
    return `${field.label} must start with a letter and use only letters, numbers, _ or -.`;
  }

  if (field.type === "number" || isNumericSelectType(field.type)) {
    const num = Number(normalized);
    if (Number.isNaN(num)) {
      return `${field.label} must be a number.`;
    }
    if (field.min != null && num < field.min) {
      return `${field.label} must be at least ${field.min}.`;
    }
    if (field.max != null && num > field.max) {
      return `${field.label} must be at most ${field.max}.`;
    }
    if (field.integer && !Number.isInteger(num)) {
      return `${field.label} must be a whole number.`;
    }
  }

  return undefined;
};
