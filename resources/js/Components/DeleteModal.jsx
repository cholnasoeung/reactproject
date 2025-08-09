import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function DeleteModal({ 
    open, 
    setOpen, 
    onConfirm, 
    title = "Delete Item", 
    description = "Are you sure you want to delete this item? This action cannot be undone.",
    itemName = "",
    confirmText = "Delete",
    processing = false 
}) {
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm()
        }
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                {itemName && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="font-medium text-red-800">
                                {itemName}
                            </span>
                        </div>
                        <p className="text-sm text-red-600 mt-1">
                            This will be permanently removed from the system.
                        </p>
                    </div>
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
                        onClick={handleConfirm}
                        variant="destructive"
                        disabled={processing}
                    >
                        {processing ? `${confirmText}...` : confirmText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}