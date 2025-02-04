<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Message;
use  App\Events\MessageSent;

class ChatController extends Controller
{
    //
    public function getListId(Request $request){
        $user =$request->user();
        $userId = $user->id;
        if(trim($user->role) === "user"){

            $adminIds = DB::table('bookings')
            ->join('rooms', 'bookings.room_id', '=', 'rooms.room_id')
            ->join('hotels', 'rooms.hotel_id', '=', 'hotels.hotel_id')
            ->join('users', 'hotels.admin_id', '=', 'users.id')
            ->leftJoin('messages', function ($join) use ($userId) {
                $join->on('messages.sender_id', '=', 'users.id')
                    ->where('messages.receiver_id', $userId)
                    ->orOn('messages.receiver_id', '=', 'users.id')
                    ->where('messages.sender_id', $userId);
            })
            ->where('bookings.user_id', $userId)
            ->select(
                'hotels.admin_id as user_id',
                'users.name as user_name',
                DB::raw('MAX(messages.created_at) as last_message_time'),
                DB::raw('MAX(messages.message) as last_message')
            )
            ->groupBy('hotels.admin_id', 'users.name')
            ->distinct()
            ->get()
            ->map(function ($item) {
                $item->last_message_time = $item->last_message_time 
                    ? Carbon::parse($item->last_message_time)->diffForHumans() 
                    : null;
                return $item;
            });
            return response()->json([
                'status' => 201,
                'data' => $adminIds,
                'type' => 'user',
            ]);
        }
        $adminIds = DB::table('bookings')
            ->join('rooms', 'bookings.room_id', '=', 'rooms.room_id')
            ->join('hotels', 'rooms.hotel_id', '=', 'hotels.hotel_id')
            ->join('users', 'bookings.user_id', '=', 'users.id')
            ->leftJoin('messages', function ($join) use ($userId) {
                $join->on('messages.sender_id', '=', 'users.id')
                    ->where('messages.receiver_id', $userId)
                    ->orOn('messages.receiver_id', '=', 'users.id')
                    ->where('messages.sender_id', $userId);
            })
            ->where('hotels.admin_id', $userId)
            ->select(
                'users.id as user_id',
                'users.name as user_name',
                DB::raw('MAX(messages.created_at) as last_message_time'),
                DB::raw('MAX(messages.message) as last_message')
            )
            ->groupBy('users.id', 'users.name')
            ->distinct()
            ->get()
            ->map(function ($item) {
                $item->last_message_time = $item->last_message_time 
                    ? Carbon::parse($item->last_message_time)->diffForHumans() 
                    : null;
                return $item;
            });
            return response()->json([
                'status' => 201,
                'data' => $adminIds,
                'type' => 'admin'
            ]);
    }
    public function getMessages(Request $request){
        $currentUserId = $request->user()->id;
        $userId = $request->input('user_id');
        $messages = Message::where(function ($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $currentUserId)
                  ->where('receiver_id', $userId);
        })->orWhere(function ($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $userId)
                  ->where('receiver_id', $currentUserId);
        })->orderBy('created_at', 'asc')->get();
        $messages = $messages->map(function ($message) {
            $message->time_sent = Carbon::parse($message->created_at)->diffForHumans();
        return $message;
        });
        return response()->json($messages);
    }
    public function sendMessages(Request $request)
{
    $request->validate([
        'message' => 'required|string',
        'receiver_id' => 'required|integer',
    ]);

    $message = Message::create([
        'message' => $request->message,
        'sender_id' => $request->user()->id,
        'receiver_id' => $request->receiver_id,
    ]);

    broadcast(new MessageSent($message->message, $message->sender_id, $message->receiver_id))->toOthers();

    return response()->json(['status' => 'Message sent!', 'message' => $message]);
}
}
