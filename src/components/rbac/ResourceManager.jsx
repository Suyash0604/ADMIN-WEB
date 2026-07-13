import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, Search, Info } from "lucide-react";
import { useResourceManager } from "../../hooks/useResourceManager";
import { useToast } from "../../context/ToastContext";
import { useClientContext } from "../../context/ClientContext";
import {
  CLIENT_SCOPED_ENTITIES,
  RBAC_ENTITIES,
} from "../../lib/accessControl";
import SelectedClientBanner from "../client/SelectedClientBanner";
import SelectClientPrompt from "../client/SelectClientPrompt";
import ClientWorkspaceNav from "../client/ClientWorkspaceNav";
import { ClientSelect } from "../client/CatalogSelects";
import PageHeader from "../ui/PageHeader";
import Button from "../ui/Button";
import Input from "../ui/Input";
import DataTable from "../ui/DataTable";
import EmptyState from "../ui/EmptyState";
import ConfirmDialog from "../ui/ConfirmDialog";
import ResourceForm from "./ResourceForm";

const ResourceManager = ({ resource }) => {
  const toast = useToast();
  const { search = "" } = useOutletContext() ?? {};
  const {
    activeClientId,
    selectedClient,
    rbacClientId,
    setRbacClientId,
  } = useClientContext();

  const isClientScoped = CLIENT_SCOPED_ENTITIES.includes(resource.key);
  const isRbacPage = RBAC_ENTITIES.includes(resource.key);

  // Workspace pages → selected client. RBAC pages → RBAC client dropdown.
  const clientId = isClientScoped ? activeClientId : isRbacPage ? rbacClientId : null;

  const needsClientSelection =
    isClientScoped && resource.key !== "clients" && !activeClientId;

  const {
    records,
    loading,
    syncing,
    page,
    pagination,
    setPage,
    missingClientId,
    create,
    update,
    remove,
    fetchById,
  } = useResourceManager(resource, clientId, { search });

  const isSearching = search.trim().length > 0;

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [lookupId, setLookupId] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    try {
      if (editing) {
        await update(editing[resource.idKey], payload);
        toast.success(`${resource.singular} updated.`);
      } else {
        await create(payload);
        toast.success(resource.createSuccessMessage ?? `${resource.singular} created.`);
      }
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    const id = deleting[resource.idKey];
    setRemovingId(id);
    try {
      await remove(id);
      toast.success(`${resource.singular} deleted.`);
      setDeleting(null);
    } catch (err) {
      toast.error(err.message || "Unable to delete.");
    } finally {
      setRemovingId(null);
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    const id = lookupId.trim();
    if (!id || lookupLoading) return;
    setLookupLoading(true);
    try {
      await fetchById(id);
      toast.success(`${resource.singular} #${id} loaded.`);
      setLookupId("");
    } catch (err) {
      toast.error(err.message || `${resource.singular} #${id} not found.`);
    } finally {
      setLookupLoading(false);
    }
  };

  if (needsClientSelection) {
    return <SelectClientPrompt />;
  }

  const tableLoading = loading || syncing;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={resource.icon}
        title={resource.title}
        actions={
          <Button icon={Plus} onClick={openCreate}>
            {resource.createAction ?? `New ${resource.singular}`}
          </Button>
        }
      />

      {isRbacPage && (
        <div className="flex flex-col gap-2 rounded-2xl border border-hairline bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-ink">Client</p>
            <p className="text-xs font-medium text-zinc-900/60 dark:text-neutral-500">
              Records are loaded for the selected client.
            </p>
          </div>
          <div className="w-full sm:max-w-xs">
            <ClientSelect
              id={`${resource.key}-rbac-client`}
              value={rbacClientId != null ? String(rbacClientId) : ""}
              onChange={setRbacClientId}
              placeholder="Select a client"
            />
          </div>
        </div>
      )}

      {selectedClient && isClientScoped && (
        <>
          <SelectedClientBanner client={selectedClient} />
          <ClientWorkspaceNav />
        </>
      )}

      {missingClientId && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-xs font-medium text-zinc-900/80 dark:text-neutral-300">
          <Info
            size={15}
            strokeWidth={2.3}
            className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
          />
          <span>
            {isRbacPage
              ? "Select a client above to load records."
              : "Your session has no client ID, so records cannot be loaded. Sign in again or contact an administrator."}
          </span>
        </div>
      )}

      {!resource.hasList && (
        <>
          <div className="flex flex-col gap-3 rounded-2xl border border-hairline bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
            <form onSubmit={handleLookup} className="flex w-full max-w-md gap-2">
              <div className="relative flex-1">
                <Search
                  size={16}
                  strokeWidth={2.3}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-900/50 dark:text-neutral-500"
                />
                <Input
                  className="pl-10"
                  inputMode="numeric"
                  placeholder={`Look up by ${resource.idLabel}`}
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                />
              </div>
              <Button type="submit" variant="secondary" loading={lookupLoading}>
                Fetch
              </Button>
            </form>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-xs font-medium text-zinc-900/80 dark:text-neutral-300">
            <Info
              size={15}
              strokeWidth={2.3}
              className="mt-0.5 shrink-0 text-brand"
            />
            <span>
              The RBAC service has no list endpoint, so this table shows records
              created or looked up in this session. Use “Fetch” to pull any record
              by its {resource.idLabel.toLowerCase()}, and “Sync” to refresh from
              the server.
            </span>
          </div>
        </>
      )}

      {resource.hasList ? (
        records.length === 0 && !tableLoading ? (
          <EmptyState
            icon={isSearching ? Search : resource.icon}
            title={isSearching ? "No records match" : `No ${resource.title.toLowerCase()} yet`}
            description={
              isSearching
                ? "Try a different search term."
                : `Create a new ${resource.singular.toLowerCase()} to get started.`
            }
            action={
              isSearching ? undefined : (
                <Button icon={Plus} onClick={openCreate}>
                  {resource.createAction ?? `New ${resource.singular}`}
                </Button>
              )
            }
          />
        ) : (
          <DataTable
            columns={resource.columns}
            rows={records}
            idKey={resource.idKey}
            loading={tableLoading}
            onEdit={openEdit}
            onDelete={(row) => setDeleting(row)}
            pagination={{
              page,
              pageSize: pagination.pageSize,
              total: pagination.total,
              totalPages: pagination.totalPages,
              onPageChange: setPage,
              loading: tableLoading,
            }}
          />
        )
      ) : records.length === 0 ? (
        <EmptyState
          icon={isSearching ? Search : resource.icon}
          title={isSearching ? "No records match" : `No ${resource.title.toLowerCase()} yet`}
          description={
            isSearching
              ? "Try a different search term."
              : `Create a new ${resource.singular.toLowerCase()} or fetch an existing one by its ${resource.idLabel.toLowerCase()} to get started.`
          }
          action={
            isSearching ? undefined : (
              <Button icon={Plus} onClick={openCreate}>
                {resource.createAction ?? `New ${resource.singular}`}
              </Button>
            )
          }
        />
      ) : (
        <DataTable
          columns={resource.columns}
          rows={records}
          idKey={resource.idKey}
          loading={tableLoading}
          onEdit={openEdit}
          onDelete={(row) => setDeleting(row)}
        />
      )}

      {formOpen && (
        <ResourceForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          resource={resource}
          record={editing}
          defaultClientId={clientId}
          onSubmit={handleSubmit}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={removingId != null}
        title={`Delete ${resource.singular.toLowerCase()}?`}
        message={
          deleting
            ? `${resource.idLabel} #${deleting[resource.idKey]} will be permanently deleted.`
            : ""
        }
        confirmLabel="Delete"
      />
    </div>
  );
};

export default ResourceManager;
