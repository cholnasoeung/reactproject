import { Link } from "@inertiajs/react"
import { Button } from "@/Components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

export default function Pagination({ links, meta }) {
  if (!links || links.length <= 3) return null

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        Showing <span className="font-medium">{meta.from || 0}</span> to{" "}
        <span className="font-medium">{meta.to || 0}</span> of{" "}
        <span className="font-medium">{meta.total}</span> results
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          {/* First Page */}
          <Link
            href={links[0].url}
            preserveScroll
            className={!links[0].url ? "pointer-events-none" : ""}
          >
            <Button
              variant="outline"
              size="sm"
              disabled={!links[0].url}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          </Link>
          
          {/* Previous Page */}
          <Link
            href={links[0].url}
            preserveScroll
            className={!links[0].url ? "pointer-events-none" : ""}
          >
            <Button
              variant="outline"
              size="sm"
              disabled={!links[0].url}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {links.slice(1, -1).map((link, index) => (
              <Link
                key={index}
                href={link.url}
                preserveScroll
                className={!link.url ? "pointer-events-none" : ""}
              >
                <Button
                  variant={link.active ? "default" : "outline"}
                  size="sm"
                  disabled={!link.url}
                  className="h-8 min-w-8 px-2"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Next Page */}
          <Link
            href={links[links.length - 1].url}
            preserveScroll
            className={!links[links.length - 1].url ? "pointer-events-none" : ""}
          >
            <Button
              variant="outline"
              size="sm"
              disabled={!links[links.length - 1].url}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>

          {/* Last Page */}
          <Link
            href={`${window.location.pathname}?page=${meta.last_page}`}
            preserveScroll
          >
            <Button
              variant="outline"
              size="sm"
              disabled={meta.current_page === meta.last_page}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}