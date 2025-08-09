<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Permissions/Index', [
            'permissions' => Permission::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Permissions/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|array|min:1',
            'name.*' => 'required|string|max:255|unique:permissions,name'
        ]);
        try {
            foreach ($request->name as $index => $name) {
                Permission::create(['name' => $name]);
            }
            return redirect()->route('permissions.index')
                ->with('success', 'Permission created successfully.');
        } catch (\Exception $e) {
            return redirect()->route('permissions.index')
                ->with('error', 'Failed to create permission.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Inertia::render('Permissions/Edit', [
            'permission' => Permission::findOrFail($id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $id
        ]);

        try {
            $permission = Permission::findOrFail($id);
            $permission->update(['name' => $request->name]);
            
            return redirect()->route('permissions.index')
                ->with('success', 'Permission updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('permissions.index')
                ->with('error', 'Failed to update permission.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $permission = Permission::findOrFail($id);
            
            // Prevent deletion of critical permissions
            if ($permission->name === 'super-admin') {
                return redirect()->route('permissions.index')
                    ->with('error', 'Cannot delete the super-admin permission.');
            }
            
            $permission->delete();
            
            return redirect()->route('permissions.index')
                ->with('success', 'Permission deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('permissions.index')
                ->with('error', 'Failed to delete permission.');
        }
    }
}
