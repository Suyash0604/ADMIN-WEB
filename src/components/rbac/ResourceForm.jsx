import { useMemo, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import FormField from "../ui/FormField";
import BooleanToggle from "../ui/BooleanToggle";
import MasterDocumentSelect from "../client/MasterDocumentSelect";
import { ChannelSelect, ClientSelect, ProductSelect } from "../client/CatalogSelects";
import {
  ClientProductChannelSelect,
  LanguageSelect,
  LanguageIdSelect,
  LlmModelSelect,
  ProviderSelect,
  SttModelSelect,
  TtsModelSelect,
} from "../client/AiCatalogSelects";
import { isNumericSelectType } from "../../lib/formFieldTypes";
import { UserSelect, DesignationSelect, BuLocationSelect } from "./RbacSelects";

const resolveFieldValue = (field, record) => {
  if (!record) return undefined;
  if (field.getValue) return field.getValue(record);
  return record[field.name];
};

const buildInitialValues = (fields, record, defaultClientId) => {
  const values = {};
  fields.forEach((field) => {
    const raw = resolveFieldValue(field, record);
    if (raw !== undefined && raw !== null) {
      if (field.type === "boolean") values[field.name] = Boolean(raw);
      else if (field.type === "file") values[field.name] = null;
      else values[field.name] = String(raw);
    } else if (!record && field.clientDefault && defaultClientId != null) {
      values[field.name] = String(defaultClientId);
    } else if (field.type === "boolean") {
      values[field.name] = field.defaultValue ?? false;
    } else if (field.type === "file") {
      values[field.name] = null;
    } else {
      values[field.name] = "";
    }
  });
  return values;
};

const ResourceForm = ({
  open,
  onClose,
  resource,
  record,
  defaultClientId,
  onSubmit,
}) => {
  const isEdit = Boolean(record);
  const { fields, singular, idKey, useMultipart, useFormUrlEncoded, createModalTitle, createModalDescription, createSubmitLabel, modalSize, formColumns = 2 } = resource;

  const formFields = useMemo(
    () =>
      fields.filter((f) => {
        if (isEdit && f.createOnly) return false;
        if (!isEdit && f.editOnly) return false;
        return true;
      }),
    [fields, isEdit],
  );

  const renderFields = useMemo(
    () => formFields.filter((field) => !field.hidden),
    [formFields],
  );

  const shouldUseMultipart = useMemo(
    () => Boolean(useMultipart) || formFields.some((field) => field.type === "file"),
    [useMultipart, formFields],
  );

  const [values, setValues] = useState(() =>
    buildInitialValues(fields, record, defaultClientId),
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const validate = () => {
    const nextErrors = {};
    formFields.forEach((field) => {
      const raw = values[field.name];

      if (field.type === "file") {
        if (field.required && !isEdit && !(raw instanceof File)) {
          nextErrors[field.name] = `${field.label} is required.`;
        }
        return;
      }

      if (field.type === "boolean") return;

      const normalized = typeof raw === "string" ? raw.trim() : raw;
      if (field.required && !normalized) {
        nextErrors[field.name] = `${field.label} is required.`;
        return;
      }
      if (
        (field.type === "number" || isNumericSelectType(field.type)) &&
        normalized &&
        Number.isNaN(Number(normalized))
      ) {
        nextErrors[field.name] = `${field.label} must be a number.`;
        return;
      }
      if (field.type === "phone" && normalized) {
        const maxDigits = field.maxLength ?? 10;
        if (normalized.length > maxDigits) {
          nextErrors[field.name] = `${field.label} must be at most ${maxDigits} digits.`;
        }
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildJsonPayload = () => {
    const payload = {};
    formFields.forEach((field) => {
      const raw = values[field.name];
      if (field.type === "file") return;
      if (field.type === "boolean") {
        payload[field.name] = Boolean(raw);
        return;
      }
      const trimmed = typeof raw === "string" ? raw.trim() : raw;
      if (trimmed === "" || trimmed === undefined) {
        if (!field.createOnly) payload[field.name] = null;
        return;
      }
      payload[field.name] =
        field.type === "number" || isNumericSelectType(field.type)
          ? Number(trimmed)
          : trimmed;
    });
    return payload;
  };

  const buildFormDataPayload = () => {
    const form = new FormData();
    formFields.forEach((field) => {
      const raw = values[field.name];

      if (field.type === "file") {
        if (raw instanceof File) {
          form.append(field.name, raw, raw.name);
        }
        return;
      }

      if (field.type === "boolean") {
        form.append(field.name, raw ? "true" : "false");
        return;
      }

      const trimmed = typeof raw === "string" ? raw.trim() : raw;
      if (trimmed !== "" && trimmed !== undefined && trimmed !== null) {
        form.append(
          field.name,
          field.type === "number" || isNumericSelectType(field.type)
            ? Number(trimmed)
            : trimmed,
        );
      }
    });
    return form;
  };

  const buildUrlEncodedPayload = () => {
    const params = new URLSearchParams();
    formFields.forEach((field) => {
      const raw = values[field.name];

      if (field.type === "file") return;

      if (field.type === "boolean") {
        params.append(field.name, raw ? "true" : "false");
        return;
      }

      const trimmed = typeof raw === "string" ? raw.trim() : raw;
      if (trimmed !== "" && trimmed !== undefined && trimmed !== null) {
        params.append(
          field.name,
          field.type === "number" || isNumericSelectType(field.type)
            ? String(Number(trimmed))
            : trimmed,
        );
      }
    });
    return params;
  };

  const buildPayload = () => {
    if (shouldUseMultipart) return buildFormDataPayload();
    if (useFormUrlEncoded) return buildUrlEncodedPayload();
    return buildJsonPayload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(buildPayload());
    } finally {
      setSubmitting(false);
    }
  };

  const fullWidthTypes = new Set([
    "password",
    "file",
    "textarea",
    "masterDocument",
    "clientProductChannel",
  ]);

  const gridClass =
    formColumns === 3
      ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      : "grid grid-cols-1 gap-4 sm:grid-cols-2";

  const colSpanClass = (field) => {
    if (field.colSpan != null) {
      if (field.colSpan === "full") {
        if (formColumns === 3) return "sm:col-span-2 lg:col-span-3";
        return "sm:col-span-2";
      }
      if (field.colSpan === 2 && formColumns === 3) return "lg:col-span-2";
      return "";
    }
    if (fullWidthTypes.has(field.type)) {
      if (formColumns === 3) return "sm:col-span-2 lg:col-span-3";
      return "sm:col-span-2";
    }
    return "";
  };

  const renderFieldInput = (field) => {
    const common = {
      id: field.name,
      value: values[field.name] ?? "",
      invalid: Boolean(errors[field.name]),
      onChange: (value) => setField(field.name, value),
    };

    switch (field.type) {
      case "buLocation":
        return (
          <BuLocationSelect
            {...common}
            clientId={
              values.client_id
                ? Number(values.client_id)
                : defaultClientId
            }
            placeholder={field.placeholder ?? "Select a location"}
          />
        );
      case "designation":
        return (
          <DesignationSelect
            {...common}
            clientId={
              values.client_id
                ? Number(values.client_id)
                : defaultClientId
            }
            placeholder={field.placeholder ?? "Select a designation"}
          />
        );
      case "user":
        return (
          <UserSelect
            {...common}
            clientId={
              values.client_id
                ? Number(values.client_id)
                : defaultClientId
            }
            excludeUserId={isEdit ? record?.[idKey] : undefined}
            placeholder={field.placeholder ?? "Select a user"}
          />
        );
      case "client":
        return <ClientSelect {...common} />;
      case "masterDocument":
        return <MasterDocumentSelect {...common} />;
      case "product":
        return <ProductSelect {...common} />;
      case "channel":
        return <ChannelSelect {...common} />;
      case "clientProductChannel":
        return (
          <ClientProductChannelSelect
            {...common}
            clientId={defaultClientId}
          />
        );
      case "language":
        return <LanguageSelect {...common} />;
      case "languageId":
        return <LanguageIdSelect {...common} />;
      case "provider":
        return (
          <ProviderSelect
            {...common}
            providerType={field.providerType}
          />
        );
      case "llmModel":
        return <LlmModelSelect {...common} />;
      case "sttModel":
        return <SttModelSelect {...common} />;
      case "ttsModel":
        return <TtsModelSelect {...common} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={submitting ? undefined : onClose}
      title={isEdit ? `Edit ${singular}` : (createModalTitle ?? `New ${singular}`)}
      description={
        isEdit
          ? `Update the details for this ${singular.toLowerCase()}.`
          : (createModalDescription ?? `Fill in the details to create a ${singular.toLowerCase()}.`)
      }
      size={modalSize ?? "md"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className={gridClass}>
          {renderFields.map((field) => (
            <div
              key={field.name}
              className={colSpanClass(field)}
            >
              <FormField
                label={field.label}
                htmlFor={field.name}
                required={field.required && !(isEdit && field.type === "file")}
                error={errors[field.name]}
                help={field.help}
              >
                {renderFieldInput(field) ?? (
                  field.type === "boolean" ? (
                  <BooleanToggle
                    value={Boolean(values[field.name])}
                    trueLabel={field.booleanLabels?.true ?? "Yes"}
                    falseLabel={field.booleanLabels?.false ?? "No"}
                    onChange={(next) => setField(field.name, next)}
                  />
                ) : field.type === "file" ? (
                  <Input
                    id={field.name}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                    invalid={Boolean(errors[field.name])}
                    onChange={(e) =>
                      setField(field.name, e.target.files?.[0] ?? null)
                    }
                  />
                ) : field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    rows={field.rows ?? 4}
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ""}
                    onChange={(e) => setField(field.name, e.target.value)}
                    className={[
                      "w-full rounded-xl border bg-canvas px-3.5 py-2.5 text-sm font-medium text-ink outline-none transition placeholder:text-zinc-900/45 dark:placeholder:text-neutral-500",
                      errors[field.name]
                        ? "border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
                        : "border-hairline focus:border-brand/40 focus:bg-surface focus:ring-2 focus:ring-brand/15",
                    ].join(" ")}
                  />
                ) : field.type === "phone" ? (
                  <Input
                    id={field.name}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={field.maxLength ?? 10}
                    autoComplete="off"
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ""}
                    invalid={Boolean(errors[field.name])}
                    onChange={(e) =>
                      setField(
                        field.name,
                        e.target.value.replace(/\D/g, "").slice(0, field.maxLength ?? 10),
                      )
                    }
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type === "number" ? "text" : field.type}
                    inputMode={field.type === "number" ? "numeric" : undefined}
                    autoComplete={
                      field.type === "password" ? "new-password" : "off"
                    }
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ""}
                    invalid={Boolean(errors[field.name])}
                    onChange={(e) => setField(field.name, e.target.value)}
                  />
                ))}
              </FormField>
            </div>
          ))}
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {isEdit ? "Save changes" : (createSubmitLabel ?? `Create ${singular}`)}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ResourceForm;
