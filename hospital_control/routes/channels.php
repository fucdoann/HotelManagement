<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
Broadcast::channel('admin.{adminId}', function ($user, $adminId) {
    // Check if the authenticated user is an admin and matches the adminId
    return $user->id == $adminId && $user->role == 'admin';  // Make sure you adjust based on your role logic
});
Broadcast::channel('private-chat.{userId1}.{userId2}', function ($user, $userId1, $userId2) {
    return in_array($user->id, [$userId1, $userId2]);
});
