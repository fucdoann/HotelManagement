<?php

namespace App\Http\Controllers\HotelController;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Hotel;
use App\Models\Room;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RoomController extends Controller
{
    public function index(){

    }
    public function store(){

    }
    public function getRoom(Request $request){
        $room_id = $request->input('room_id');
        $room = Room::where('room_id',$room_id)->get();
        return response()->json([
            'status' => 202,
            'data' => $room[0],
        ]);
    }
    //
    public function getAvailableRooms(Request $request){
        $validator = Validator::make($request->all(), [
            'check_in_date' => [
                'required',
                'integer', // Ensures the value is a valid timestamp
                function ($attribute, $value, $fail) {
                    $now = Carbon::now()->timestamp;
                    if ($value < $now) {
                        $fail('The check-in date must be today or later.');
                    }
                },
            ],
            'check_out_date' => [
                'required',
                'integer', // Ensures the value is a valid timestamp
                function ($attribute, $value, $fail) use ($request) {
                    $checkInDate = $request->input('check_in_date');
                    if ($checkInDate && $value <= $checkInDate) {
                        $fail('The check-out date must be after the check-in date.');
                    }
                },
            ],
            'guest_count' => 'required|integer|min:1',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        // Dynamically fetch all column names for room_types
        $columns = DB::getSchemaBuilder()->getColumnListing('rooms');
        $checkInDate = $request->input('check_in_date');
        $checkOutDate = $request->input('check_out_date');
        $guestCount = $request->input('guest_count', 1);
        $hotelId = $request->input('hotel_id');
        $roomTypes = 
        Room::query()
            ->from('rooms as r')
        ->leftJoin('bookings as b', function ($join) use ($checkInDate, $checkOutDate) {
            $join->on('r.room_id', '=', 'b.room_id')
                ->where('b.check_in_date', '<', $checkOutDate)
                ->where('b.check_out_date', '>', $checkInDate);
        })
        ->select(
            'r.*',
            DB::raw('COALESCE(r.room_count - SUM(b.room_count), r.room_count) as available_rooms')
        )
        ->where('r.hotel_id', $hotelId)
        ->where('r.guest_count','>=', $guestCount)
        ->groupBy(...$columns)
        ->havingRaw('available_rooms > 0')
        ->get();

    return response()->json([
        'status' => 202,
        'data' => $roomTypes
    ]);

    }
}
