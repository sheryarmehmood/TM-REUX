<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('assignee_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title', 180);
            $table->text('description')->nullable();
            $table->string('status', 20)->default('todo');
            $table->string('priority', 20)->default('medium');
            $table->date('due_date')->nullable();
            $table->timestamps();

            $table->index(['project_id', 'status']);
            $table->index('assignee_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
