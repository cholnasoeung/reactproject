<?php

namespace App\Observers;

use Spatie\Permission\Models\Permission;

class PermissionObserver
{
    public function created(Permission $permission): void
    {
        $parts = explode('-', $permission->name);
        
        $module = strtolower($parts[0]); 
        $permission->module = $module;

        $permission->name = strtolower($permission->name);

        $permission->display_name = ucwords(str_replace('-', ' ', $permission->name));
        
        $permission->save();
    }
}
