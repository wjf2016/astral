<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\ClientInterface;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Helpers\GithubClient;
use Auth;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\Star;
use App\Models\Tag;


class GithubController extends Controller
{
  public function __construct() {
    return $this->middleware('jwt.auth');
  }

  public function getStars(Request $request, GithubClient $client)
  {
      $page = (int)$request->input('page', 1);
      $access_token = $request->header('Access-Token');
      $stars = $client->getStars($page, $access_token);
      $autotag = Auth::user()->autotag;
      for($i = 0; $i <= count($stars['stars']) - 1; $i++){
        //Look for an existing star with the id of the repo
        $userStar = Star::with('tags')->where('user_id', Auth::id())->where('repo_id', $stars['stars'][$i]['id'])->first();

        //If user has autotag turned on
        if($autotag){
          //Fetch the language
          $lang = strtolower( $stars['stars'][$i]['language'] );
          //Look for tag that has a name of the repo language
          $tag = Tag::where('user_id', Auth::id())->whereRaw('LOWER(name) = ?', [$lang])->first();
        }

        if($userStar){
          if($tag){
            $userStar->tags()->sync([$tag->id], false);
            $stars['stars'][$i]['tags'] = $userStar->tags;
          }
          else {
            $stars['stars'][$i]['tags'] = [];
          }
        }
        else {
          if($tag){
            $star = new Star();
            $star->repo_id = $stars['stars'][$i]['id'];
            $star->repo_name = $stars['stars'][$i]['full_name'];
            $star->save();
            $star->tags()->attach($tag->id);
            $stars['stars'][$i]['tags'] = $star->tags;
          }
          else {
            $stars['stars'][$i]['tags'] = [];
          }
        }
      }
      return response()->json(compact('stars'), 200);
  }
}
