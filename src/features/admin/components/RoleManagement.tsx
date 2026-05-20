import React from "react";
import { Edit, Eye, EyeOff, Plus, Search } from "lucide-react";
import type { RoleListItem } from "@/features/admin/types/admin";
import { useToggleRoleStatus } from "@/features/admin/hooks/useAdmin";
import { inlineStyles } from "@/lib/styleConstants";

interface RoleManagementProps {
  roles: RoleListItem[];
  onEditRole: (role: RoleListItem) => void;
  onAddRole: () => void;
}

const PAGE_SIZE = 10;

export const RoleManagement: React.FC<RoleManagementProps> = ({
  roles,
  onEditRole,
  onAddRole,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const toggleRoleStatus = useToggleRoleStatus();

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEntries = filteredRoles.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const paginatedRoles = filteredRoles.slice(startIndex, startIndex + PAGE_SIZE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    for (let i = 1; i <= Math.min(totalPages, 3); i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <div style={inlineStyles.searchWrapper}>
          <Search style={inlineStyles.searchIcon} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={inlineStyles.searchInput}
          />
        </div>

        {/* Add Role button */}
        <button
          onClick={onAddRole}
          style={inlineStyles.addButton}
          aria-label="Add new role"
        >
          <Plus style={{ width: "14px", height: "14px" }} aria-hidden="true" />
          Add Role
        </button>
      </div>

      {/* Table card */}
      <div style={inlineStyles.tableContainer}>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13.5px",
            }}
          >
            <thead>
              <tr style={inlineStyles.tableHeaderRow}>
                {["ROLE NAME", "STATUS", "ACTIONS"].map((col) => (
                  <th
                    key={col}
                    style={col === "ACTIONS" ? inlineStyles.tableHeaderCellRight : inlineStyles.tableHeaderCell}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRoles.length === 0 ? (
                <tr>
                  <td colSpan={3} style={inlineStyles.tableEmptyCell}>
                    No roles found.
                  </td>
                </tr>
              ) : (
                paginatedRoles.map((role) => (
                  <tr
                    key={role.id}
                    className="interactive-row"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onEditRole(role);
                      }
                    }}
                  >
                    {/* Role Name */}
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 500,
                        color: "var(--foreground)",
                      }}
                    >
                      {role.name}
                    </td>

                    {/* Status */}
                    <td style={inlineStyles.tableCell}>
                      {role.isDeleted ? (
                        <span className="badge-error" role="status">
                          <span className="status-dot status-dot-error" aria-hidden="true" />
                          Inactive
                        </span>
                      ) : (
                        <span className="badge-success" role="status">
                          <span className="status-dot status-dot-success" aria-hidden="true" />
                          Active
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: "2px",
                        }}
                      >
                        {/* Edit */}
                        <button
                          onClick={() => onEditRole(role)}
                          title="Edit role"
                          aria-label="Edit role"
                          className="icon-btn icon-btn-primary"
                        >
                          <Edit style={{ width: "14px", height: "14px" }} aria-hidden="true" />
                        </button>

                        {/* Toggle Status */}
                        <button
                          onClick={() => toggleRoleStatus.mutate(role.id)}
                          title={role.isDeleted ? "Activate Role" : "Deactivate Role"}
                          aria-label={role.isDeleted ? "Activate role" : "Deactivate role"}
                          className={`icon-btn ${role.isDeleted ? "icon-btn-success" : "icon-btn-warning"}`}
                        >
                          {role.isDeleted ? (
                            <Eye style={{ width: "14px", height: "14px" }} aria-hidden="true" />
                          ) : (
                            <EyeOff style={{ width: "14px", height: "14px" }} aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div style={inlineStyles.paginationBar}>
          <span style={inlineStyles.paginationText}>
            {totalEntries === 0
              ? "No entries"
              : `Showing ${startIndex + 1} to ${Math.min(
                  startIndex + PAGE_SIZE,
                  totalEntries
                )} of ${totalEntries.toLocaleString()} entries`}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              style={safeCurrentPage === 1 ? inlineStyles.paginationBtnDisabled : inlineStyles.paginationBtn}
              aria-label="Previous page"
            >
              Prev
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={page === safeCurrentPage ? inlineStyles.paginationBtnActive : inlineStyles.paginationBtn}
                aria-label={`Go to page ${page}`}
                aria-current={page === safeCurrentPage ? "page" : undefined}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
              style={safeCurrentPage === totalPages ? inlineStyles.paginationBtnDisabled : inlineStyles.paginationBtn}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
