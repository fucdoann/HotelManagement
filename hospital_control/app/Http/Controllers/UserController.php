<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Booking;
use App\Models\Convenient;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UserController extends Controller
{
    //
    public function index(){

    }
    // 
    public function changeUser(Request $request){
        $user = $request->user();
        $user->update([
            'name' => $request->input('name'),
            'user_phone' => $request->input('user_phone'),
            'address' => $request->input('address'),
        ]);
        return response()->json([
            'status' => 200,
            'user' => $user
        ]);
    }
    public function getDashBoard(Request $request){
        $user = $request->user();
        $admin_id = $user->id;
          // Lấy khoảng thời gian của tuần hiện tại và tuần trước
        $currentWeekStart = Carbon::now()->startOfWeek();
        $currentWeekEnd = Carbon::now()->endOfWeek();
        $lastWeekStart = Carbon::now()->subWeek()->startOfWeek();
        $lastWeekEnd = Carbon::now()->subWeek()->endOfWeek();
        $payments = Payment::query()
        ->join('bookings', 'bookings.booking_id', '=', 'payments.booking_id')
        ->join('rooms', 'rooms.room_id', '=', 'bookings.room_id')
        ->join('hotels', 'hotels.hotel_id', '=', 'rooms.hotel_id')
        ->where('hotels.admin_id', $admin_id)
        ->where('payments.status', '=', 'confirmed');

        $totalPaymentAmount = (clone $payments)
        ->sum('payments.amount');
        $totalPaymentAmount = number_format($totalPaymentAmount, 0, ',', '.') . ' VND';
        $currentWeekTotal = (clone $payments)
        ->whereBetween('payments.created_at', [$currentWeekStart, $currentWeekEnd])
        ->sum('payments.amount');

    // Tổng payment tuần trước
    $lastWeekTotal = (clone $payments)
        ->whereBetween('payments.created_at', [$lastWeekStart, $lastWeekEnd])
        ->sum('payments.amount');

    // So sánh tổng payment
    $difference = $currentWeekTotal - $lastWeekTotal;
    $percentageChange = $lastWeekTotal > 0 ? ($difference / $lastWeekTotal) * 100 : 0;

    $booking = Booking::query()
    ->join('rooms', 'rooms.room_id', '=', 'bookings.room_id')
    ->join('hotels', 'hotels.hotel_id', '=', 'rooms.hotel_id')
    ->where('hotels.admin_id', $admin_id);
    // Fetch total users with user_id != 0
    $totalUsersWithUserId =(clone $booking)
        ->where('bookings.user_id', '!=', 0)
        ->distinct()
        ->count('bookings.user_id');

    // Fetch total users with user_id = 0
    $totalUsersWithoutUserId = (clone $booking)
        ->where('bookings.user_id', '=', 0)
        ->count();
    // Fetch total booking
    $totalBookings = (clone $booking)
    ->count();
    $currentWeekBooking = (clone $booking)
    ->whereBetween('bookings.created_at', [$currentWeekStart, $currentWeekEnd])
    ->count();

    // Tổng payment tuần trước
    $lastWeekBooking = (clone $payments)
        ->whereBetween('bookings.created_at', [$lastWeekStart, $lastWeekEnd])
        ->count();

    // So sánh tổng payment
    $differenceBooking = $currentWeekBooking - $lastWeekBooking;
    $percentageChangeBooking = $lastWeekBooking > 0 ? ($differenceBooking / $lastWeekBooking) * 100 : 0;
    // Return the results
    return response()->json([
        'total_payment_amount' => $totalPaymentAmount,
        'total_users_with_user_id' => $totalUsersWithUserId,
        'total_users_without_user_id' => $totalUsersWithoutUserId,
        'total_bookings' => $totalBookings,
        'percentageChange' => $percentageChange,
        'percentageChangeBooking' => $percentageChangeBooking
    ]);
    }
}
