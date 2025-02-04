<?php

namespace App\Http\Controllers\HotelController;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Hotel;
use App\Models\Room;
use Illuminate\Support\Facades\Validator;


class CRUDHotelController extends Controller
{
    //
    public function index(Request $request){//get list hotel admin_id
        $admin = $request->user();
        $querySearch = $request->input('querySearch');
        if($admin->role == 'user'){
            return response()->json([
                'status' => 400,
                'error' => 'Auth api errors'
            ],400);
        }
        $hotels = Hotel::where('admin_id', $admin->id)
        ->where('name', 'LIKE', "%$querySearch%")
        ->get();
        return response()->json([
            'status' => 200,
            'message' => 'Get hotel successfully.',
            'data' => $hotels,
        ]);
        // return $hotel;
    }
    // 
    public function delete(Request $request){
        $hotel_id = $request->input('hotel_id');
        $hotel = Hotel::where('hotel_id', $hotel_id)->first();
        if($hotel == null){
            return response()->json([
                'status' => 400,
                'error' => 'Auth api errors'
            ],400);
        }
        $hotel->delete();
        return response()->json([
            'status' => 200,
            'message' => 'Delete hotel successfully.',
        ]);
    }
    // 
    public function active(Request $request){
        $hotel_id = $request->input('hotel_id');
        $status = $request->input('status');
        $hotel = Hotel::where('hotel_id', $hotel_id)->first();
        if($hotel == null){
            return response()->json([
                'status' => 400,
                'error' => 'Auth api errors'
            ],400);
        }
        $hotel->status = $status;
        $hotel->save();
        return response()->json([
            'status' => 200,
            'message' => $status .' hotel successfully.',
        ]);
    }
    //
    public function storeHotel(Request $request){
        $input = $request->all();
        $hotel = $input['hotel'];
        $rooms = $input['room'];
        $validatorHotel = Validator::make($hotel, [
            'admin_id' => 'required|integer', // Ensure admin_id is validated
            'name' => 'required|string|unique:hotels',
            'type' => 'required|string',
            'min_price' => 'required|string',
            'location' => 'required|string',
            'address' => 'required|string',
            'description' => 'nullable|string',
            'convenients' => 'array',
            'commune' => 'required',
            'district' => 'required',
            'province' => 'required',
            'images' => 'array',
            'hot_conve' => 'array',
            'checkin_rule' => 'string',
            'checkout_rule' => 'string',
            'pay_rule' => 'integer',
            'hotel_rule' => 'string',
            'images.*' => 'string', // Each image must be a string (e.g., file path)
        ]);
        if($validatorHotel->fails()){
            return response()->json([
                'status' => 400,
                'error' => $validatorHotel->errors()
            ],400);
        }  
        $roomValidator = Validator::make(['rooms' => $rooms], [
            'rooms' => 'required|array|min:1',
            'rooms.*.name' => 'required|string',
            'rooms.*.area' => 'required|numeric',
            'rooms.*.room_count' => 'numeric',
            'rooms.*.room_rule' => 'string',
            'rooms.*.convenient' => 'array',
            'rooms.*.price_per_night' => 'required|numeric',
            'rooms.*.guest_count' => 'required|numeric',
            'rooms.*.arrayConve' => 'array',
            'rooms.*.images' => 'array',
            'rooms.*.images.*' => 'string',
            'rooms.*.view_room' => 'string',
            'rooms.*.description' => 'nullable|string',
        ]);
        if($roomValidator->fails()){
            var_dump('dump');
            return response()->json([
                'status' => 400,
                'error' => $roomValidator->errors()
            ],400);
        }
            $input_hotel = $validatorHotel->validated();
            $input_rooms= $roomValidator->validated();
            try {
                \DB::beginTransaction();
                $hotel = Hotel::create($input_hotel); // Pass validated input to create a hotel.
                // Create associated rooms
                foreach ($input_rooms['rooms'] as $roomData) {
                    $hotel->rooms()->create($roomData);
                }
                  // Commit the transaction
                \DB::commit();
                return response()->json([
                    'status' => 200,
                    'message' => 'Hotel created successfully.',
                    'data' => $hotel->load('rooms'),
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 500,
                    'error' => 'Failed to create hotel: ' . $e->getMessage(),
                ], 500);
            }
    }
}
