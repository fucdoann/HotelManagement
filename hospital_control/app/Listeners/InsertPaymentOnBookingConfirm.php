<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\BookingConfirmed;
use App\Models\Payment;

class InsertPaymentOnBookingConfirm
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle(BookingConfirmed $event):void
    {
        //
        Payment::create([
            'booking_id' => $event->booking->booking_id,
            'amount' => $event->booking->total_price, // Adjust based on your booking model
            'status' => 'confirmed', // Default status for payment
        ]);
    }
}
