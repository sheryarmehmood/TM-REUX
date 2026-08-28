<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectTaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_create_project_and_task(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $projectResponse = $this->postJson('/api/projects', [
            'name' => 'Website redesign',
            'description' => 'Refresh the public website.',
        ]);

        $projectResponse->assertCreated()
            ->assertJsonPath('data.name', 'Website redesign');

        $project = Project::firstOrFail();

        $this->postJson("/api/projects/{$project->id}/tasks", [
            'title' => 'Create wireframes',
            'priority' => 'high',
        ])->assertCreated()
            ->assertJsonPath('data.project_id', $project->id)
            ->assertJsonPath('data.status', 'todo');

        $this->assertDatabaseHas('tasks', [
            'project_id' => $project->id,
            'title' => 'Create wireframes',
        ]);
    }

    public function test_project_validation_is_returned(): void
    {
        $this->actingAs(User::factory()->create());

        $this->postJson('/api/projects', [])->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_user_cannot_access_another_users_project_or_tasks(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $project = Project::create([
            'owner_id' => $owner->id,
            'name' => 'Private project',
            'status' => 'active',
        ]);
        Task::create([
            'project_id' => $project->id,
            'title' => 'Private task',
            'status' => 'todo',
            'priority' => 'medium',
        ]);

        $this->actingAs($otherUser);

        $this->getJson("/api/projects/{$project->id}")->assertForbidden();
        $this->getJson("/api/projects/{$project->id}/tasks")->assertForbidden();
    }
}
