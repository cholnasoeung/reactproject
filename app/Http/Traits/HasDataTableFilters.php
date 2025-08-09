<?php

namespace App\Http\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

trait HasDataTableFilters
{
    /**
     * Apply filters to a query based on request parameters and filter configuration
     */
    public function applyFilters(Builder $query, Request $request, array $filterConfig = [])
    {
        foreach ($filterConfig as $filterKey => $config) {
            $filterType = $config['type'] ?? 'search';
            
            // Handle date range and numeric range filters differently
            if ($filterType === 'date_range') {
                $this->applyDateRangeFilter($query, $request, $config);
                continue;
            }
            
            if ($filterType === 'numeric_range') {
                $this->applyNumericRangeFilter($query, $request, $config);
                continue;
            }
            
            // For other filters, check if value exists
            $value = $request->get($filterKey);
            
            if ($value === null || $value === '') {
                continue;
            }
            
            switch ($filterType) {
                case 'search':
                    $this->applySearchFilter($query, $value, $config);
                    break;
                    
                case 'exact':
                    $this->applyExactFilter($query, $value, $config);
                    break;
                    
                case 'select':
                case 'dropdown':
                    $this->applySelectFilter($query, $value, $config);
                    break;
                    
                case 'boolean':
                    $this->applyBooleanFilter($query, $value, $config);
                    break;
            }
        }

        return $query;
    }

    /**
     * Apply search filter (LIKE query across multiple fields)
     */
    protected function applySearchFilter(Builder $query, $value, array $config)
    {
        $fields = $config['fields'] ?? ['name'];
        
        $query->where(function ($q) use ($fields, $value) {
            foreach ($fields as $field) {
                if (str_contains($field, '.')) {
                    // Handle relationship fields
                    [$relation, $column] = explode('.', $field, 2);
                    $q->orWhereHas($relation, function ($subQ) use ($column, $value) {
                        $subQ->where($column, 'like', "%{$value}%");
                    });
                } else {
                    $q->orWhere($field, 'like', "%{$value}%");
                }
            }
        });
    }

    /**
     * Apply exact match filter
     */
    protected function applyExactFilter(Builder $query, $value, array $config)
    {
        $field = $config['field'] ?? $config['fields'][0] ?? 'id';
        $query->where($field, $value);
    }

    /**
     * Apply date range filter
     */
    protected function applyDateRangeFilter(Builder $query, Request $request, array $config)
    {
        $field = $config['field'] ?? 'created_at';
        $keyPrefix = $config['key'] ?? 'date';
        
        $startDate = $request->get("{$keyPrefix}_start");
        $endDate = $request->get("{$keyPrefix}_end");
        
        // Log for debugging
        \Log::info("Date Range Filter - Start: {$startDate}, End: {$endDate}, Field: {$field}");
        
        if ($startDate && $startDate !== '') {
            $query->whereDate($field, '>=', $startDate);
            \Log::info("Applied start date filter: {$field} >= {$startDate}");
        }
        
        if ($endDate && $endDate !== '') {
            $query->whereDate($field, '<=', $endDate);
            \Log::info("Applied end date filter: {$field} <= {$endDate}");
        }
    }

    /**
     * Apply select/dropdown filter
     */
    protected function applySelectFilter(Builder $query, $value, array $config)
    {
        $field = $config['field'] ?? 'status';
        
        if (is_array($value)) {
            $query->whereIn($field, $value);
        } else {
            $query->where($field, $value);
        }
    }

    /**
     * Apply boolean filter
     */
    protected function applyBooleanFilter(Builder $query, $value, array $config)
    {
        $field = $config['field'] ?? 'is_active';
        
        if ($value === '1') {
            $query->whereNotNull($field);
        } elseif ($value === '0') {
            $query->whereNull($field);
        }
    }

    /**
     * Apply numeric range filter
     */
    protected function applyNumericRangeFilter(Builder $query, Request $request, array $config)
    {
        $field = $config['field'] ?? 'price';
        $keyPrefix = $config['key'] ?? 'price';
        
        $min = $request->get("{$keyPrefix}_min");
        $max = $request->get("{$keyPrefix}_max");
        
        if ($min !== null) {
            $query->where($field, '>=', $min);
        }
        
        if ($max !== null) {
            $query->where($field, '<=', $max);
        }
    }

    /**
     * Get paginated results with filters
     */
    public function getPaginatedWithFilters(Builder $query, Request $request, array $filterConfig = [], int $defaultPerPage = 10)
    {
        $perPage = $request->get('per_page', $defaultPerPage);
        
        // Apply filters
        $this->applyFilters($query, $request, $filterConfig);
        
        // Apply default sorting if specified
        if (isset($filterConfig['_default_sort'])) {
            $sortConfig = $filterConfig['_default_sort'];
            $query->orderBy($sortConfig['field'] ?? 'created_at', $sortConfig['direction'] ?? 'desc');
        }
        
        return $query->paginate($perPage)->withQueryString();
    }
}