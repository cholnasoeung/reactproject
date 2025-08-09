import { Button } from "@/Components/ui/button"
import { 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Download,
  Copy,
  Archive,
  RefreshCw
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { Link } from "@inertiajs/react"

// Icon mapping for common actions
const iconMap = {
  view: Eye,
  edit: Edit,
  delete: Trash2,
  download: Download,
  copy: Copy,
  archive: Archive,
  refresh: RefreshCw,
}

// Individual Action Button Component
export function ActionButton({ 
  action, 
  href, 
  onClick, 
  variant = "outline", 
  size = "sm",
  disabled = false,
  className = ""
}) {
  const Icon = iconMap[action.toLowerCase()] || Eye
  const buttonContent = (
    <Button 
      variant={variant} 
      size={size}
      disabled={disabled}
      className={className}
      onClick={onClick}
    >
      <Icon className="h-4 w-4 mr-1" />
      {action}
    </Button>
  )

  if (href) {
    return <Link href={href}>{buttonContent}</Link>
  }

  return buttonContent
}

// Action Buttons Container Component
export default function ActionButtons({ 
  actions = [], 
  layout = "inline", // "inline" or "dropdown"
  maxInline = 3,
  item = null,
  className = ""
}) {
  // Filter out disabled actions
  const enabledActions = actions.filter(action => !action.disabled)
  
  if (layout === "dropdown" || enabledActions.length > maxInline) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
          <DropdownMenuSeparator />
          {enabledActions.map((action, index) => {
            const Icon = iconMap[action.key?.toLowerCase()] || Eye
            
            if (action.href) {
              return (
                <DropdownMenuItem key={index} asChild>
                  <Link href={typeof action.href === 'function' ? action.href(item) : action.href}>
                    <Icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Link>
                </DropdownMenuItem>
              )
            }
            
            return (
              <DropdownMenuItem 
                key={index}
                onClick={() => action.onClick && action.onClick(item)}
                className={action.className}
              >
                <Icon className="h-4 w-4 mr-2" />
                {action.label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Inline layout
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {enabledActions.slice(0, maxInline).map((action, index) => {
        const Icon = iconMap[action.key?.toLowerCase()] || Eye
        
        const buttonContent = (
          <Button
            key={index}
            variant={action.variant || "outline"}
            size={action.size || "sm"}
            onClick={() => action.onClick && action.onClick(item)}
            disabled={action.disabled}
            className={action.className}
          >
            <Icon className="h-4 w-4 mr-1" />
            {action.label}
          </Button>
        )

        if (action.href) {
          return (
            <Link 
              key={index}
              href={typeof action.href === 'function' ? action.href(item) : action.href}
            >
              {buttonContent}
            </Link>
          )
        }

        return buttonContent
      })}
      
      {/* Show overflow dropdown if there are more actions */}
      {enabledActions.length > maxInline && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {enabledActions.slice(maxInline).map((action, index) => {
              const Icon = iconMap[action.key?.toLowerCase()] || Eye
              
              if (action.href) {
                return (
                  <DropdownMenuItem key={index} asChild>
                    <Link href={typeof action.href === 'function' ? action.href(item) : action.href}>
                      <Icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </Link>
                  </DropdownMenuItem>
                )
              }
              
              return (
                <DropdownMenuItem 
                  key={index}
                  onClick={() => action.onClick && action.onClick(item)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}