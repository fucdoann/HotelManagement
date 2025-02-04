<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;
    protected $primaryKey = 'room_id';
    protected $fillable = [
        'hotel_id',
        'name',
        'guest_count',
        'area',
        'big_bed_count',
        'small_bed_count',
        'bed_count',
        'wc_count',
        'kitchen_count',
        'living_room_count',
        'price_per_night',
        'price_per_morning',
        'description',
        'convenient',
        'arrayConve',
        'images',
        'status',
        'room_count',
        'room_rule'
    ];
    protected $casts = [
        'arrayConve' => 'array',
        'images' => 'array',
        'convenient' => 'array',

    ];
    public function hotel(){
        return $this->belongsTo(Hotel::class,'hotel_id','hotel_id');
    }
    
}
