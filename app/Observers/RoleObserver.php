<?php

namespace App\Observers;

use Spatie\Permission\Models\Role;

class RoleObserver
{
    public function creating(Role $role): void
    {
        // Transform name before initial save
        $role->name = strtolower($role->name);
    }

    public function created(Role $role): void
    {
        // Add display_name after creation without triggering events
        $role->display_name = ucwords(str_replace('-', ' ', $role->name));
        $role->saveQuietly();
    }
}
