<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:180'],
            'description' => ['nullable', 'string'],
            'assignee_id' => ['nullable', 'integer', 'exists:users,id'],
            'status' => ['sometimes', 'string', 'in:todo,in_progress,done'],
            'priority' => ['sometimes', 'string', 'in:low,medium,high'],
            'due_date' => ['nullable', 'date'],
        ];
    }
}