<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{

    // Store a new comment
    public function store(Request $request)
    {
        $user_id = (string) Auth::id(); // Convert user_id to string

        $validatedData = $request->validate([
            'context' => 'required|string',
            'product_id' => 'required|exists:products,id',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = Comment::create([
            'context' => $validatedData['context'],
            'product_id' => $validatedData['product_id'],
            'parent_id' => $validatedData['parent_id'] ?? null, // Now defaults to null if not provided
            'user_id' => $user_id, // user_id is now a string
        ]);

        return $this->successResponse([
            'message' => 'Comment created successfully',
            'comment' => $comment,
        ], 201);
    }



    public function show($id)
    {
        // Get the authenticated user's ID
        $user_id = auth()->id();

        // Get the product/hotel first to check ownership
        $product = Product::findOrFail($id);

        // Retrieve comments for the specified product, including their replies
        $comments = Comment::where('product_id', $id)
            ->orderBy('created_at', 'desc')
            ->where('parent_id', null) // Only get top-level comments
            ->with(['user:id,name', 'replies' => function ($query) {
                $query->with('user:id,name')
                    ->orderBy('created_at', 'asc'); // Order replies chronologically
            }])
            ->get();

        if ($comments->isEmpty()) {
            return $this->errorResponse("No comments found for this product", 404);
        }

        // Transform and format all comments
        $formattedComments = $comments->map(function ($comment) use ($user_id, $product) {
            return $this->formatComment($comment, $user_id, $product);
        });

        return $this->successResponse($formattedComments, "Comments retrieved successfully");
    }

    protected function formatComment($comment, $user_id, $product)
    {
        $isCommenter = $user_id === $comment->user_id;
        $isProductOwner = $user_id === $product->user_id;

        // Format the base comment
        $formattedComment = [
            'id' => $comment->id,
            'context' => $comment->context,
            'product_id' => $comment->product_id,
            'created_at' => $comment->created_at->diffForHumans([
                'parts' => 1,
                'join' => ', ',
                'short' => true,
            ]),
            'parent_id' => $comment->parent_id,
            'can_edit' => $isCommenter,
            'can_delete' => $isCommenter || $isProductOwner,
            'user' => $comment->user->name ?? 'Anonymous',
            'replies' => []
        ];

        // Format replies if they exist
        if ($comment->replies && $comment->replies->count() > 0) {
            $formattedComment['replies'] = $comment->replies->map(function ($reply) use ($user_id, $product) {
                return $this->formatComment($reply, $user_id, $product);
            });
        }

        return $formattedComment;
    }

    // Update a comment
    public function update(Request $request, $id)
    {

        $comment = Comment::find($id);

        if (!$comment) {
            return $this->errorResponse('Comment not found', 404);
        }
        $user_id = Auth::id();

        $isCommenter = $user_id === $comment->user_id;
        if (!$isCommenter) {
            return $this->errorResponse("Unauthorized", 401);
        }

        $validatedData = $request->validate([
            'context' => 'required|string',
        ]);

        $comment->update($validatedData);

        return $this->successResponse('Comment updated successfully');
    }

    // Delete a comment
    public function destroy(Request $request)
    {
        $validatedData = $request->validate([
            'id' => 'required|string',
        ]);

        $id = $validatedData['id'];
        $comment = Comment::find($id);

        if (!$comment) {
            return $this->errorResponse('Comment not found', 404);
        }

        $user_id = Auth::id();
        $product = Product::find($comment->product_id);

        if (!$product) {
            return $this->errorResponse('Product not found', 404);
        }

        $isCommenter = $user_id === $comment->user_id;
        $isProductOwner = $user_id === $product->user_id;


        if (!($isCommenter || $isProductOwner)) {
            return $this->errorResponse('Unauthorized', 401);
        }

        // Recursively delete all replies
        $this->deleteReplies($comment);

        // Delete the main comment
        $comment->delete();

        return $this->successResponse('Comment and all its replies deleted successfully');
    }

    private function deleteReplies(Comment $comment)
    {
        foreach ($comment->replies as $reply) {
            $this->deleteReplies($reply); // Recursively delete each reply's replies
            $reply->delete(); // Delete the reply itself
        }
    }
}
