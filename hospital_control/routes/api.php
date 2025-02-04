<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ConvenientsController;
use App\Http\Controllers\HotelController\CRUDHotelController;
use App\Http\Controllers\HotelController\HotelController;
use App\Http\Controllers\HotelController\RoomController;
use App\Http\Controllers\ConvenientController\ConvenientController;
use App\Http\Controllers\SearchController\CitySearchController;
use App\Http\Controllers\PaymentController\VNPayController;
use App\Http\Controllers\PaymentController\PaymentController;
use App\Http\Controllers\BookingController\BookingController;
use App\Http\Controllers\BookingController\CRUDBookingController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Model\User;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/register',[AuthController::class, 'register']);
Route::post('/login',[AuthController::class, 'login']);
// Api with auth token
Route::middleware(['auth:sanctum'])->group(function(){
    Route::get('/user',[AuthController::class,'user']);
    Route::post('/logout',[AuthController::class, 'logout']);
    Route::post('/storeHotelImage',[ImageController::class, 'storeHotelImage']);
    Route::post('/storeRoomImage',[ImageController::class, 'storeRoomImage']);
    Route::post('/storeHotel',[CRUDHotelController::class, 'storeHotel']);
    Route::post('/changeuser',[UserController::class,'changeUser']);
    Route::post('/getDashBoard',[UserController::class,'getDashBoard']);
    Route::post('/getListBooking', [BookingController::class, 'getListBooking']);
    Route::post('/getListBookingAdmin', [BookingController::class, 'getListBookingAdmin']);

    Route::post('/getListHotel',[CRUDHotelController::class, 'index']);
    Route::post('/hotel/delete',[CRUDHotelController::class, 'delete']);
    Route::post('/hotel/active',[CRUDHotelController::class, 'active']);
    Route::post('/getListPayments', [PaymentController::class, 'getListPayment']);
    Route::post('/getListPaymentSuccess', [PaymentController::class, 'getListPaymentSuccess']);
    Route::post('/hotel/getHotelAndRoom',[HotelController::class, 'getHotelAndRoom']);
    Route::post('/booking/delete',[CRUDBookingController::class, 'delete']);
    Route::post('/booking/update',[CRUDBookingController::class, 'updateStatus']);
    Route::post('/getListHotelDashboard',[HotelController::class, 'getListHotelDashboard']);
    Route::post('/getListChatId',[ChatController::class, 'getListId']);
    Route::post('/messages', [ChatController::class, 'getMessages']);
    Route::post('/sendmessage', [ChatController::class, 'sendMessages']);

});
//API for frontend
Route::post('/detailHotel',[HotelController::class, 'getHotel']);
Route::post('/hotel_search',[HotelController::class, 'getAvailableHotels']);
Route::post('/getAvailableRooms',[RoomController::class, 'getAvailableRooms']);
Route::post('/getListRoom',[HotelController::class, 'getListRoom']);
Route::post('/getConve',[ConvenientController::class, 'getConve']);
Route::post('/getFullConve',[ConvenientController::class, 'getFullConveHotel']);

Route::post('/getRoom',[RoomController::class, 'getRoom']);
Route::post('/getConvenients',[ConvenientsController::class, 'getConvenients']);
Route::post('/getTopHotels',[HotelController::class, 'getTopRateHotel']);


// Booking API Routes
Route::post('/bookings', [BookingController::class, 'createBooking']);
Route::post('/booking_offline', [BookingController::class, 'createBookingOffline']);
Route::get('/bookings/payment-status', [BookingController::class, 'checkPaymentStatus']);
// Route::get('/vnpay/return', [VNPayController::class, 'handleReturn'])->name('vnpay.return');
Route::post('/confirm_booking', [EmailController::class, 'sendBookingConfirm']);
// VNPay Return Route
// Search bar
Route::post('/city_search',[CitySearchController::class, 'serachCity']);
Route::post('/name_search',[CitySearchController::class, 'getNameWithId']);
//Verify email
// Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
//     $request->fulfill();
//     return redirect('http://localhost:3000/login'); // Redirect to the frontend
//     // return null;
// })->middleware(['auth:sanctum', 'signed'])->name('verification.verify');
