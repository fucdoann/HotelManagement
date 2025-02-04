<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\BookingUpdate;
use App\Models\Payment;

class UpdatePaymentOnBooking
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
    public function handle(BookingUpdate $event):void
    {
        //
        $booking_id = $event->booking->booking_id;
        $status = $event->booking->status;
        $payment = Payment::where('booking_id', $booking_id)->first();
        if($status == "Paying"){
            $status = "pending";
        }
        elseif($status == "Confirmed"){
            $status = "confirmed";
        }   
        else{
            $status = "canceled";
        }
        $payment->status = $status;
        $payment->save();
    }
}
