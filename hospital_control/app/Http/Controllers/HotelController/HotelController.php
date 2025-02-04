<?php

namespace App\Http\Controllers\HotelController;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Hotel;
use App\Models\Room;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class HotelController extends Controller
{
    public function getHotel(Request $request){
        $path = resource_path('json/vietnam.json');
        $hotel_id = $request->input('hotel_id');
        $hotel = Hotel::where('hotel_id', $hotel_id)->first();
        $jsonData = json_decode(file_get_contents($path),true);
        if(!file_exists($path)){
            return response()->json([
                'error' => 'Data not found'
            ], 404);
        }
        $provinceMap = [];
        if($hotel->commune != 0){
            // var_dump($jsonProvince);
            foreach ($jsonData['province'] as $commune) {
                $provinceMap[$commune['idCommune']] = $commune['name'];
            }
                $key = str_pad($hotel->commune, 3, "0", STR_PAD_LEFT);
                $hotel->location = $provinceMap[$key];
                return response()->json([
                    'status' => 200,
                    'hotel' => $hotel,
                ]);
        }
        elseif(
            $hotel->district != 0){
            foreach ($jsonData['district'] as $district) {
                $provinceMap[$district['idDistrict']] = $district['name'];
            }
                $key = str_pad($hotel->district, 3, "0", STR_PAD_LEFT);
                $hotel->location = $provinceMap[$key];
                return response()->json([
                    'status' => 200,
                    'hotel' => $hotel,
                ]);
        }
        else{
            foreach ($jsonData['province'] as $province) {
                $provinceMap[$province['idProvince']] = $province['name'];
            }
                $key = str_pad($hotel->province, 3, "0", STR_PAD_LEFT);
                $hotel->location = $provinceMap[$key];
                return response()->json([
                    'status' => 200,
                    'hotel' => $hotel,
                ]);
        }
    }
    //
    public function getAvailableHotels(Request $request)
    {
        $checkInDate = $request->input('check_in_date');
        $checkOutDate = $request->input('check_out_date');
        $commune = $request->input('commune', 0);
        $district = $request->input('district', 0);
        $province = $request->input('province', 0);
        $guestCount = $request->input('guest_count', 1);
        $filters = $request ->input('filters');
        // Verify input
        $validator = Validator::make($request->all( ),[
            'check_in_date' => 'required',
            'check_out_date' => 'required',
            'province' => 'required',
            'guest_count' => 'required',
            // 'phone' => phone|unique:users
        ]);
        if($validator->fails()){
            return response()->json([
                'status' => 401,
                'error' => $validator->errors()
            ],402);
        }
        if($checkInDate > $checkOutDate){
            return response()->json([
                'status' => 401,
                'error' => 'Checkout date need to after checkin date'
            ]);
        }
        // Query Builder
        $minRooms = $request->input('rooms'); // The required number of rooms
        $hotels = \App\Models\Hotel::query()
            ->from('hotels as h')
            ->join('rooms as r', 'h.hotel_id', '=', 'r.hotel_id')
            ->leftJoin('bookings as b', function ($join) use ($checkInDate, $checkOutDate) {
                $join->on('r.room_id', '=', 'b.room_id')
                    ->where('b.check_in_date', '<', $checkOutDate)
                    ->where('b.check_out_date', '>', $checkInDate);
            })
            ->select(
                'h.hotel_id',
                'h.name',
                'h.district',
                'h.province',
                'h.commune',
                'h.star_rating',
                'h.min_price',
                'h.images',
                'h.description',
                'h.hot_conve',
                'h.convenients',
                'h.pay_rule',
                DB::raw('COALESCE(SUM(r.room_count) - SUM(b.room_count), SUM(r.room_count)) as available_rooms')
            )
            ->where('r.guest_count','>=', $guestCount);
            if($filters['pay_rule'] !== 0){
                $hotels->where('h.pay_rule', '=', $filters['pay_rule']);
            }
            // Add condition for h.convenients containing all conveniences
            if (!empty($filters['conveniences'])) {
                foreach ($filters['conveniences'] as $convenience) {
                    $hotels->whereJsonContains('h.convenients', $convenience);
                }
            }
        // Conditional filtering logic
            if ($commune != 0) {
                $hotels->where('h.commune', '=', $commune); // Filter by commune
            } elseif ($district != 0) {
                $hotels->where('h.district', '=', $district); // Filter by district
            } elseif ($province != 0) {
                $hotels->where('h.province', '=', $province); // Filter by province
            }
            $hotels = $hotels
            ->groupBy('h.hotel_id', 'h.name','h.district','h.province','h.commune','h.star_rating','h.min_price','h.images','h.description','h.hot_conve','h.convenients','h.pay_rule')
            ->havingRaw('available_rooms >= ?', [$minRooms]) // Ensure there are enough available rooms
            ->get()
            ->toArray();
        $path = resource_path('json/vietnam.json');
        if(!file_exists($path)){
            return response()->json([
                'error' => 'Data not found'
            ], 404);
        }
        $jsonData = json_decode(file_get_contents($path),true);
        $jsonProvince = $jsonData['province'];
        // var_dump($jsonProvince);
        $provinceMap = [];
        foreach ($jsonProvince as $province) {
            $provinceMap[$province['idProvince']] = $province['name'];
        }
        // var_dump($hotels[0]);
        // Step 2: Add province name to each hotel
        $hotelsWithProvinceName = array_map(function ($hotel) use ($provinceMap) {
            if (isset($provinceMap[$hotel['province']])) {
                $hotel['provinceName'] = $provinceMap[$hotel['province']];
            } else {
                $hotel['provinceName'] = 'Việt Nam'; // Fallback if no match found
            }
            return $hotel;
        }, $hotels);
        // Return the result as JSON
        return response()->json([
            'status' => 200,
            'data' => $hotelsWithProvinceName
        ]);
    }

    public function getListRoom(Request $request){
        $hotel_id = $request->input('hotel_id');
        $rooms = Room::where('hotel_id', $hotel_id)->get(['room_id', 'name', 'guest_count', 'price_per_night']);
        return response()->json([
            'status' => 200,
            'rooms' => $rooms
        ]);
    }
    public function getTopRateHotel(Request $request){
        $hotels = Hotel::select('hotel_id','name', 'province', 'star_rating', 'convenients','images')
        ->orderBy('star_rating', 'DESC')
        ->take(3) // Limit to top 3
        ->get()
        ->toArray();
        $path = resource_path('json/vietnam.json');
        if(!file_exists($path)){
            return response()->json([
                'error' => 'Data not found'
            ], 404);
        }
        $jsonData = json_decode(file_get_contents($path),true);
        $jsonProvince = $jsonData['province'];
        // var_dump($jsonProvince);
        $provinceMap = [];
        foreach ($jsonProvince as $province) {
            $provinceMap[$province['idProvince']] = $province['name'];
        }
        // var_dump($hotels[0]);
        // Step 2: Add province name to each hotel
        $hotelsWithProvinceName = array_map(function ($hotel) use ($provinceMap) {
            if (isset($provinceMap[$hotel['province']])) {
                $hotel['provinceName'] = $provinceMap[$hotel['province']];
            } else {
                $hotel['provinceName'] = 'Việt Nam'; // Fallback if no match found
            }
            return $hotel;
        }, $hotels);
        return response()->json([
            'status' => 201,
            'hotel' => $hotelsWithProvinceName
        ]);
    }

    public function getHotelAndRoom(Request $request){
        $path = resource_path('json/vietnam.json');
        $hotel_id = $request->input('hotel_id');
        $hotel = Hotel::where('hotel_id', $hotel_id)->first();
        $rooms = Room::where('hotel_id', $hotel_id)->get();
        $rooms = Room::where('hotel_id', $hotel_id)->get();
        $jsonData = json_decode(file_get_contents($path),true);
        if(!file_exists($path)){
            return response()->json([
                'error' => 'Data not found'
            ], 404);
        }
        $provinceMap = [];
        if($hotel->commune != 0){
            // var_dump($jsonProvince);
            foreach ($jsonData['province'] as $commune) {
                $provinceMap[$commune['idCommune']] = $commune['name'];
            }
                $key = str_pad($hotel->commune, 3, "0", STR_PAD_LEFT);
                $hotel->location = $provinceMap[$key];
                return response()->json([
                    'status' => 200,
                    'hotel' => $hotel,
                    'rooms' => $rooms
                ]);
        }
        elseif(
            $hotel->district != 0){
            foreach ($jsonData['district'] as $district) {
                $provinceMap[$district['idDistrict']] = $district['name'];
            }
                $key = str_pad($hotel->district, 3, "0", STR_PAD_LEFT);
                $hotel->location = $provinceMap[$key];
                return response()->json([
                    'status' => 200,
                    'hotel' => $hotel,
                    'rooms' => $rooms
                ]);
        }
        else{
            foreach ($jsonData['province'] as $province) {
                $provinceMap[$province['idProvince']] = $province['name'];
            }
                $key = str_pad($hotel->province, 3, "0", STR_PAD_LEFT);
                $hotel->location = $provinceMap[$key];
                return response()->json([
                    'status' => 200,
                    'hotel' => $hotel,
                    'rooms' => $rooms
                ]);
        }
    }

    public function getListHotelDashboard(Request $request){
        $admin = $request->user();
        if($admin->role == 'user'){
            return response()->json([
                'status' => 400,
                'error' => 'Auth api errors'
            ],400);
        }
        $hotels = Hotel::query()
            ->from('hotels as h')
            ->join('rooms as r', 'h.hotel_id', '=', 'r.hotel_id')
            ->where('admin_id', $admin->id)
            ->select('h.min_price', 'h.name', 'h.images','h.description', DB::raw('COUNT(r.room_id) as room_count'))
            ->groupBy('h.min_price', 'h.name', 'h.images','h.description')
            ->get();
        return response()->json([
            'status' => 200,
            'message' => 'Get hotel successfully.',
            'data' => $hotels,
        ]);
    }
    

}
