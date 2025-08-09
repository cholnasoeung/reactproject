import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head } from "@inertiajs/react"
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
import { Shield } from "lucide-react"
import CreatePermissionModal from "@/Pages/Permissions/Create"
import EditPermissionModal from "@/Pages/Permissions/Edit"
import DeleteModal from "@/Components/DeleteModal"
import ActionButtons from "@/Components/ActionButton"
import { useState } from "react"
import { useForm } from "@inertiajs/react"

export default function Index({ auth, permissions }) {
  const [editingPermission, setEditingPermission] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deletingPermission, setDeletingPermission] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  
  const { delete: destroy, processing: deleting } = useForm()

  const handlePermissionCreated = () => {
    window.location.reload()
  }
  const handlePermissionUpdated = () => {
    window.location.reload()
  }
  const handlePermissionDeleted = () => {
    window.location.reload()
  }
  const openEditModal = (permission) => {
    setEditingPermission(permission)
    setEditModalOpen(true)
  }
  const openDeleteModal = (permission) => {
    setDeletingPermission(permission)
    setDeleteModalOpen(true)
  }
  const handleDeleteConfirm = () => {
    if (!deletingPermission) return
    
    destroy(route('permissions.destroy', deletingPermission.id), {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteModalOpen(false)
        setDeletingPermission(null)
        handlePermissionDeleted()
      },
      onError: (errors) => {
        console.log('Delete errors:', errors)
      }
    })
  }

  const getPermissionActions = (permission) => [
    {
      key: 'edit',
      label: 'Edit',
      onClick: (permission) => {
        openEditModal(permission)
      },
      variant: 'outline'
    },
    {
      key: 'delete',
      label: 'Delete',
      onClick: (permission) => {
        openDeleteModal(permission)
      },
      variant: 'outline',
      className: 'text-red-600 hover:text-red-700',
      disabled: permission.name === 'super-admin'
    }
  ]

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Permissions" />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permissions
            </CardTitle>
            <CardDescription>Manage user permissions</CardDescription>
          </div>
          <CreatePermissionModal
            permissions={permissions}
            onRoleCreated={handlePermissionCreated}
          />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.length ? (
                  permissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          {permission.display_name || permission.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <ActionButtons
                          actions={getPermissionActions(permission)}
                          item={permission}
                          layout="dropdown"
                          maxInline={1}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No permissions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Edit Permission Modal */}
      {editingPermission && (
        <EditPermissionModal
          permission={editingPermission}
          open={editModalOpen}
          setOpen={setEditModalOpen}
          onPermissionUpdated={handlePermissionUpdated}
        />
      )}
      
      {/* Delete Permission Modal */}
      <DeleteModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Permission"
        description="Are you sure you want to delete this permission? This action cannot be undone."
        itemName={deletingPermission?.display_name || deletingPermission?.name}
        confirmText="Delete Permission"
        processing={deleting}
      />
    </AuthenticatedLayout>
  )
}