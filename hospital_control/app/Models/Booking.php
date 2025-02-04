<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Room;
use App\Models\Payment;


class Booking extends Model
{
    use HasFactory;
    protected $primaryKey = 'booking_id';
    protected $guarded = [];
    protected $fillable = [
       'user_id',
       'name',
       'email',
       'phone',
       'room_id',
       'room_count',
       'time_checkin',
       'request',
       'check_in_date',
       'check_out_date',
       'status',
       'total_price'
    ];
    public function room()
        {
            return $this->belongsTo(Room::class,'room_id','room_id');
        }
        public function payments()
        {
            return $this->hasMany(Payment::class, 'booking_id');
        }
}
