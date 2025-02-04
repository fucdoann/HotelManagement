<?php

namespace App\Http\Controllers\ConvenientController;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Convenient;

class ConvenientController extends Controller
{
    //
    public function getConve(Request $request){
        $arrayConve = $request->input('arrayConve');
        $type = $request->input('type');
        $convenients = Convenient::whereIn('id',$arrayConve)
                                ->where('type',$type)
                                ->get();
        return response()->json([
            'status' => 202,
            'data' => $convenients
        ]);


    }

    public function getFullConveHotel(Request $request){
        $convenients = Convenient::where('type','hotel')->get();
        return response()->json([
            'status' => 202,
            'data' => $convenients
        ]);
    }
}
