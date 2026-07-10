import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Plus, Search } from "lucide-react";
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
import ResourceForm from "../rbac/ResourceForm";

const resource = clientResources.clients;

const ClientsListManager = ({ navigateOnCreate = true }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { search = "" } = useOutletContext() ?? {};
  const { selectClient } = useClientContext();

  const {
    records,
    loading,
    syncing,
    page,
    pagination,
    setPage,
    create,
    update,
    remove,
  } = useResourceManager(resource, null, { search });

  const isSearching = search.trim().length > 0;

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

  const tableLoading = loading || syncing;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={resource.icon}
        title={resource.title}
        actions={
          <Button icon={Plus} onClick={openCreate}>
            New Client
          </Button>
        }
      />

      {records.length === 0 && !tableLoading ? (
        <EmptyState
          icon={isSearching ? Search : resource.icon}
          title={isSearching ? "No records match" : "No clients yet"}
          description={
            isSearching
              ? "Try a different search term."
              : "Create your first client to get started."
          }
          action={
            isSearching ? undefined : (
              <Button icon={Plus} onClick={openCreate}>
                New Client
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
          onRowClick={openClientWorkspace}
          clickableColumnKey="name"
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
