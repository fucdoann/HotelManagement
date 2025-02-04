<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    //
    public function storeHotelImage(Request $request){
        
        $uploadedImages = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('uploads/hotel', 'public'); // Save to 'storage/app/public/uploads'
                $uploadedImages[] = $path;
            }
        }

        return response()->json([
            'success' => true,
            'uploaded_images' => $uploadedImages,
        ]);
    }
    public function storeRoomImage(Request $request){
        
        $uploadedImages = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('uploads/rooms', 'public'); // Save to 'storage/app/public/uploads'
                $uploadedImages[] = $path;
            }
        }

        return response()->json([
            'success' => true,
            'uploaded_images' => $uploadedImages,
        ]);
    }
}
