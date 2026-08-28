<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_and_fetch_current_user(): void
    {
        $user = User::factory()->create([
            'email' => 'owner@example.com',
            'password' => 'password',
        ]);

        $login = $this->postJson('/api/login', [
            'email' => 'owner@example.com',
            'password' => 'password',
        ]);

        $login->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.id', $user->id);

        $this->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('data.user.email', 'owner@example.com');
    }

    public function test_invalid_credentials_are_rejected(): void
    {
        User::factory()->create(['email' => 'owner@example.com']);

        $this->postJson('/api/login', [
            'email' => 'owner@example.com',
            'password' => 'wrong-password',
        ])->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_user_can_logout(): void
    {
        $this->actingAs(User::factory()->create());

        $this->postJson('/api/logout')
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertGuest('web');
    }
}
