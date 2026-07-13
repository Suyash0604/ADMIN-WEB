import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { masterDocumentsApi } from "../../api/clientPlatform";
import { toListRows } from "../../lib/apiResponse";
import Select from "../ui/Select";
import Spinner from "../ui/Spinner";

const MasterDocumentSelect = ({ id, value, onChange, invalid = false }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    masterDocumentsApi
      .list({}, { signal: controller.signal })
      .then((data) => setDocuments(toListRows(data)))
      .catch((err) => {
        if (err?.code === "ERR_CANCELED") return;
        setError(err.message || "Unable to load document types.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const { mandatory, optional } = useMemo(() => {
    const mandatoryDocs = documents
      .filter((doc) => doc.mandatory)
      .sort((a, b) => a.document_name.localeCompare(b.document_name));
    const optionalDocs = documents
      .filter((doc) => !doc.mandatory)
      .sort((a, b) => a.document_name.localeCompare(b.document_name));
    return { mandatory: mandatoryDocs, optional: optionalDocs };
  }, [documents]);

  if (loading) {
    return (
      <div className="flex h-11 items-center gap-2 rounded-xl border border-hairline bg-canvas px-3.5 text-sm font-medium text-zinc-900/70 dark:text-neutral-400">
        <Spinner size={16} />
        Loading document types…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-2.5 text-xs font-medium text-red-600 dark:text-red-400">
        <AlertCircle size={14} strokeWidth={2.3} />
        {error}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-hairline bg-canvas px-3.5 py-2.5 text-xs font-medium text-zinc-900/70 dark:text-neutral-400">
        No master documents available. Ask an admin to create document types first.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Select
        id={id}
        value={value ?? ""}
        invalid={invalid}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          Select a document type
        </option>
        {mandatory.length > 0 && (
          <optgroup label="Required documents">
            {mandatory.map((doc) => (
              <option key={doc.id} value={String(doc.id)}>
                {doc.document_name} · Required
              </option>
            ))}
          </optgroup>
        )}
        {optional.length > 0 && (
          <optgroup label="Optional documents">
            {optional.map((doc) => (
              <option key={doc.id} value={String(doc.id)}>
                {doc.document_name} · Optional
              </option>
            ))}
          </optgroup>
        )}
      </Select>

      <div className="flex flex-wrap gap-3 text-[10px] font-semibold">
        <span className="inline-flex items-center gap-1.5 text-zinc-900/70 dark:text-neutral-400">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Required documents
        </span>
        <span className="inline-flex items-center gap-1.5 text-zinc-900/70 dark:text-neutral-400">
          <span className="h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
          Optional documents
        </span>
      </div>
    </div>
  );
};

export default MasterDocumentSelect;
