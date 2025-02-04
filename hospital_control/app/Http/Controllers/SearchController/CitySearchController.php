<?php

namespace App\Http\Controllers\SearchController;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Helper\CustomFunction;

class CitySearchController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }
    //
    public function getNameWithId(Request $request){
        $path = resource_path('json/vietnam.json');
        if(!file_exists($path)){
            return response()->json([
                'error' => 'Data not found'
            ], 404);
        }
        $jsonData = json_decode(file_get_contents($path),true);
        $id = $request->input('id');
        $type = $request->input('type');
        $array_type = [
            'province' => 'idProvince',
            'district' => 'idDistrict',
            'commune' => 'idCommune'
        ];
        $result = null;   // Variable to store the result
        foreach($jsonData[$type] as $item){
            if($item[$array_type[$type]] == $id){
                $result = $item["name"];
                break; // Exit the loop once found
            }
        };
        if ($result) {
            return response()->json([
                'status' => 202,
                'name' => $result
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'name' => 'Key not found'
            ]);
        }

    }

    // 
    public function serachCity(Request $request)
    {
        $path = resource_path('json/vietnam.json');
        if(!file_exists($path)){
            return response()->json([
                'error' => 'Data not found'
            ], 404);
        }
        $jsonData = json_decode(file_get_contents($path),true);
        $final_search = [];
        $query = $request->input('query');
        $search_key = CustomFunction::normalize_utf(Str::lower($query));
        // Get city
        $result_city = array_filter($jsonData['province'], function($item) use ($search_key){
            return stripos(CustomFunction::normalize_utf($item['name']), $search_key) !== false;
        });
        // Get district
        $result_district = array_filter($jsonData['district'], function($item) use ($search_key){
            return stripos(CustomFunction::normalize_utf($item['name']), $search_key) !== false;
        });
        // Get commune
        $result_commune = array_filter($jsonData['commune'], function($item) use ($search_key){
            return stripos(CustomFunction::normalize_utf($item['name']), $search_key) !== false;
        });
        // Action with result
        if($result_city){
            $result_city = array_values($result_city);
            foreach($result_city as $key => $item){
                array_push($final_search,[
                    'idProvince' => $item['idProvince'],
                    'idDistrict' => 0,
                    'idCommune' => 0,
                    'name' => $item['name'],
                    'location' => $item['name']
            ]);
            }
    
        }
        if($result_district){
            foreach($result_district as $key => $item){
                $provinceId = $item['idProvince'];
                $province = array_filter($jsonData['province'], function ($item) use ($provinceId) {
                    return $item['idProvince'] == $provinceId;
                });
                $province = array_values($province);
                array_push($final_search,[
                    'idProvince' => $item['idProvince'],
                    'idDistrict' => $item['idDistrict'],
                    'idCommune' => 0,
                    'name' => $item['name'],
                    'location' => $province[0]['name']
            ]);
            }
        }
        if($result_commune){
            foreach($result_commune as $key => $item){
                $districtId = $item['idDistrict'];
                $district = array_filter($jsonData['district'], function ($item) use ($districtId) {
                    return $item['idDistrict'] == $districtId;
                });
                $district = array_values($district);
                $provinceId = $district[0]['idProvince'];
                $province = array_filter($jsonData['province'], function ($item) use ($provinceId) {
                    return $item['idProvince'] == $provinceId;
                });
                $province = array_values($province);
                array_push($final_search,[
                    'idProvince' => $provinceId,
                    'idDistrict' => $districtId,
                    'idCommune' => $item['idCommune'],
                    'name' => $item['name'],
                    'location' => $district[0]['name'].', '.$province[0]['name']
            ]);
            }
        }
        if($query == ''){
            $final_search = [];
        }
        return response()->json([
            'results' =>  $final_search
        ]);
        // var_dump($query);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
