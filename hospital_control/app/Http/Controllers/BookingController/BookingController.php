<?php

namespace App\Http\Controllers\BookingController;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use Carbon\Carbon;
use App\Models\Payment;
use App\Models\Room;
use App\Models\Hotel;
use  App\Events\BookingCreated;
use App\Mail\SendBookingConfirm;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    //
    public function createBooking(Request $request)
    {
        // Create a booking in the database
        $booking = Booking::create([
            'user_id' => $request->input('user_id'),
            'name' => $request->input('name'),
            'phone' => $request->input('phone'),
            'email' => $request->input('email'),
            'room_id' => $request->input('room_id'),
            'room_count' => $request->input('room_count'),
            'time_checkin' => $request->input('time_checkin'),
            'request' => $request->input('request'),
            'total_price' => $request->input('total_price'),
            'check_in_date' => $request->input('check_in_date'),
            'check_out_date' => $request->input('check_out_date'),
            'status' => 'Paying',
        ]);
        // Generate VNPay payment URL
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        // $vnp_Returnurl = route('vnpay.return');
        // var_dump($vnp_Returnurl);
         $vnp_Returnurl = "http://localhost:8000/vnpay/return";
        // var_dump($vnp_Returnurl);

        $vnp_TmnCode = env('VNPAY_TMN_CODE');
        $vnp_HashSecret = env('VNPAY_SECRET');
        //Expire
        $startTime = Carbon::now('Asia/Ho_Chi_Minh')->format('YmdHis');          
        $expire = Carbon::now('Asia/Ho_Chi_Minh')->addMinutes(20)->format('YmdHis'); // Expire time
        // vnp
        $vnp_TxnRef = $booking->booking_id; // Transaction ID (use booking ID)
        $vnp_Amount = $booking->total_price * 100; // Amount in VND
        $vnp_OrderInfo = "Payment for booking ID: " . $booking->booking_id;

        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => $startTime,
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $request->ip(),
            "vnp_Locale" => "vn",
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => "other",
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
            "vnp_ExpireDate"=>$expire
        ];

        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . "&";
        }
        $vnp_Url = $vnp_Url . "?" . $query;
        $vnp_SecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
        $vnp_Url .= 'vnp_SecureHash=' . $vnp_SecureHash;

        $paymentUrl = $vnp_Url;

        return response()->json([
            'paymentUrl' => $paymentUrl,
            'transactionId' => $vnp_TxnRef,
        ]);
    }

    public function checkPaymentStatus(Request $request)
    {
        $transactionId = $request->input('transactionId');
        $booking = Booking::where('booking_id', $transactionId)->first();

        if (!$booking) {
            return response()->json(['status' => 'Cancelled'], 404);
        }

        return response()->json(['status' => $booking->status]);
    }

    public function createBookingOffline(Request $request){
        // Get hotel_id using room_id
        $room = Room::find($request->input('room_id'));
        // Get admin_id using hotel_id
        $admin_id = Hotel::where('hotel_id', $room->hotel_id)->value('admin_id');
        $booking = Booking::create([
            'user_id' => $request->input('user_id'),
            'name' => $request->input('name'),
            'phone' => $request->input('phone'),
            'email' => $request->input('email'),
            'room_id' => $request->input('room_id'),
            'room_count' => $request->input('room_count'),
            'time_checkin' => $request->input('time_checkin'),
            'request' => $request->input('request'),
            'total_price' => $request->input('total_price'),
            'check_in_date' => $request->input('check_in_date'),
            'check_out_date' => $request->input('check_out_date'),
            'status' => 'Paying',
        ]);
        if(!$booking){
            return response()->json([
                'status' => 404,
                'error' => 'Cant create booking'
            ],404);
        }
        $booking_id = $booking->booking_id;
        Payment::create([
            'booking_id' => $booking_id,
            'amount' => $booking->total_price
        ]);
        event(new BookingCreated($booking,$admin_id));
        // Call the email-sending API
        Mail::to($booking->email) // Replace with the user's email
        ->send(new SendBookingConfirm($booking));
        return response()->json([
            'status' => 201,
            'data' => $booking
        ]);
    }
    public function getListBooking(Request $request){
        $user_id = $request->user()->id;
        $querySearch = $request->input('querySearch');
        $bookings = Booking::with(['room.hotel'])
            ->where('user_id', $user_id)
            ->when($querySearch, function ($query) use ($querySearch) {
                $query->whereHas('room', function ($roomQuery) use ($querySearch) {
                    $roomQuery->where('name', 'LIKE', "%$querySearch%")
                        ->orWhereHas('hotel', function ($hotelQuery) use ($querySearch) {
                            $hotelQuery->where('name', 'LIKE', "%$querySearch%");
                        });
                });
            })
            ->get()
            ->map(function ($booking) {
                // var_dump($booking);
                return [
                    'booking_id' => $booking->booking_id,
                    'check_in_date' => $booking->check_in_date,
                    'check_out_date' => $booking->check_out_date,
                    'created_at' => $booking->created_at,
                    'status' => $booking->status,
                    'total_price' => $booking->total_price,
                    'room_name' => $booking->room->name,
                    'hotel_name' => $booking->room->hotel->name,
                    'room_count' => $booking->room_count,
                ];
            });
        return response()->json([
            'status' => 200,
            'data' => $bookings
        ]);
    }
    public function getListBookingAdmin(Request $request){
        $user_id = $request->user()->id;
        $querySearch = $request->input('querySearch');
        $bookings = Booking::with(['room.hotel'])
            ->whereHas('room.hotel', function ($hotelQuery) use ($user_id) {
                $hotelQuery->where('admin_id', $user_id); // Filter by admin_id
            })
            ->when($querySearch, function ($query) use ($querySearch) {
                $query->whereHas('room', function ($roomQuery) use ($querySearch) {
                    $roomQuery->where('name', 'LIKE', "%$querySearch%")
                        ->orWhereHas('hotel', function ($hotelQuery) use ($querySearch) {
                            $hotelQuery->where('name', 'LIKE', "%$querySearch%");
                        });
                });
            })
            ->get()
            ->map(function ($booking) {
                // var_dump($booking);
                return [
                    'booking_id' => $booking->booking_id,
                    'check_in_date' => $booking->check_in_date,
                    'check_out_date' => $booking->check_out_date,
                    'created_at' => $booking->created_at,
                    'status' => $booking->status,
                    'total_price' => $booking->total_price,
                    'room_name' => $booking->room->name,
                    'hotel_name' => $booking->room->hotel->name,
                    'room_count' => $booking->room_count,
                    'user_name' => $booking->name,
                    'user_email' => $booking->email,
                    'user_phone' => $booking->phone,
                    'time_check_in' => $booking->time_checkin,
                    'request' => $booking->request,


                ];
            });
        return response()->json([
            'status' => 200,
            'data' => $bookings
        ]);
    }


}
