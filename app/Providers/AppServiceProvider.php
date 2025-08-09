<?php

namespace App\Providers;

use App\Observers\RoleObserver;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Vite;
use App\Observers\PermissionObserver;
use Illuminate\Support\ServiceProvider;
use Spatie\Permission\Models\Permission;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        
        // Register observers
        Role::observe(RoleObserver::class);
        Permission::observe(PermissionObserver::class);
    }
}
