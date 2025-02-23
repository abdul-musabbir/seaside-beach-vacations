<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming data
        $validator = Validator::make($request->all(), [
            'data.firstName' => 'required|string|max:255',
            'data.email' => 'required|email|max:255',
            'data.lastName' => 'nullable|string|max:255',
            'data.phone' => 'nullable|string|max:20',
            'data.checkInDate' => 'required|date',
            'data.checkOutDate' => 'required|date',
            'data.adults' => 'required|integer',
            'data.listing_id' => 'required|integer',
            'data.message' => 'nullable|string',
            'data.referenceCode' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        // Retrieve the validated data
        $data = $request->input('data');
        
        // Insert the customer data into the customers table
        $customerId = DB::table('customers')->insertGetId([
            'first_name' => $data['firstName'],
            'last_name' => $data['lastName'] ?? null,
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
        ]);

        // Format dates for MySQL
        $checkInDate = \Carbon\Carbon::parse($data['checkInDate'])->format('Y-m-d');
        $checkOutDate = \Carbon\Carbon::parse($data['checkOutDate'])->format('Y-m-d');
        $adults = (int)$data['adults']; // Ensure it's an integer

        // Insert the booking data into the bookings table
        $bookingInserted = DB::table('bookings')->insert([
            'customer_id' => $customerId,
            'listing_id' => $data['listing_id'],
            'check_in' => $checkInDate,
            'check_out' => $checkOutDate,
            'number_of_guests' => $adults,
            'notes' => $data['message'] ?? null,
            'reference_number' => $data['referenceCode'],
        ]);

        if ($bookingInserted) {
            return;
            
        } else {
            // Return error response if booking insertion fails
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to insert booking data',
            ], 500);
        }
    }
}
