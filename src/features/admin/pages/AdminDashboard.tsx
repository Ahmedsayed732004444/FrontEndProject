import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import {
  useGetAdminUsers,
  useGetRoles,
  useGetPermissions,
} from "@/features/admin/hooks/useAdmin";
import { StatsCards } from "@/features/admin/components/StatsCards";
import { UserManagement } from "@/features/admin/components/UserManagement";
import { RoleManagement } from "@/features/admin/components/RoleManagement";
import { UserDialog } from "@/features/admin/components/UserDialog";
import { RoleDialog } from "@/features/admin/components/RoleDialog";
import type { RoleListItem, AdminUserListItem } from "@/features/admin/types/admin";
import { Search, Bell } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = usePermissions();
  const [activeTab, setActiveTab] = useState("users");

  // Dialog States
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserListItem | null>(null);
  const [editingRole, setEditingRole] = useState<RoleListItem | null>(null);

  // Redirect non-admin users
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  // Data fetching
  const { data: users = [], isLoading: usersLoading } = useGetAdminUsers();
  const { data: roles = [], isLoading: rolesLoading } = useGetRoles();
  const { data: permissions = [] } = useGetPermissions();

  // Handlers
  const handleEditUser = (user: AdminUserListItem) => {
    setEditingUser(user);
    setIsUserDialogOpen(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsUserDialogOpen(true);
  };

  const handleEditRole = (role: RoleListItem) => {
    setEditingRole(role);
    setIsRoleDialogOpen(true);
  };

  const handleAddRole = () => {
    setEditingRole(null);
    setIsRoleDialogOpen(true);
  };

  if (usersLoading || rolesLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            border: "3px solid #e5e7eb",
            borderTopColor: "#2563eb",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const totalUsers = users.length;
  const totalRoles = roles.length;
  const activeRoles = roles.filter((role: RoleListItem) => !role.isDeleted).length;

  const tabs = [
    { key: "users", label: "User Management" },
    { key: "roles", label: "Role Management" },
  ];

  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-8 pb-12 font-sans">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        {/* Left: Title + description */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight m-0">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage users, roles, and system configurations securely.
          </p>
        </div>

        {/* Right: Search + Bell + Avatar */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Global search */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-full sm:w-48 pl-9 pr-4 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Notification bell */}
          <div className="relative">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
          </div>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white text-sm font-bold cursor-pointer shrink-0">
            A
          </div>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <StatsCards
        totalUsers={totalUsers}
        totalRoles={totalRoles}
        activeRoles={activeRoles}
      />

      {/* ── Tabs ── */}
      <div className="mb-5 overflow-x-auto scrollbar-hide">
        <div className="flex border-b border-slate-200 min-w-max">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-1 py-2.5 mr-6 text-sm font-medium transition-all relative
                  ${isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "users" && (
        <UserManagement
          users={users}
          onEditUser={handleEditUser}
          onAddUser={handleAddUser}
        />
      )}

      {activeTab === "roles" && (
        <RoleManagement
          roles={roles}
          onEditRole={handleEditRole}
          onAddRole={handleAddRole}
        />
      )}

      {/* Dialogs */}
      <UserDialog
        isOpen={isUserDialogOpen}
        onClose={() => setIsUserDialogOpen(false)}
        editingUser={editingUser}
        roles={roles}
      />

      <RoleDialog
        isOpen={isRoleDialogOpen}
        onClose={() => setIsRoleDialogOpen(false)}
        editingRole={editingRole}
        permissions={permissions}
      />
    </div>
  );
};

export default AdminDashboard;
