<?php

namespace App\Http\Controllers;

use App\Events\ChatEvent;
use App\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ChatController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function chat(){


        return view('chat');
    }

    public function send(request $request){
        $user = User::find(Auth::id());

        $this->saveToSession($request);

        event(new ChatEvent($request->message, $user->name));
        return $request->all();
    }

    public function saveToSession(request $request){
        session()->put('chat', $request->chat);
    }

    public function getOldMessage(){
        return session('chat');
    }

    public function deleteSession(request $request){
        session()->forget('chat');
    }

    /*public function send(){
        $message = 'Hello';
        $user = User::find(Auth::id());
        event(new ChatEvent($message, $user));
        //event(new ChatEvent($request->message, $user));
    }*/
}
