import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  createRoleSchema,
  updateRoleSchema,
  type CreateRoleFormData,
  type UpdateRoleFormData,
} from "@/features/admin/schemas/adminSchemas";
import { useCreateRole, useUpdateRole, useGetRoleById } from "@/features/admin/hooks/useAdmin";
import type { RoleListItem } from "@/features/admin/types/admin";

interface RoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingRole: RoleListItem | null;
  permissions: string[];
}

export const RoleDialog: React.FC<RoleDialogProps> = ({
  isOpen,
  onClose,
  editingRole,
  permissions,
}) => {
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  
  // Only fetch details if editing
  const { data: roleDetails, isLoading: detailsLoading } = useGetRoleById(editingRole?.id || "");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateRoleFormData | UpdateRoleFormData>({
    resolver: zodResolver(editingRole ? updateRoleSchema : createRoleSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  useEffect(() => {
    if (editingRole && roleDetails) {
      reset({
        name: roleDetails.name,
        permissions: roleDetails.permissions,
      });
    } else if (!editingRole) {
      reset({
        name: "",
        permissions: [],
      });
    }
  }, [editingRole, roleDetails, reset, isOpen]);

  const onSubmit = (data: CreateRoleFormData | UpdateRoleFormData) => {
    if (editingRole) {
      updateRole.mutate(
        { id: editingRole.id, data },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createRole.mutate(data as CreateRoleFormData, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const selectedPermissions = watch("permissions") || [];

  // Group permissions for better UI
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, string[]> = {
      "Users": permissions.filter(p => p.startsWith("users:")),
      "Roles": permissions.filter(p => p.startsWith("roles:")),
      "Profile": permissions.filter(p => p.startsWith("profile:")),
      "Jobs": permissions.filter(p => p.startsWith("jobs:")),
      "Membership": permissions.filter(p => p.startsWith("membership")),
    };
    
    // Add any others
    const categorized = Object.values(groups).flat();
    const other = permissions.filter(p => !categorized.includes(p));
    if (other.length > 0) groups["Other"] = other;
    
    return groups;
  }, [permissions]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{editingRole ? `Edit Role: ${editingRole.name}` : "Create New Role"}</DialogTitle>
        </DialogHeader>
        
        {editingRole && detailsLoading ? (
          <div className="py-20 text-center">Loading role details...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4 overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                placeholder="e.g. Editor, Moderator"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">Permissions</Label>
                <span className="text-xs text-muted-foreground">
                  {selectedPermissions.length} selected
                </span>
              </div>
              
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([group, groupPermissions]) => (
                  groupPermissions.length > 0 && (
                    <div key={group} className="space-y-3">
                      <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        {group}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {groupPermissions.map((permission) => (
                          <div
                            key={permission}
                            className={`flex items-center space-x-3 p-2 rounded-md border transition-colors ${
                              selectedPermissions.includes(permission)
                                ? "bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30"
                                : "bg-card border-border hover:bg-muted/50"
                            }`}
                          >
                            <Checkbox
                              id={`perm-${permission}`}
                              checked={selectedPermissions.includes(permission)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setValue("permissions", [...selectedPermissions, permission]);
                                } else {
                                  setValue("permissions", selectedPermissions.filter((p) => p !== permission));
                                }
                              }}
                            />
                            <Label
                              htmlFor={`perm-${permission}`}
                              className="text-sm font-medium cursor-pointer flex-1"
                            >
                              {permission.replace(/:/g, " ")}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
              {errors.permissions && (
                <p className="text-xs text-red-500 font-medium">{errors.permissions.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4 sticky bottom-0 bg-background py-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createRole.isPending || updateRole.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {createRole.isPending || updateRole.isPending
                  ? "Saving..."
                  : editingRole
                  ? "Update Role"
                  : "Create Role"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
