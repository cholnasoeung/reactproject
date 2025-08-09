import { useState, useEffect } from "react"
import { router } from "@inertiajs/react"
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { Search, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"

export default function SearchFilter({ filters, onFiltersChange }) {
  const [search, setSearch] = useState(filters.search || "")
  const [perPage, setPerPage] = useState(filters.per_page || 10)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search !== filters.search || perPage !== filters.per_page) {
        router.get(window.location.pathname, {
          search: search || undefined,
          per_page: perPage,
        }, {
          preserveState: true,
          preserveScroll: true,
        })
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [search, perPage])

  const clearSearch = () => {
    setSearch("")
    router.get(window.location.pathname, {
      per_page: perPage,
    }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <Select value={perPage.toString()} onValueChange={(value) => setPerPage(Number(value))}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Per page" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5 per page</SelectItem>
          <SelectItem value="10">10 per page</SelectItem>
          <SelectItem value="25">25 per page</SelectItem>
          <SelectItem value="50">50 per page</SelectItem>
        </SelectContent>
      </Select>
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
        {search && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}