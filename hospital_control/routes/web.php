<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController\VNPayController;
use BeyondCode\LaravelWebsockets\Facades\WebSocketRouter;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use App\Http\Controllers\AuthController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/vnpay/return', [VNPayController::class, 'handleReturn'])->name('vnpay.return');
Route::get('/', function () {
    return view('welcome');
});
Route::get('/broadcasting/auth', function (Illuminate\Http\Request $request) {
    return Broadcast::auth($request);
});

Route::get('/email/verify/{id}/{hash}', function ($id, $hash) {
    // Find the user
    $user = User::findOrFail($id);

    // Check if the hash matches
    if (! hash_equals($hash, sha1($user->getEmailForVerification()))) {
        abort(403, 'Invalid verification link.');
    }

    // If the email is already verified, redirect them
    if ($user->hasVerifiedEmail()) {
        return redirect('http://localhost:3000/login');  // Redirect to the frontend login page
    }

    // Mark the email as verified
    $user->markEmailAsVerified();

    // Trigger the event for email verified
    event(new Verified($user));

    // Redirect to the frontend login page
    return redirect('http://localhost:3000/login');  // Redirect to the frontend login page
})->middleware(['signed'])->name('verification.verify');
// WebSocketRouter::webSocket('/laravel-websockets', \App\WebSockets\DashboardWebSocketHandler::class);
