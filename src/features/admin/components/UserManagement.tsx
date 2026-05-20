import React from "react";
import { Edit, Eye, EyeOff, Unlock, Search, Filter, UserPlus } from "lucide-react";
import type { AdminUserListItem } from "@/features/admin/types/admin";
import { useToggleUserStatus, useUnlockUser } from "@/features/admin/hooks/useAdmin";
import { inlineStyles } from "@/lib/styleConstants";

interface UserManagementProps {
  users: AdminUserListItem[];
  onEditUser: (user: AdminUserListItem) => void;
  onAddUser: () => void;
}

// INTENTIONAL: Categorical hex colors for visual user distinction.
// These are not dark-mode targets. See migration report exceptions.
const getAvatarInfo = (firstName: string, lastName: string) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const colors = [
    { bg: "#dbeafe", text: "#1d4ed8" },
    { bg: "#dcfce7", text: "#15803d" },
    { bg: "#fce7f3", text: "#be185d" },
    { bg: "#fef3c7", text: "#b45309" },
    { bg: "#ede9fe", text: "#7c3aed" },
    { bg: "#fee2e2", text: "#dc2626" },
    { bg: "#cffafe", text: "#0e7490" },
  ];
  const index =
    (firstName.charCodeAt(0) + lastName.charCodeAt(0)) % colors.length;
  return { initials, ...colors[index] };
};

const StatusBadge: React.FC<{ isDisabled: boolean; isLocked?: boolean }> = ({
  isDisabled,
  isLocked,
}) => {
  if (isLocked) {
    return (
      <span className="badge-warning" role="status">
        <span className="status-dot status-dot-warning" aria-hidden="true" />
        Locked
      </span>
    );
  }
  if (isDisabled) {
    return (
      <span className="badge-error" role="status">
        <span className="status-dot status-dot-error" aria-hidden="true" />
        Disabled
      </span>
    );
  }
  return (
    <span className="badge-success" role="status">
      <span className="status-dot status-dot-success" aria-hidden="true" />
      Active
    </span>
  );
};

const RoleBadge: React.FC<{ role: string }> = ({ role }) => (
  <span className="badge-neutral">{role}</span>
);

const PAGE_SIZE = 10;

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onEditUser,
  onAddUser,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const toggleUserStatus = useToggleUserStatus();
  const unlockUser = useUnlockUser();

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEntries = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);

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

  // Heuristic: if a user is disabled and has no roles — treat as locked
  const isLockedUser = (user: AdminUserListItem) =>
    user.isDisabled && user.roles.length === 0;

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
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={inlineStyles.searchInput}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {/* Filter button */}
          <button style={inlineStyles.filterButton}>
            <Filter style={{ width: "14px", height: "14px" }} aria-hidden="true" />
            Filter
          </button>

          {/* Add User button */}
          <button onClick={onAddUser} style={inlineStyles.addButton} aria-label="Add new user">
            <UserPlus style={{ width: "14px", height: "14px" }} aria-hidden="true" />
            Add User
          </button>
        </div>
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
                {[
                  "NAME",
                  "EMAIL",
                  "ROLES",
                  "STATUS",
                  "LAST ACTIVE",
                  "ACTIONS",
                ].map((col) => (
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
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={inlineStyles.tableEmptyCell}>
                    No users found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, idx) => {
                  const avatar = getAvatarInfo(user.firstName, user.lastName);
                  const locked = isLockedUser(user);
                  const lastActiveLabels = [
                    "2 hours ago",
                    "Yesterday",
                    "3 days ago",
                    "1 week ago",
                    "Just now",
                  ];
                  const lastActive =
                    lastActiveLabels[idx % lastActiveLabels.length];

                  return (
                    <tr
                      key={user.id}
                      className="interactive-row"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onEditUser(user);
                        }
                      }}
                    >
                      {/* Name + Avatar */}
                      <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              background: avatar.bg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: 700,
                              color: avatar.text,
                              flexShrink: 0,
                              border: "1.5px solid rgba(0,0,0,0.06)",
                            }}
                          >
                            {avatar.initials}
                          </div>
                          <span style={{ fontWeight: 500, color: "var(--foreground)" }}>
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={inlineStyles.tableCellMuted}>
                        {user.email}
                      </td>

                      {/* Roles */}
                      <td style={inlineStyles.tableCell}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <RoleBadge key={role} role={role} />
                            ))
                          ) : (
                            <span style={{ color: "var(--border-strong)", fontSize: "12px" }}>
                              —
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={inlineStyles.tableCell}>
                        <StatusBadge
                          isDisabled={user.isDisabled}
                          isLocked={locked}
                        />
                      </td>

                      {/* Last Active */}
                      <td style={inlineStyles.tableCellMuted}>
                        {lastActive}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                          {/* Edit */}
                          <button
                            onClick={() => onEditUser(user)}
                            title="Edit user"
                            aria-label="Edit user"
                            className="icon-btn icon-btn-primary"
                          >
                            <Edit style={{ width: "14px", height: "14px" }} aria-hidden="true" />
                          </button>

                          {/* Toggle Status */}
                          <button
                            onClick={() => toggleUserStatus.mutate(user.id)}
                            title={user.isDisabled ? "Enable User" : "Disable User"}
                            aria-label={user.isDisabled ? "Enable user" : "Disable user"}
                            className={`icon-btn ${user.isDisabled ? "icon-btn-success" : "icon-btn-warning"}`}
                          >
                            {user.isDisabled ? (
                              <Eye style={{ width: "14px", height: "14px" }} aria-hidden="true" />
                            ) : (
                              <EyeOff style={{ width: "14px", height: "14px" }} aria-hidden="true" />
                            )}
                          </button>

                          {/* Unlock (only when disabled) */}
                          {user.isDisabled && (
                            <button
                              onClick={() => unlockUser.mutate(user.id)}
                              title="Unlock User"
                              aria-label="Unlock user"
                              className="icon-btn icon-btn-purple"
                            >
                              <Unlock style={{ width: "14px", height: "14px" }} aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
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
            {/* Prev */}
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

            {/* Next */}
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
