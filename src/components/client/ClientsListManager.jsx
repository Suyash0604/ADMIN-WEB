import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Info } from "lucide-react";
import { useResourceManager } from "../../hooks/useResourceManager";
import { useToast } from "../../context/ToastContext";
import { useClientContext } from "../../context/ClientContext";
import { clientResources } from "../../config/clientResources";
import { ROUTES } from "../../lib/constants";
import PageHeader from "../ui/PageHeader";
import Button from "../ui/Button";
import DataTable from "../ui/DataTable";
import EmptyState from "../ui/EmptyState";
import ConfirmDialog from "../ui/ConfirmDialog";
import Spinner from "../ui/Spinner";
import ResourceForm from "../rbac/ResourceForm";

const resource = clientResources.clients;

const ClientsListManager = ({ navigateOnCreate = true }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { selectClient } = useClientContext();

  const {
    records,
    loading,
    syncing,
    create,
    update,
    remove,
  } = useResourceManager(resource, null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    setFormOpen(true);
  };

  const openClientWorkspace = (client) => {
    selectClient(client);
    navigate(ROUTES.client.legalDocuments);
  };

  const handleSubmit = async (payload) => {
    try {
      if (editing) {
        await update(editing[resource.idKey], payload);
        toast.success(`${resource.singular} updated.`);
        setFormOpen(false);
        setEditing(null);
      } else {
        const record = await create(payload);
        toast.success(`${resource.singular} created.`);
        setFormOpen(false);
        setEditing(null);
        if (navigateOnCreate) {
          openClientWorkspace(record);
        }
      }
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <Spinner size={24} />
        <p className="text-sm font-semibold text-zinc-900/70 dark:text-neutral-400">
          Loading clients…
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={resource.icon}
        title={resource.title}
        description="Create a client, then click it to manage legal documents, product channels, and calling config."
        actions={
          <Button icon={Plus} onClick={openCreate}>
            New Client
          </Button>
        }
      />

      {records.length === 0 ? (
        <EmptyState
          icon={resource.icon}
          title="No clients yet"
          description="Create your first client to get started."
          action={
            <Button icon={Plus} onClick={openCreate}>
              New Client
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={resource.columns}
          rows={records}
          idKey={resource.idKey}
          loading={syncing}
          onRowClick={openClientWorkspace}
          clickableColumnKey="name"
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

export default ClientsListManager;
