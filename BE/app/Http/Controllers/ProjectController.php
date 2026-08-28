<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Project::class);

        $projects = Project::query()
            ->where('owner_id', $request->user()->id)
            ->withCount('tasks')
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return response()->json([
            'success' => true,
            'message' => 'Projects retrieved successfully.',
            'data' => ProjectResource::collection($projects)->resolve(),
            'meta' => [
                'current_page' => $projects->currentPage(),
                'last_page' => $projects->lastPage(),
                'per_page' => $projects->perPage(),
                'total' => $projects->total(),
            ],
        ]);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        Gate::authorize('create', Project::class);

        $project = $request->user()->projects()->create([
            ...$request->validated(),
            'status' => $request->validated('status', 'active'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully.',
            'data' => (new ProjectResource($project))->resolve(),
        ], 201);
    }

    public function show(Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        return response()->json([
            'success' => true,
            'message' => 'Project retrieved successfully.',
            'data' => (new ProjectResource($project->loadCount('tasks')))->resolve(),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        Gate::authorize('update', $project);
        $project->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully.',
            'data' => (new ProjectResource($project->refresh()->loadCount('tasks')))->resolve(),
        ]);
    }

    public function destroy(Project $project): JsonResponse
    {
        Gate::authorize('delete', $project);
        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully.',
            'data' => null,
        ]);
    }
}
