<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


//Route::get('chat',function (){
//    return view('chat');
//});

Route::get('chat', 'ChatController@chat');
//Route::get('send', 'ChatController@send');
Route::post('send', 'ChatController@send');

Route::post('saveToSession', 'ChatController@saveToSession');
Route::post('getOldMessage', 'ChatController@getOldMessage');
Route::post('deleteSession', 'ChatController@deleteSession');

Route::get('check', function(){
   dump(session('chat'));
});

Auth::routes();

Route::get('/home', 'HomeController@index');
