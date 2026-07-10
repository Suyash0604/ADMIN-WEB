const formatSearchValue = (value, type) => {
  if (value === null || value === undefined || value === "") return "";
  if (type === "date") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  }
  if (type === "boolean") return value ? "yes" : "no";
  if (type === "status") return value ? "deleted" : "active";
  return String(value);
};

const cellText = (row, col) => {
  const value = col.accessor ? col.accessor(row) : row[col.key];
  return formatSearchValue(value, col.type).toLowerCase();
};

export const filterRecordsBySearch = (records, columns = [], query = "") => {
  const q = query.trim().toLowerCase();
  if (!q) return records;

  return records.filter((row) =>
    columns.some((col) => cellText(row, col).includes(q)),
  );
};
