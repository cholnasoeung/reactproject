import { useState } from "react"
import { useForm } from "@inertiajs/react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import InputError from "@/Components/InputError"
import { UserCog, Plus } from "lucide-react"
import { router } from "@inertiajs/react"

export default function EditPermissionModal({ permission, open, setOpen, onPermissionUpdated }) {
    const [nameErrors, setNameErrors] = useState([])

    const { data, setData, put, processing, errors, reset } = useForm({
        name: permission?.name || '',
    })

    const handleNameChange = (e) => {
        let value = e.target.value

        // Auto-format: convert spaces to hyphens and make lowercase
        const formattedValue = value.toLowerCase().replace(/\s+/g, '-')

        if (value !== value.toLowerCase()) {
            setNameErrors("Permission name must be lowercase")
        } else {
            setNameErrors("")
        }

        setData('name', formattedValue)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Clear any local validation errors
        setNameErrors("")

        put(route('permissions.update', permission.id), {
            preserveScroll: true,
            onSuccess: (response) => {
                reset()
                setOpen(false)
                setNameErrors([])
                if (onPermissionUpdated) {
                    onPermissionUpdated()
                }
            },
            onError: (errors) => {
                console.log('Validation errors:', errors)
            }
        })
    }

    const handleClose = () => {
        setOpen(false)
        setNameErrors("")
        reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserCog className="h-5 w-5" />
                        Edit Permission
                    </DialogTitle>
                    <DialogDescription>
                        Update the permission to control user access.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="flex-1 space-y-2">
                                <Label>
                                    Permission Name
                                </Label>
                                <Input
                                    id="permission-name"
                                    type="text"
                                    value={data.name}
                                    onChange={handleNameChange}
                                    placeholder="Enter permission name (e.g., user-view, user-create)"
                                    disabled={processing}
                                />
                                {nameErrors && (
                                    <p className="text-sm text-red-600">{nameErrors}</p>
                                )}
                                <InputError message={errors?.name} />
                                <p className="text-xs text-muted-foreground">
                                    Spaces will be automatically converted to hyphens (e.g., "user view" → "user-view").
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* Global error for empty permissions */}
                    {nameErrors && nameErrors.includes('At least one') && (
                        <InputError message={nameErrors} />
                    )}

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
                            disabled={processing}
                        >
                            {processing
                                ? "Updating..."
                                : "Update Permission"
                            }
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}