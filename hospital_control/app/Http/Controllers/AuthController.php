<?php

namespace App\Http\Controllers;

use App\Http\Request\SignupRequest;
use App\Http\Request\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;

class AuthController extends Controller
{
    //
    public function signup(SignupRequest $request){
        
    }
    
    public function login(Request $request){
        $validator = Validator::make($request->all( ),[
            'email' => 'required',
            'password' => 'required',
            // 'phone' => phone|unique:users
        ]);
        if($validator->fails()){
            return response()->json([
                'status' => 401,
                'error' => $validator->errors()
            ],402);
        }
        else{
            $credentials = request(['email', 'password']);
            if (!Auth::attempt($credentials)) {
                return response()->json([
                    'status_code' => 500,
                    'message' => 'Unauthorized'
                ]);
            }
            $user = Auth::user();
                if (!$user) {
                    return response()->json(['message' => 'Unauthenticated'], 401);
                }
                try{
                    $token = $user->createToken('authToken')->plainTextToken;
                }
                catch(error){
                    return response()->json([
                        'status_code' => 402,
                        'message' => 'Token create fail'
                    ]);
                }
                return response()->json([
                    'status_code' => 201,
                    'access_token' => $token,
                    'role' => $user->role,
                    'user' => $user,
                    'message' => 'Success'
                ]);
            
        }
    }
    public function register(Request $request){
        $validator = Validator::make($request->all( ),[
            'email' => 'required|email|unique:users',
            'password' => 'required',
            'user_phone' => 'required|unique:users'
        ]);
        if($validator->fails()){
            return response()->json([
                'status' => 400,
                'error' => $validator->errors()
            ],400);
        }
        else{
            $input = $request->all();
            $input['password'] = Hash::make($input['password']);
            $input['name'] = $input['firstName'].' '.$input['lastName'];
            $user = User::create($input);
            event(new Registered($user));
            $success['token'] =  $user->createToken('Register')-> accessToken; 
            $success['name'] =  $user->name;
            return response()->json([
                'status' => 200,
                'error' => "success",
                'token' => $success['token']
            ]);
        }
    }

    public function logout(Request $request){
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);

    }

    public function user(Request $request){
        return response()->json($request->user());
    }
}
