<?php

namespace App\Http\Controllers;

use App\Mail\ContactMailToAdmin;
use App\Mail\ContactMailToUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class ContactController extends Controller
{
    /**
     * Handle sending contact form emails.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendContactForm(Request $request)
    {
        // Validate the incoming data with simpler rules
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:15',
            'message' => 'required|string|max:1000',
        ]);

        try {
            // Extract validated data
            $name = $validated['name'];
            $email = $validated['email'];
            $phone = $validated['phone'];
            $message = $validated['message'];

            // Send email to admin (you can inject the admin email if needed)
            Mail::to('midbox.io@gmail.com')->send(new ContactMailToAdmin($name, $email, $phone, $message));

            // Send confirmation email to user
            Mail::to($email)->send(new ContactMailToUser($name, $email));

            // Return success response
            echo "success";

        } catch (\Exception $e) {
            // Catch any error and return the message in JSON format
            return response()->json([
                'status' => 'error',
                'message' => 'There was an error sending your message: ' . $e->getMessage(),
            ], 500);
        }
    }
}
