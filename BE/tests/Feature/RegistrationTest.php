<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_register_and_is_authenticated(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'New User',
            'email' => 'new@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.email', 'new@example.com');

        $this->assertDatabaseHas('users', [
            'name' => 'New User',
            'email' => 'new@example.com',
        ]);
        $this->assertAuthenticated('web');
    }

    public function test_registration_validation_rejects_duplicate_email_and_mismatched_password(): void
    {
        User::factory()->create(['email' => 'existing@example.com']);

        $this->postJson('/api/register', [
            'name' => 'New User',
            'email' => 'existing@example.com',
            'password' => 'password',
            'password_confirmation' => 'different-password',
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }
}
