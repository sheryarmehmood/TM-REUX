<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Illuminate\Session\Middleware\StartSession;

Route::post('/login', [AuthController::class, 'login'])
    ->middleware([StartSession::class, 'throttle:6,1']);
Route::post('/register', [AuthController::class, 'register'])
    ->middleware([StartSession::class, 'throttle:6,1']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware(StartSession::class);

    Route::apiResource('projects', ProjectController::class);
    Route::get('/projects/{project}/tasks', [TaskController::class, 'index']);
    Route::post('/projects/{project}/tasks', [TaskController::class, 'store']);
    Route::apiResource('tasks', TaskController::class)->except(['index', 'store']);
});

Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'Laravel API is working!',
    ]);
});