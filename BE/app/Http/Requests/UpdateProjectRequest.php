<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends StoreProjectRequest
{
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:120'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'string', 'in:active,archived'],
        ];
    }
}