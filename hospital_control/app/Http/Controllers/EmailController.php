<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\SendBookingConfirm;
use Illuminate\Support\Facades\Mail;
use App\Models\Booking;

class EmailController extends Controller
{
    //
    public function sendBookingConfirm(Request $request)
{
    // Validate the input (you can add more fields to validate)
    $request->validate([
        'booking_id' => 'required|integer',
    ]);
    $booking = Booking::find($request->booking_id);
    if (!$booking) {
        return response()->json(['message' => 'Booking not found.'], 404);
    }

    // Send the email
    Mail::to($booking->email) // Replace with the user's email
    ->send(new SendBookingConfirm($booking));

return response()->json(['message' => 'Booking confirmation email sent successfully.']);
}
}
