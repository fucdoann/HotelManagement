<?php

namespace App\Http\Controllers\PaymentController;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use Carbon\Carbon;
use App\Models\Payment;

class PaymentController extends Controller
{
    //
    public function getListPayment(Request $request){
        $adminId = $request->user()->id; // Assuming admin_id comes from the request

        $payments = Payment::query()
            ->select('bookings.name as booking_name', 'payments.*', 'hotels.name as hotel_name')
            ->join('bookings', 'bookings.booking_id', '=', 'payments.booking_id')
            ->join('rooms', 'rooms.room_id', '=', 'bookings.room_id')
            ->join('hotels', 'hotels.hotel_id', '=', 'rooms.hotel_id')
            ->where('hotels.admin_id', $adminId)
            ->get();
            return response()->json([
                'status' => 200,
                'data' => $payments
            ]);
    }
    public function getListPaymentSuccess(Request $request){
        $user_id = $request->user()->id; // Assuming admin_id comes from the request
        $payments = Payment::where('status', 'confirmed')
            ->whereHas('booking', function ($query) use ($user_id) {
                $query->where('user_id', $user_id);
            })
            ->get();
        $totalAmount = $payments->sum('amount');
            return response()->json([
                'status' => 200,
                'data' => $payments,
                'amount' => $totalAmount
            ]);


    }
    


}
