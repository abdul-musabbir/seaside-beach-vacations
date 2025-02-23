<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProfileController;
use App\Models\Listings;
use Carbon\Carbon;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    // Fetch current date and settings
    $currentDate = now();
    
    // Fetch Listings & Their Meta Data
    $listings = DB::table('listings as l')
        ->leftJoin('listings_meta as lm', 'l.id', '=', 'lm.listing_id')
        ->select('l.id', 'l.title', 'l.description', 'l.gallery_images', 'l.video_link', 'l.feature_image', 'l.slug', 'l.map_url', 'l.reivews', 'lm.meta_key', 'lm.meta_value')
        ->where('l.status', 'publish')
        ->where('l.deleted', 0)
        ->get();

    $listingsData = [];
    foreach ($listings as $row) {
        $id = $row->id;
        $listingsData[$id]['id'] = $row->id;
        $listingsData[$id]['title'] = $row->title;
        $listingsData[$id]['description'] = $row->description;
        $listingsData[$id]['feature_image'] = $row->feature_image;
        $listingsData[$id]['gallery_images'] = $row->gallery_images;
        $listingsData[$id]['video_link'] = $row->video_link;
        $listingsData[$id]['reivews'] = $row->reivews;
        $listingsData[$id]['slug'] = $row->slug;
        $listingsData[$id]['map_url'] = $row->map_url;
        $listingsData[$id]['meta'][$row->meta_key] = $row->meta_value;
    }

    // Fetch Location Information
    $locations = DB::table('listing_taxonomies as lt')
        ->join('taxonomies as t', 'lt.taxonomy_id', '=', 't.id')
        ->select('lt.listing_id', 't.name as location')
        ->where('t.taxonomy_type', 'location')
        ->get();

    foreach ($locations as $location) {
        $listingsData[$location->listing_id]['location'] = $location->location;
    }

    // Fetch Global Settings (Event Dates)
    $settings = DB::table('settings')->pluck('meta_value', 'meta_key')->toArray();

    // Helper Function to Calculate Price
    function getPriceForListing($listing, $settings, $currentDate)
    {
        $normalPrice = $listing['meta']['normal_price'] ?? 0;
        $normalMinimumStay = $listing['meta']['normal_minimum_stay'] ?? 1;

        if (isset($settings['peak_season_start']) && isset($settings['peak_season_end'])) {
            $psStart = \Carbon\Carbon::createFromFormat('d-m-Y', $settings['peak_season_start']);
            $psEnd = \Carbon\Carbon::createFromFormat('d-m-Y', $settings['peak_season_end']);
            if ($psStart && $psEnd && $currentDate >= $psStart && $currentDate <= $psEnd) {
                return [
                    'price' => $listing['meta']['peak_season_price'] ?? $normalPrice,
                    'minimum_stay' => $listing['meta']['peak_season_minimum_stay'] ?? $normalMinimumStay,
                    'type' => 'peak_season'
                ];
            }
        }

        // Other seasonal conditions (memorial_day, labor_day) follow the same structure as above

        return [
            'price' => $normalPrice,
            'minimum_stay' => $normalMinimumStay,
            'type' => 'normal'
        ];
    }

    // Apply pricing and add it to the listings
    foreach ($listingsData as $id => $listing) {
        $priceInfo = getPriceForListing($listing, $settings, $currentDate);
        $listingsData[$id]['price'] = $priceInfo['price'];
        $listingsData[$id]['minimum_stay'] = $priceInfo['minimum_stay'];
        $listingsData[$id]['price_type'] = $priceInfo['type'];
    }

    // Return the listings to the Inertia view
    return Inertia::render('src/App', [
        'listing_data' => array_values($listingsData),
    ]);
});


Route::get('/{slug}', function (string $slug) {
    // Set timezone to New Jersey
    date_default_timezone_set('America/New_York');
    
    // Get current date
    $currentDate = Carbon::now();

    // 1. Fetch a single Listing & Its Meta Data by slug
    $listing = DB::table('listings as l')
        ->leftJoin('listings_meta as lm', 'l.id', '=', 'lm.listing_id')
        ->where('l.status', 'publish')
        ->where('l.deleted', 0)
        ->where('l.slug', $slug)
        ->select('l.id', 'l.title', 'l.description', 'l.reivews', 'l.gallery_images', 'l.feature_image', 'l.slug', 'l.map_url', 'lm.meta_key', 'lm.meta_value')
        ->get()
        ->groupBy('id');

    if ($listing->isEmpty()) {
        abort(404, 'Listing not found');
    }

    // Process the first listing (there should only be one)
    $listing = $listing->first();

    // Initialize the listing data
    $listingData = [
        'id' => $listing[0]->id, // Get the listing id
        'title' => $listing[0]->title,
        'description' => $listing[0]->description,
        'feature_image' => $listing[0]->feature_image,
        'gallery_images' => $listing[0]->gallery_images,
        'reivews' => $listing[0]->reivews,
        'slug' => $listing[0]->slug,
        'map_url' => $listing[0]->map_url,
        'meta' => []
    ];

    // Iterate over the grouped meta data and map it to the 'meta' key
    foreach ($listing as $meta) {
        $listingData['meta'][$meta->meta_key] = $meta->meta_value;
    }

    // 2. Fetch Location Information for the Listing
    $location = DB::table('listing_taxonomies as lt')
        ->join('taxonomies as t', 'lt.taxonomy_id', '=', 't.id')
        ->where('t.taxonomy_type', 'location')
        ->where('lt.listing_id', $listingData['id'])
        ->select('t.name as location')
        ->first();

    if ($location) {
        $listingData['location'] = $location->location;
    }

    // 3. Fetch Global Settings (Event Dates) for Dynamic Pricing
    $settings = DB::table('settings')
        ->pluck('meta_value', 'meta_key')
        ->toArray();

    // 4. Helper Function: Determine the Price for a Listing Based on Date
    function getPriceForListings($listing, $settings, $currentDate)
    {
        $normalPrice = $listing['meta']['normal_price'] ?? 0;
        $normalMinimumStay = $listing['meta']['normal_minimum_stay'] ?? 1;

        if (isset($settings['peak_season_start']) && isset($settings['peak_season_end'])) {
            $psStart = Carbon::createFromFormat('d-m-Y', $settings['peak_season_start']);
            $psEnd = Carbon::createFromFormat('d-m-Y', $settings['peak_season_end']);
            if ($currentDate->between($psStart, $psEnd)) {
                return [
                    'price' => $listing['meta']['peak_season_price'] ?? $normalPrice,
                    'minimum_stay' => $listing['meta']['peak_season_minimum_stay'] ?? $normalMinimumStay,
                    'type' => 'peak_season'
                ];
            }
        }

        if (isset($settings['memorialday_start']) && isset($settings['memorialday_end'])) {
            $memStart = Carbon::createFromFormat('d-m-Y', $settings['memorialday_start']);
            $memEnd = Carbon::createFromFormat('d-m-Y', $settings['memorialday_end']);
            if ($currentDate->between($memStart, $memEnd)) {
                return [
                    'price' => $listing['meta']['memorial_day_price'] ?? $normalPrice,
                    'minimum_stay' => $listing['meta']['memorial_day_minimum_stay'] ?? $normalMinimumStay,
                    'type' => 'memorial_day'
                ];
            }
        }

        if (isset($settings['laborday_start']) && isset($settings['laborday_end'])) {
            $labStart = Carbon::createFromFormat('d-m-Y', $settings['laborday_start']);
            $labEnd = Carbon::createFromFormat('d-m-Y', $settings['laborday_end']);
            if ($currentDate->between($labStart, $labEnd)) {
                return [
                    'price' => $listing['meta']['labor_day_price'] ?? $normalPrice,
                    'minimum_stay' => $listing['meta']['labor_day_minimum_stay'] ?? $normalMinimumStay,
                    'type' => 'labor_day'
                ];
            }
        }

        return [
            'price' => $normalPrice,
            'minimum_stay' => $normalMinimumStay,
            'type' => 'normal'
        ];
    }

    // Fetch the pricing and add it to the listing
    $priceInfo = getPriceForListings($listingData, $settings, $currentDate);
    $listingData['price'] = $priceInfo['price'];
    $listingData['minimum_stay'] = $priceInfo['minimum_stay'];
    $listingData['price_type'] = $priceInfo['type'];

    $all_titles = DB::table("listings")->select("title", "slug")->get();

    // Return the listing data to the SinglePage component
    return Inertia::render('src/pages/SinglePage', [
        'single_data' => $listingData,
        'all_titles' => $all_titles
    ]);
});


Route::match(['get', 'post'], '/{slug}/checkout', function (Request $request, $slug) {
    $data = $request->input('data');
    $checkIn = $request->input('checkIn');
    $checkOut = $request->input('checkOut');
    $adults = $request->input('adults');
    $subtotalprice = $request->input('subtotalprice');

    // Get all listings to pass to the frontend
    $all_titles = DB::table("listings")->select("title", "slug")->get();

    if ($request->isMethod('post')) {
        // You can store the posted data in the session or do some other processing
        session([
            'data' => $data,
            'checkIn' => $checkIn,
            'checkOut' => $checkOut,
            'adults' => $adults,
            'subtotalprice' => $subtotalprice,
        ]);
    } else {
        // If it's a GET request, retrieve data from session (if available)
        $data = session('data');
        $checkIn = session('checkIn');
        $checkOut = session('checkOut');
        $adults = session('adults');
        $subtotalprice = session('subtotalprice');
    }

    // Return the Inertia response with the data
    return Inertia::render('src/pages/Checkout', [
        'data' => $data,
        'checkIn' => $checkIn,
        'checkOut' => $checkOut,
        'adults' => $adults,
        'subtotalprice' => $subtotalprice,
        'all_titles' => $all_titles,
    ]);
});


Route::post("/booking/store", [BookingController::class, "store"])->name("booking.store");

Route::post('/mail/send', [ContactController::class, 'sendContactForm'])->name("mail.send");



Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
