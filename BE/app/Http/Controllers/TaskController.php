<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TaskController extends Controller
{
    public function index(Request $request, Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        $tasks = $project->tasks()->latest()->paginate($request->integer('per_page', 15));

        return response()->json([
            'success' => true,
            'message' => 'Tasks retrieved successfully.',
            'data' => TaskResource::collection($tasks)->resolve(),
            'meta' => [
                'current_page' => $tasks->currentPage(),
                'last_page' => $tasks->lastPage(),
                'per_page' => $tasks->perPage(),
                'total' => $tasks->total(),
            ],
        ]);
    }

    public function store(StoreTaskRequest $request, Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        $task = $project->tasks()->create([
            ...$request->validated(),
            'status' => $request->validated('status', 'todo'),
            'priority' => $request->validated('priority', 'medium'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully.',
            'data' => (new TaskResource($task))->resolve(),
        ], 201);
    }

    public function show(Task $task): JsonResponse
    {
        Gate::authorize('view', $task);

        return response()->json([
            'success' => true,
            'message' => 'Task retrieved successfully.',
            'data' => (new TaskResource($task))->resolve(),
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        Gate::authorize('update', $task);
        $task->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully.',
            'data' => (new TaskResource($task->refresh()))->resolve(),
        ]);
    }

    public function destroy(Task $task): JsonResponse
    {
        Gate::authorize('delete', $task);
        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully.',
            'data' => null,
        ]);
    }
}
