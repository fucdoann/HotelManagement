<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Convenient;


class ConvenientsController extends Controller
{
    //
    public function getConvenients(Request $request){
        $type = $request->input('type');
        $convenient = Convenient::where('type',$type)->get();
        return response()->json([
            'status' => 200,
            'error' => "success",
            'convenient' => $convenient,
        ]);
    }
}
