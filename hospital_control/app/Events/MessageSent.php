<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $message;
    public $sender_id;
    public $receiver_id;

    public function __construct($message, $sender_id, $receiver_id)
    {
        $this->message = $message;
        $this->sender_id = $sender_id;
        $this->receiver_id = $receiver_id;
    }

    public function broadcastOn()
    {
        $sortedIds = [$this->sender_id, $this->receiver_id];
        sort($sortedIds);
        return new Channel('chat.' . $sortedIds[0] . '.' . $sortedIds[1]);
    }

    public function broadcastAs()
    {
        return 'message.sent';
    }
}

?>