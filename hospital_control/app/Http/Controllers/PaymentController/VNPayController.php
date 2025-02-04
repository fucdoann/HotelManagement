<?php

namespace App\Http\Controllers\PaymentController;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Booking;
use App\Events\BookingConfirmed;
use App\Events\BookingCreated;


class VNPayController extends Controller
{
    //
    public function handleReturn(Request $request)
    {   
        $isValid = $this->verifyVNPayData($request->all());
        $status = 'failed';
        if ($isValid) {
            $booking = Booking::where('booking_id', $request->input('vnp_TxnRef'))->first();
            if ($request->input('vnp_ResponseCode') === '00') {
                $booking->update(['status' => 'Confirmed']);
                event(new BookingConfirmed($booking));
                event(new BookingCreated($booking));
            } else {
                $booking->update(['status' => 'Cancelled']);
            }
            $status = $booking->status;
        }
        // var_dump([
        //     'status' => $status,
        //     'vnp_TxnRef' => $request->input('vnp_TxnRef'),
        //     'amount' => $booking->total_price,
        //     'vnp_OrderInfo' => $request->input('vnp_OrderInfo'),
        //     'vnp_TransactionNo' => $request->input('vnp_TransactionNo'),
        //     'vnp_BankCode' => $request->input('vnp_BankCode'),
        //     'vnp_PayDate' => $request->input('vnp_PayDate')
        // ]);
        // return response()->json([
        //     'status' => 201,
        //     'data' => $isValid
        // ]);
        return view('vnpay_return', [
            'status' => $status,
            'vnp_TxnRef' => $request->input('vnp_TxnRef'),
            'amount' => $booking->total_price,
            'vnp_OrderInfo' => $request->input('vnp_OrderInfo'),
            'vnp_TransactionNo' => $request->input('vnp_TransactionNo'),
            'vnp_BankCode' => $request->input('vnp_BankCode'),
            'vnp_PayDate' => $request->input('vnp_PayDate')
        ]);
    }

    private function verifyVNPayData($data)
    {
        $vnp_HashSecret = env('VNPAY_SECRET');
        $vnp_SecureHash = $data['vnp_SecureHash'];
        unset($data['vnp_SecureHash']);
        ksort($data);
        $hashData = "";
        $i = 0;
        foreach ($data as $key => $value) {
            if ($i == 1) {
                $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData = $hashData . urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }
        // $hashData = http_build_query($data);
        $calculatedHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
        return $calculatedHash === $vnp_SecureHash;
    }
}
