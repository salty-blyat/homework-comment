<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    // Specify the table name if it differs from the default naming convention
    protected $table = 'comments';

    // Define the fillable fields
    protected $fillable = [
        'context',
        'user_id',
        'product_id',
        'parent_id',
    ];

    // Define the relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Define the relationship with the Product model
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Optionally, define a relationship for nested comments
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    // Optionally, define a relationship to get child comments
    public function allReplies()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }
    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id')->with('replies');
    }
}
