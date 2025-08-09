<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use App\Http\Traits\HasDataTableFilters;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\ProfileUpdateRequest;

use App\Models\User;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Profiler\Profile;

class UserController extends Controller
{
    use HasDataTableFilters;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filterConfig = [
            'search' => [
                'type' => 'search',
                'fields' => ['name', 'email']
            ],
            'email_verified' => [
                'type' => 'boolean',
                'field' => 'email_verified_at'
            ],
            'created_date' => [
                'type' => 'date_range',
                'field' => 'created_at',
                'key' => 'created_date'
            ],
            '_default_sort' => [
                'field' => 'created_at',
                'direction' => 'desc'
            ]
        ];

        // Get paginated users with filters
        $users = $this->getPaginatedWithFilters(
            User::query(),
            $request,
            $filterConfig,
            10 // default per page
        );

        // Extract current filter values
        $filters = $request->only([
            'search', 'email_verified', 'created_date_start', 'created_date_end', 'per_page'
        ]);

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Users/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserStoreRequest $request)
    {
        $validated = $request->validated();
        
        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('users.index')
            ->with('success', 'User created successfully.');
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
        return Inertia::render('Users/Edit', [
            'user' => User::findOrFail($id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProfileUpdateRequest $request, string $id)
    {
        $validated = $request->validated();

        $user = User::findOrFail($id);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            User::findOrFail($id)->delete();
            return redirect()->route('users.index')
                ->with('success', 'User deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('users.index')
                ->with('error', 'Failed to delete user.');
        }
    }
}
