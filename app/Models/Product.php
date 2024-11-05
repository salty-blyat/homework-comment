<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{

    // Specify the table name if it's not the plural of the model name
    protected $table = 'products';

    // Define the fillable fields
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'price',
        'image_url',
    ];

    // Define the relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Optionally, define other relationships if needed
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
