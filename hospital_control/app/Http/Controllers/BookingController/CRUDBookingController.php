<?php

namespace App\Http\Controllers\BookingController;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use  App\Events\BookingUpdate;


class CRUDBookingController extends Controller
{
    //
    public function delete(Request $request){
        $booking_id = $request->input('booking_id');
        $booking = Booking::where('booking_id', $booking_id)->first();
        if($booking == null){
            return response()->json([
                'status' => 400,
                'error' => 'Auth api errors'
            ],400);
        }
        $booking->delete();
        return response()->json([
            'status' => 200,
            'message' => 'Delete booking successfully.',
        ]);
    }
    public function updateStatus(Request $request){
        $booking_id = $request->input('booking_id');
        $status = $request->input('status');
        $booking = Booking::where('booking_id', $booking_id)->first();
        if($booking == null){
            return response()->json([
                'status' => 400,
                'error' => 'Auth api errors'
            ],400);
        }
        $booking->status = $status;
        $booking->save();
        event(new BookingUpdate($booking));
        return response()->json([
            'status' => 200,
            'message' => $status.' booking successfully.',
        ]);
       

}
}
