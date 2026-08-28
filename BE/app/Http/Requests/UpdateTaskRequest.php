<?php

namespace App\Http\Requests;

class UpdateTaskRequest extends StoreTaskRequest
{
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:180'],
            'description' => ['nullable', 'string'],
            'assignee_id' => ['nullable', 'integer', 'exists:users,id'],
            'status' => ['sometimes', 'string', 'in:todo,in_progress,done'],
            'priority' => ['sometimes', 'string', 'in:low,medium,high'],
            'due_date' => ['nullable', 'date'],
        ];
    }
}