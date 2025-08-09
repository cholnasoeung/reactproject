import { useState } from "react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, useForm } from "@inertiajs/react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"
import { Badge } from "@/Components/ui/badge"
import { Shield, Users } from "lucide-react"
import CreateRoleModal from "@/Pages/Roles/Create"
import EditRoleModal from "@/Pages/Roles/Edit"
import DeleteModal from "@/Components/DeleteModal"
import ActionButtons from "@/Components/ActionButton"

export default function Index({ roles, permissions }) {
  const [editingRole, setEditingRole] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deletingRole, setDeletingRole] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  
  const { delete: destroy, processing: deleting } = useForm()

  const handleRoleCreated = () => {
    window.location.reload()
  }

  const handleRoleUpdated = () => {
    window.location.reload()
  }

  const handleRoleDeleted = () => {
    window.location.reload()
  }

  const openEditModal = (role) => {
    setEditingRole(role)
    setEditModalOpen(true)
  }

  const openDeleteModal = (role) => {
    setDeletingRole(role)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!deletingRole) return
    
    destroy(route('roles.destroy', deletingRole.id), {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteModalOpen(false)
        setDeletingRole(null)
        handleRoleDeleted()
      },
      onError: (errors) => {
        console.log('Delete errors:', errors)
      }
    })
  }

  const getRoleActions = (role) => [
    {
      key: 'view',
      label: 'View',
      href: route('roles.show', role.id),
      variant: 'outline'
    },
    {
      key: 'edit',
      label: 'Edit',
      onClick: (role) => {
        openEditModal(role)
      },
      variant: 'outline'
    },
    {
      key: 'delete',
      label: 'Delete',
      onClick: (role) => {
        openDeleteModal(role)
      },
      variant: 'outline',
      className: 'text-red-600 hover:text-red-700',
      // disabled: role.name === 'super-admin'
    }
  ]

  return (
    <AuthenticatedLayout roles={roles}>
      <Head title="Roles" />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Roles
            </CardTitle>
            <CardDescription>Manage user roles and permissions</CardDescription>
          </div>
          <CreateRoleModal
            permissions={permissions}
            onRoleCreated={handleRoleCreated}
          />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length ? (
                  roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          {role.display_name || role.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions && role.permissions.length > 0 ? (
                            role.permissions.slice(0, 3).map((permission) => (
                              <Badge key={permission.id} variant="secondary" className="text-xs">
                                {permission.name}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              No permissions
                            </Badge>
                          )}
                          {role.permissions && role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {role.users_count || 0} users
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ActionButtons
                         actions={getRoleActions(role)}
                          item={role}
                          layout="dropdown"
                          maxInline={1}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No roles found. Create your first role to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Edit Role Modal */}
      {editingRole && (
        <EditRoleModal
          role={editingRole}
          permissions={permissions}
          open={editModalOpen}
          setOpen={setEditModalOpen}
          onRoleUpdated={handleRoleUpdated}
        />
      )}
      
      {/* Delete Role Modal */}
      <DeleteModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Role"
        description="Are you sure you want to delete this role? This action cannot be undone and will remove all associated permissions."
        itemName={deletingRole?.display_name || deletingRole?.name}
        confirmText="Delete Role"
        processing={deleting}
      />
    </AuthenticatedLayout>
  )
}