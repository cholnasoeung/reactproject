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
import { Checkbox } from "@/Components/ui/checkbox"
import InputError from "@/Components/InputError"
import { UserCog, Plus, Minus } from "lucide-react"
import { router } from "@inertiajs/react"

export default function CreatePermissionModal({ permissions = [], onPermissionCreated }) {
    const [open, setOpen] = useState(false)
    const [nameErrors, setNameErrors] = useState([])

    const { data, setData, post, processing, errors, reset } = useForm({
        name: [''], 
    })

    const handleNameChange = (index, e) => {
        let value = e.target.value

        // Auto-format: convert spaces to hyphens and make lowercase
        const formattedValue = value.toLowerCase().replace(/\s+/g, '-')

        const updatedNames = [...data.name]
        updatedNames[index] = formattedValue

        const updatedNameErrors = [...nameErrors]
        if (value !== value.toLowerCase()) {
            updatedNameErrors[index] = "Permission name must be lowercase"
        } else {
            updatedNameErrors[index] = ""
        }

        setData('name', updatedNames)
        setNameErrors(updatedNameErrors)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Clear any local validation errors
        setNameErrors([])

        const filteredNames = data.name.filter(name => name.trim() !== '')

        if (filteredNames.length === 0) {
            setNameErrors(['At least one permission name is required'])
            return
        }

        router.post(route('permissions.store'), { name: filteredNames }, {
            preserveScroll: true,
            onSuccess: (response) => {
                reset()
                setOpen(false)
                setNameErrors([])
                if (onPermissionCreated) {
                    onPermissionCreated()
                }
            },
            onError: (errors) => {
                console.log('Validation errors:', errors)
            }
        })
    }

    const addPermission = () => {
        setData('name', [...data.name, '']) 
        setNameErrors([...nameErrors, '']) 
    }

    const removePermission = (index) => {
        const updatedNames = data.name.filter((_, i) => i !== index)
        const updatedErrors = nameErrors.filter((_, i) => i !== index)

        setData('name', updatedNames)
        setNameErrors(updatedErrors)
    }

    const handleClose = () => {
        setOpen(false)
        setNameErrors([])
        reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Permission
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserCog className="h-5 w-5" />
                        Create New Permissions
                    </DialogTitle>
                    <DialogDescription>
                        Create new permissions to control user access.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Permission Names */}
                    <div className="space-y-4">
                        {data.name.map((name, index) => (
                            <div key={index} className="flex items-start gap-4 permission-item">
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor={`name-${index}`}>
                                        Permission Name {data.name.length > 1 ? `#${index + 1}` : ''}
                                    </Label>
                                    <Input
                                        id={`name-${index}`}
                                        type="text"
                                        value={name}
                                        onChange={(e) => handleNameChange(index, e)}
                                        placeholder="Enter permission name (e.g., user-view, user-create)"
                                        disabled={processing}
                                    />
                                    {nameErrors[index] && (
                                        <p className="text-sm text-red-600">{nameErrors[index]}</p>
                                    )}
                                    <InputError message={errors?.name?.[index]} />
                                    {index === 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            Spaces will be automatically converted to hyphens (e.g., "user view" → "user-view").
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-8"> 
                                    {index === data.name.length - 1 && (
                                        <Button
                                            type="button"
                                            onClick={addPermission}
                                            size="sm"
                                            variant="outline"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    )}

                                    {data.name.length > 1 && (
                                        <Button
                                            type="button"
                                            onClick={() => removePermission(index)}
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Global error for empty permissions */}
                    {nameErrors[0] && nameErrors[0].includes('At least one') && (
                        <InputError message={nameErrors[0]} />
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
                            disabled={processing}
                        >
                            {processing
                                ? "Creating..."
                                : `Create Permissions`
                            }
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}