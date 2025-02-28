import { useForm } from "@inertiajs/react";
import { Mail, MapPin, Phone } from "lucide-react";
import React, { useState } from "react";

function ContactForm() {
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    // Initialize form using Inertia's useForm hook
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        phone: "",
        email: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default behavior

        // Prevent page jumping by saving scroll position
        const scrollPosition = window.scrollY;

        post(route("mail.send"), {
            onSuccess: () => {
                reset();
                window.scrollTo(0, scrollPosition);
                setSuccess(
                    "Your message has been successfully submitted, and our team will review it shortly. We will get back to you as soon as possible with a response."
                );
            },

            onError: () => {
                setError(
                    "We apologize, but there was an issue submitting your message. Unfortunately, we were unable to send your email at this time."
                );
            },
        });

        return false; // Prevent page refresh
    };

    const handleChange = (e: any) => {
        setData(e.target.name, e.target.value);
    };

    return (
        <div className="min-h-screen">
            <div className="sm:w-[92%] xl:max-w-screen-xl sm:mx-auto sm:px-6 lg:px-8">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left Side - Contact Information */}
                        <div className="relative overflow-hidden">
                            {/* Background Image with Overlay */}
                            <div
                                className="absolute inset-0 bg-cover bg-center z-0"
                                style={{
                                    backgroundImage:
                                        'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2946&q=80")',
                                }}
                            />
                            <div className="absolute inset-0 bg-blue-800 backdrop-blur-sm z-10" />

                            {/* Content */}
                            <div className="relative z-20 p-5 md:p-12">
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-4xl font-bold text-white mb-4">
                                            Contact Us
                                        </h2>
                                        <div className="w-20 h-1 bg-blue-400 rounded-full mb-6" />
                                        <p className="text-blue-100 text-lg leading-relaxed">
                                            Looking for your perfect beach
                                            getaway? We're here to help you find
                                            the ideal vacation rental in
                                            beautiful Seaside Park, NJ. Reach
                                            out to us and let's make your beach
                                            dreams come true.
                                        </p>
                                    </div>

                                    <div className="pt-8">
                                        <div className="space-y-8">
                                            <div className="flex items-center sm:space-x-4 group">
                                                <div className="hidden sm:block bg-white/10 p-3 rounded-lg group-hover:bg-white/20 transition duration-300">
                                                    <Phone className="w-6 h-6 text-blue-300" />
                                                </div>
                                                <div>
                                                    <p className="text-blue-200 text-sm font-medium">
                                                        Phone
                                                    </p>
                                                    <p className="text-white text-lg">
                                                        201-921-9969
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center sm:space-x-4 group">
                                                <div className="hidden sm:block bg-white/10 p-3 rounded-lg group-hover:bg-white/20 transition duration-300">
                                                    <Mail className="w-6 h-6 text-blue-300" />
                                                </div>
                                                <div>
                                                    <p className="text-blue-200 text-sm font-medium">
                                                        Email
                                                    </p>
                                                    <p className="text-white text-lg">
                                                        seasidebeachvacations@gmail.com
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start sm:space-x-4 group">
                                                <div className="hidden sm:block bg-white/10 p-3 rounded-lg group-hover:bg-white/20 transition duration-300">
                                                    <MapPin className="w-6 h-6 text-blue-300" />
                                                </div>
                                                <div>
                                                    <p className="text-blue-200 text-sm font-medium">
                                                        Locations
                                                    </p>
                                                    <div className="space-y-1 mt-1">
                                                        <p className="text-white">
                                                            23 Farragut Ave,
                                                            Seaside Park NJ
                                                            08752
                                                        </p>
                                                        <p className="text-white">
                                                            29 Farragut Ave,
                                                            Seaside Park NJ
                                                            08752
                                                        </p>
                                                        <p className="text-white">
                                                            30 Farragut Ave,
                                                            Seaside Park, NJ
                                                            08752
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Contact Form */}
                        <div className="p-5 md:p-12">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-8">
                                Send us a Message
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                                        placeholder="Your name"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={data.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                                        placeholder="Your phone number"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={data.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                                        placeholder="your@email.com"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={data.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                                        placeholder="Your message"
                                    ></textarea>
                                    {errors.message && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.message}
                                        </p>
                                    )}
                                </div>

                                {error && (
                                    <p className="text-red-400 font-medium text-base">
                                        {error}
                                    </p>
                                )}

                                {success && (
                                    <p className="text-green-400 font-medium text-base">
                                        {success}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
                                    disabled={processing}
                                >
                                    {processing ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactForm;
