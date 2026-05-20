import React, { useEffect } from "react";
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
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from "@/features/admin/schemas/adminSchemas";
import { useCreateAdminUser, useUpdateAdminUser } from "@/features/admin/hooks/useAdmin";
import type { AdminUserListItem, RoleListItem } from "@/features/admin/types/admin";

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser: AdminUserListItem | null;
  roles: RoleListItem[];
}

export const UserDialog: React.FC<UserDialogProps> = ({
  isOpen,
  onClose,
  editingUser,
  roles,
}) => {
  const createUser = useCreateAdminUser();
  const updateUser = useUpdateAdminUser();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(editingUser ? updateUserSchema : createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      roles: [],
    },
  });

  useEffect(() => {
    if (editingUser) {
      reset({
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        password: "",
        roles: editingUser.roles,
      });
    } else {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        roles: [],
      });
    }
  }, [editingUser, reset, isOpen]);

  const onSubmit = (data: CreateUserFormData | UpdateUserFormData) => {
    if (editingUser) {
      updateUser.mutate(
        { id: editingUser.id, data: data as UpdateUserFormData },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createUser.mutate(data as CreateUserFormData, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const selectedRoles = watch("roles") || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                {...register("firstName")}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 font-medium">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register("lastName")}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 font-medium">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password {editingUser && <span className="text-muted-foreground font-normal">(leave blank to keep current)</span>}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Assign Roles</Label>
            <div className="grid grid-cols-2 gap-3 p-3 border rounded-lg bg-muted/30">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={selectedRoles.includes(role.name)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setValue("roles", [...selectedRoles, role.name]);
                      } else {
                        setValue("roles", selectedRoles.filter((r) => r !== role.name));
                      }
                    }}
                  />
                  <Label
                    htmlFor={`role-${role.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {role.name}
                  </Label>
                </div>
              ))}
            </div>
            {errors.roles && (
              <p className="text-xs text-red-500 font-medium">{errors.roles.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createUser.isPending || updateUser.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {createUser.isPending || updateUser.isPending
                ? "Saving..."
                : editingUser
                ? "Update User"
                : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
