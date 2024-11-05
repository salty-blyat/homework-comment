<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    // Retrieve all products
    public function index()
    {
        $products = Product::with(['user:id,name'])->get();

        $backendUrl = env('BACKEND_URL');
        foreach ($products as $product) {
            if ($product->image_url) {
                $product->image_url = rtrim($backendUrl, '/') . '/' . ltrim($product->image_url, '/');
            }
        }
        return $this->successResponse($products);
    }


    // Store a new product
    public function store(Request $request)
    {
        $user_id = Auth::id();
        // Validate the incoming request
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Initialize the image_url variable
        $image_url = null;

        // Handle file upload if an image is provided
        if ($request->hasFile('image_url')) {
            // Upload the document and get the path
            $image_url = uploadDocument($request->file('image_url'), 'products');
        }

        // Create the product with the updated request data, including user_id
        $product = Product::create(array_merge($request->all(), [
            'image_url' => $image_url,
            'user_id' => $user_id // Include the user_id
        ]));


        // Return the created product as a JSON response
        return $this->successResponse($product, 201);
    }

    // Retrieve a single product by ID
    public function show($id)
    {
        $product = Product::findOrFail($id); // Throws a 404 if not found
        $backendUrl = env('BACKEND_URL');
        if ($product->image_url) {
            $product->image_url = rtrim($backendUrl, '/') . '/' . ltrim($product->image_url, '/');
        }

        return $this->successResponse($product);
    }

    // Update an existing product
    public function update(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'sometimes|integer',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric',
            'image_url' => 'nullable|string',
        ]);

        $product = Product::findOrFail($id);
        $product->update($request->all());
        return response()->json($product);
    }

    // Delete a product
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(null, 204); // 204 No Content
    }
}
