import { useState } from "react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link, useForm } from "@inertiajs/react"
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
import { Button } from "@/Components/ui/button"
import { UserPlus, Mail, Calendar, Shield, ShieldCheck } from "lucide-react"
import DataTableFilter from "@/Components/DataTableFilter"
import Pagination from "@/Components/Pagination"
import ActionButtons from "@/Components/ActionButton"
import DeleteModal from "@/Components/DeleteModal"


export default function Index({ auth, users, filters }) {

  const [deletingUser, setDeletingUser] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const { delete: destroy, processing: deleting } = useForm()

  const handleUserDeleted = () => {
    window.location.reload()
  }

  const openDeleteModal = (role) => {
    setDeletingUser(role)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!deletingUser) return

    destroy(route('users.destroy', deletingUser.id), {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteModalOpen(false)
        setDeletingUser(null)
        handleUserDeleted()
      },
      onError: (errors) => {
        console.log('Delete errors:', errors)
      }
    })
  }

  // Define actions for each user row
  const getUserActions = (user) => [
    {
      key: 'view',
      label: 'View',
      href: route('users.show', user.id),
      variant: 'outline'
    },
    {
      key: 'edit',
      label: 'Edit',
      href: route('users.edit', user.id),
      variant: 'outline'
    },
    {
      key: 'delete',
      label: 'Delete',
      onClick: (user) => {
        openDeleteModal(user)
      },
      variant: 'outline',
      className: 'text-red-600 hover:text-red-700'
    }
  ]

  // Filter configuration for the DataTableFilter component
  const filterConfig = {
    search: {
      enabled: true,
      placeholder: "Search users by name or email..."
    },
    perPage: {
      enabled: true,
      default: 10
    },
    quickFilters: [
      {
        key: 'email_verified',
        type: 'select',
        placeholder: 'Email Status',
        icon: Shield,
        options: [
          { value: '', label: 'All Users' },
          { value: '1', label: 'Verified' },
          { value: '0', label: 'Unverified' }
        ]
      }
    ],
    advancedFilters: [
      {
        key: 'created_date',
        type: 'date_range',
        placeholder: 'Registration Date'
      }
    ]
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Users" />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage your application users</CardDescription>
          </div>
          <Link href={route("users.create")}>
            <Button>
              <UserPlus className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <DataTableFilter
            filters={filters || {}}
            config={filterConfig}
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.data?.length ? (
                  users.data.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.email_verified_at ? (
                            <>
                              <ShieldCheck className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-600">Verified</span>
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 text-orange-500" />
                              <span className="text-sm text-orange-500">Unverified</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <ActionButtons
                          actions={getUserActions(user)}
                          item={user}
                          layout="inline"
                          maxInline={2}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {users.meta && users.links && (
            <div className="mt-4">
              <Pagination links={users.links} meta={users.meta} />
            </div>
          )}
        </CardContent>
      </Card>
      {/* Delete User Modal */}
      <DeleteModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone and will remove all associated data."
        itemName={deletingUser?.display_name || deletingUser?.name}
        confirmText="Delete User"
        processing={deleting}
      />
    </AuthenticatedLayout>
  )
}