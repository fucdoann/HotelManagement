<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    use HasFactory;
    protected $primaryKey = 'hotel_id';
    // Modify array to database
    protected $casts = [
        'convenients' => 'array',
        'images' => 'array',
        "hot_conve" => 'array',
    ];
    // fillable
    protected $fillable = [
        'admin_id',
        'name', 	
        'type', 	
        'address', 	
        'commune', 	
        'district', 	
        'province',
        'zip_code',
        'star_rating',
        'min_price', 	
        'description',
        'convenients',
        'images',
        'contact_number',
        'hot_conve',
        'checkin_rule',
        'checkout_rule',
        'pay_rule',
        'hotel_rule',
    ];
    public function rooms()
    {
        return $this->hasMany(Room::class, 'hotel_id');
    }
}
