import { useState, useEffect } from "react"
import { useForm } from "@inertiajs/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Checkbox } from "@/Components/ui/checkbox"
import InputError from "@/Components/InputError"
import { UserCog } from "lucide-react"

export default function EditRoleModal({ role, permissions = [], open, setOpen, onRoleUpdated }) {
  const [nameError, setNameError] = useState("")
  
  const { data, setData, put, processing, errors, reset } = useForm({
    name: role?.name || '',
    permissions: role?.permissions?.map(p => p.id) || []
  })

  // Reset form data when role changes
  useEffect(() => {
    if (role) {
      setData({
        name: role.name || '',
        permissions: role.permissions?.map(p => p.id) || []
      })
    }
  }, [role])

  const handleNameChange = (e) => {
    let value = e.target.value
    
    // Auto-format: convert spaces to hyphens and make lowercase
    const formattedValue = value.toLowerCase().replace(/\s+/g, '-')
    
    // Validate: show error if original input has uppercase
    if (value !== value.toLowerCase()) {
      setNameError("Role name must be lowercase")
    } else {
      setNameError("")
    }
    
    setData('name', formattedValue)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Clear any local validation errors
    setNameError("")
    
    // Use PUT method for updating
    put(route('roles.update', role.id), {
      preserveScroll: true,
      onSuccess: (response) => {
        setOpen(false)
        setNameError("")
        if (onRoleUpdated) {
          onRoleUpdated()
        }
      },
      onError: (errors) => {
        console.log('Validation errors:', errors)
      }
    })
  }

  const handlePermissionChange = (permissionId, checked) => {
    if (checked) {
      setData('permissions', [...data.permissions, permissionId])
    } else {
      setData('permissions', data.permissions.filter(id => id !== permissionId))
    }
  }

  const handleClose = () => {
    setOpen(false)
    setNameError("")
    // Reset to original role data
    if (role) {
      setData({
        name: role.name || '',
        permissions: role.permissions?.map(p => p.id) || []
      })
    }
  }

  if (!role) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Edit Role: {role?.display_name || role?.name}
          </DialogTitle>
          <DialogDescription>
            Update role name and permissions to control user access.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              type="text"
              value={data.name}
              onChange={handleNameChange}
              placeholder="Enter role name (e.g., admin, editor)"
              disabled={processing}
            />
            {nameError && (
              <p className="text-sm text-red-600">{nameError}</p>
            )}
            <InputError message={errors?.name} />
            <p className="text-xs text-muted-foreground">
              Spaces will be automatically converted to hyphens (e.g., "Super Admin" → "super-admin")
            </p>
          </div>

          {/* Permissions */}
          {permissions.length > 0 && (
            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-1 gap-3">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={data.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.id, checked)
                        }
                        disabled={processing}
                      />
                      <Label 
                        htmlFor={`permission-${permission.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {permission.display_name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <InputError message={errors?.permissions} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={processing || !data.name.trim()}
            >
              {processing ? "Updating..." : "Update Role"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}