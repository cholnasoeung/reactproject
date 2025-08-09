import { useState, useEffect } from "react"
import { router } from "@inertiajs/react"
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { Search, X, Filter, Calendar, Tag } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import {
  Card,
  CardContent,
} from "@/Components/ui/card"

// Individual Filter Components
export function SearchFilter({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange("")}
          className="absolute right-1 top-1 h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export function SelectFilter({ value, onChange, options, placeholder = "Select...", icon = null }) {
  const Icon = icon || Tag

  // Handle empty values properly for Radix UI Select
  const selectValue = value && value !== "" ? value.toString() : undefined

  const handleValueChange = (newValue) => {
    // Convert "all" or empty placeholder values to empty string
    if (newValue === "all" || newValue === "placeholder") {
      onChange("")
    } else {
      onChange(newValue)
    }
  }

  return (
    <div className="flex items-center gap-2 min-w-[150px]">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <Select value={selectValue} onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => {
            // Ensure no empty string values
            const optionValue = option.value === "" ? "all" : option.value.toString()
            return (
              <SelectItem key={optionValue} value={optionValue}>
                {option.label}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}

export function DateRangeFilter({ startDate, endDate, onStartChange, onEndChange }) {
  const handleStartChange = (e) => {
    const value = e.target.value
    console.log('Start date changed:', value)
    onStartChange(value)
  }

  const handleEndChange = (e) => {
    const value = e.target.value
    console.log('End date changed:', value)
    onEndChange(value)
  }

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Input
        type="date"
        value={startDate || ""}
        onChange={handleStartChange}
        className="w-auto"
      />
      <span className="text-muted-foreground">to</span>
      <Input
        type="date"
        value={endDate || ""}
        onChange={handleEndChange}
        className="w-auto"
      />
    </div>
  )
}

export function PerPageSelector({ value, onChange }) {
  const currentValue = value ? value.toString() : "10"

  return (
    <Select value={currentValue} onValueChange={(val) => onChange(Number(val))}>
      <SelectTrigger className="w-[60px]">
        <SelectValue placeholder="Per page" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="5">5</SelectItem>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="25">25</SelectItem>
        <SelectItem value="50">50</SelectItem>
        <SelectItem value="100">100</SelectItem>
      </SelectContent>
    </Select>
  )
}

// Main DataTableFilter Component
export default function DataTableFilter({
  filters = {},
  config = {},
  onFilterChange,
  showAdvanced = false
}) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [showFilters, setShowFilters] = useState(showAdvanced)

  // Default config
  const defaultConfig = {
    search: {
      enabled: true,
      placeholder: "Search...",
      debounce: 300
    },
    perPage: {
      enabled: true,
      default: 10
    }
  }

  const mergedConfig = { ...defaultConfig, ...config }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onFilterChange) {
        onFilterChange(localFilters)
      } else {
        // Default behavior - update URL
        const params = Object.fromEntries(
          Object.entries(localFilters).filter(([_, value]) => value !== "" && value != null)
        )

        router.get(window.location.pathname, params, {
          preserveState: true,
          preserveScroll: true,
        })
      }
    }, mergedConfig.search.debounce)

    return () => clearTimeout(timeoutId)
  }, [localFilters])

  const updateFilter = (key, value) => {
    console.log(`Updating filter: ${key} = ${value}`)
    setLocalFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: value
      }
      console.log('New filters:', newFilters)
      return newFilters
    })
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      per_page: localFilters.per_page || mergedConfig.perPage.default
    }
    setLocalFilters(clearedFilters)
  }

  const hasActiveFilters = Object.entries(localFilters).some(
    ([key, value]) => key !== 'per_page' && value !== "" && value != null
  )

  return (

    <div className="space-y-4">

      {/* Advanced Filters Panel */}
      {showFilters && config.advancedFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.advancedFilters.map((filterConfig, index) => {
                if (filterConfig.type === 'select') {
                  return (
                    <SelectFilter
                      key={index}
                      value={localFilters[filterConfig.key]}
                      onChange={(value) => updateFilter(filterConfig.key, value)}
                      options={filterConfig.options}
                      placeholder={filterConfig.placeholder}
                      icon={filterConfig.icon}
                    />
                  )
                }

                if (filterConfig.type === 'date_range') {
                  return (
                    <DateRangeFilter
                      key={index}
                      startDate={localFilters[`${filterConfig.key}_start`]}
                      endDate={localFilters[`${filterConfig.key}_end`]}
                      onStartChange={(value) => updateFilter(`${filterConfig.key}_start`, value)}
                      onEndChange={(value) => updateFilter(`${filterConfig.key}_end`, value)}
                    />
                  )
                }

                return null
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Primary Filter Row */}
      <div className="flex items-center py-2 justify-between gap-4">
        {/* Per Page Selector */}
        {mergedConfig.perPage?.enabled && (
          <PerPageSelector
            value={localFilters.per_page}
            onChange={(value) => updateFilter('per_page', value)}
          />
        )}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center flex-1 gap-4">
            {/* Quick Filters */}
            {config.quickFilters?.map((filterConfig, index) => {
              if (filterConfig.type === 'select') {
                return (
                  <SelectFilter
                    key={index}
                    value={localFilters[filterConfig.key]}
                    onChange={(value) => updateFilter(filterConfig.key, value)}
                    options={filterConfig.options}
                    placeholder={filterConfig.placeholder}
                    icon={filterConfig.icon}
                  />
                )
              }
              return null
            })}
            {/* Advanced Filters Toggle */}
            {config.advancedFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            )}
            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
          <div className="space-x-2">
            {/* Search Filter */}
            {mergedConfig.search?.enabled && (
              <SearchFilter
                value={localFilters.search}
                onChange={(value) => updateFilter('search', value)}
                placeholder={mergedConfig.search.placeholder}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}