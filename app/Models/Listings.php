<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Listings extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'excerpt',
        'feature_image',
        'gallery_images',
        'map_url',
        'video_link',
        'reviews',
    ];
}
