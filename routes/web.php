<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/product/{slug}', function ($slug) {
    return Inertia::render('ProductDetail', [
        'slug' => $slug,
    ]);
})->name('product.detail');


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::middleware('auth')->prefix('api')->group(function () {
    Route::get('products',              [ProductController::class, 'index']);
    Route::post('products',             [ProductController::class, 'store']);
    Route::get('product/{id}',          [ProductController::class, 'show']);
    // comment
    Route::get('comments/{id}',          [CommentController::class, 'show'])->withoutMiddleware('auth');
    Route::post('comment',              [CommentController::class, 'store']);
    Route::post('comment/update/{id}',              [CommentController::class, 'update']);
    Route::post('comment/delete',              [CommentController::class, 'destroy']);
});







require __DIR__ . '/auth.php';
