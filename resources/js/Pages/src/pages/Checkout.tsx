import { Inertia } from "@inertiajs/inertia";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";
import {
    Calendar,
    ChevronRight,
    Loader,
    MapPin,
    Shield,
    User,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Headers from "../components/Headers";
function Checkout(props: any) {
    const { data, checkIn, checkOut, adults, subtotalprice, all_titles } =
        props;
    const [step, setStep] = useState(1);
    const [formDatas, setFormDatas] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
    });

    const [reference_code, setRefernceCode] = useState<string>("");
    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    function GenerateTotalPrice(
        bookingCost: number,
        cleaningFee: number,
        utilityFee: number
    ): number {
        return Number(bookingCost) + Number(cleaningFee) + Number(utilityFee);
    }

    const [loader, setLoader] = useState<boolean>(false);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!data) return null;

    const checkInDate = format(checkIn, "MMMM d, yyyy");
    const checkOutDate = format(checkOut, "MMMM d, yyyy");

    const generateBookingReference = useCallback(
        (propertyName: string): string => {
            // Define the property name mappings
            const propertyCodes: { [key: string]: string } = {
                "Beach Escape": "BE",
                "Ocean Oasis": "OO",
                "Unit 1": "U1",
                "Unit 2": "U2",
                "Unit 3": "U3",
            };

            // Get the current year and month (YYYYMM format)
            const now = new Date();
            const yearMonth =
                now.getFullYear().toString() +
                String(now.getMonth() + 1).padStart(2, "0");

            // Generate a unique serial using timestamp + random number to avoid duplicates
            const serial =
                Date.now().toString().slice(-6) +
                Math.floor(Math.random() * 100)
                    .toString()
                    .padStart(2, "0");

            // Get the house code from the property mapping
            const houseCode = propertyCodes[propertyName] || "XX"; // Default to "XX" if property not found

            // Construct the reference number
            return `SBV-${houseCode}-${yearMonth}-${serial}`;
        },
        []
    );

    const referenceCode = generateBookingReference(data.title);

    // Retrieve step from localStorage on component mount
    useEffect(() => {
        const savedStep = localStorage.getItem("checkoutStep");
        if (savedStep) {
            setStep(Number(savedStep)); // Convert to number and set step
        }

        // Scroll to top on mount
        window.scrollTo(0, 0);

        return () => localStorage.removeItem("checkoutStep");
    }, []);

    useEffect(() => {
        const referenceCode = localStorage.getItem("referenceCode");
        if (referenceCode) {
            setRefernceCode(referenceCode); // Convert to number and set step
        }

        // Scroll to top on mount
        window.scrollTo(0, 0);

        return () => localStorage.removeItem("referenceCode");
    }, []);

    const checkOutPageSubmit = async (e: any) => {
        e.preventDefault();
        const listing_id = data.id;

        const postData: any = {
            data: {
                ...formDatas,
                listing_id,
                checkInDate: format(checkIn, "MMMM d, yyyy"),
                checkOutDate: format(checkOut, "MMMM d, yyyy"),
                adults,
                referenceCode: generateBookingReference(data.title),
            },
        };

        setLoader(true);

        try {
            const response = await Inertia.post("/booking/store", postData, {
                onError: (err) => {
                    console.error("Error:", err); // Debugging
                },
                onFinish: (res: any) => {
                    if (res && res.data.data) {
                        const referenceCode = res.data.data.referenceCode;
                        setRefernceCode(referenceCode);
                        localStorage.setItem("referenceCode", referenceCode);
                    } else {
                        console.error(
                            "Reference code not found in response:",
                            res
                        ); // Log if reference_code is missing
                    }
                    setLoader(false);
                    setStep(2); // Update step to 2
                    localStorage.setItem("checkoutStep", "2"); // Save step to localStorage
                },
            });
        } catch (error) {
            console.error("Error submitting form:", error); // Debugging
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <form className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Guest Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        First Name
                                    </label>

                                    <input
                                        type="text"
                                        onChange={(e) =>
                                            setFormDatas((prev) => ({
                                                ...prev,
                                                firstName: e.target.value,
                                            }))
                                        }
                                        id="first_name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        onChange={(e) =>
                                            setFormDatas((prev) => ({
                                                ...prev,
                                                lastName: e.target.value,
                                            }))
                                        }
                                        id="last_name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        onChange={(e) =>
                                            setFormDatas((prev) => ({
                                                ...prev,
                                                email: e.target.value,
                                            }))
                                        }
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
                                        placeholder="hello@gmail.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Phone
                                    </label>
                                    <input
                                        type="number"
                                        onChange={(e) =>
                                            setFormDatas((prev) => ({
                                                ...prev,
                                                phone: e.target.value,
                                            }))
                                        }
                                        id="phone_number"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
                                        placeholder="type your phone number"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Special Requests
                            </h3>
                            <textarea
                                id="message"
                                onChange={(e) =>
                                    setFormDatas((prev) => ({
                                        ...prev,
                                        message: e.target.value,
                                    }))
                                }
                                rows={4}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="Write your thoughts here..."
                            ></textarea>
                        </div>

                        <div className="pt-6">
                            <button
                                type="button"
                                onClick={checkOutPageSubmit}
                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                                {loader ? (
                                    <Loader className="animate-spin" />
                                ) : (
                                    "Complete Booking"
                                )}
                            </button>
                        </div>
                    </form>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <Shield className="w-8 h-8 text-green-600" />
                            </div>
                            <div className="mt-6">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                    Booking Confirmed!
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Your reservation has been successfully
                                    confirmed. A confirmation email has been
                                    sent to your inbox.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto mb-8">
                                <h3 className="font-medium text-gray-900 mb-4">
                                    Booking Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Hotel
                                        </p>
                                        <p className="font-medium">
                                            {data.title}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Guests
                                        </p>
                                        <p className="font-medium">
                                            {adults} Guest
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Check-in
                                        </p>
                                        <p className="font-medium">
                                            {checkInDate}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Check-out
                                        </p>
                                        <p className="font-medium">
                                            {checkOutDate}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto">
                                <h3 className="font-medium text-gray-900 mb-4">
                                    Booking Reference
                                </h3>
                                <p className="text-2xl font-mono text-blue-600 mb-4">
                                    {reference_code
                                        ? reference_code
                                        : "Loading..."}
                                </p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-28 md:pt-40">
            <Head title="Checkout" />
            {/* Header */}
            <Headers datas={all_titles} />

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Checkout Form */}
                    <div className="lg:col-span-2">
                        {/* Progress Steps */}
                        <div className="mb-8">
                            <div className="flex justify-between">
                                {["Guest Details", "Confirmation"].map(
                                    (label, index) => (
                                        <div
                                            key={label}
                                            className="flex items-center"
                                        >
                                            <div
                                                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                                    step > index + 1
                                                        ? "bg-green-500"
                                                        : step === index + 1
                                                        ? "bg-blue-600"
                                                        : "bg-gray-200"
                                                } text-white font-semibold transition-colors duration-200`}
                                            >
                                                {step > index + 1
                                                    ? "✓"
                                                    : index + 1}
                                            </div>
                                            <span
                                                className={`ml-2 text-sm ${
                                                    step === index + 1
                                                        ? "text-blue-600 font-medium"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {label}
                                            </span>
                                            {index < 1 && (
                                                <ChevronRight className="w-4 h-4 mx-4 text-gray-400" />
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {renderStepContent()}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 space-y-6 sticky top-8">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Booking Summary
                            </h2>

                            <div className="relative">
                                <img
                                    src={data.feature_image}
                                    alt="Luxury Hotel Room"
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg">
                                    {data.title}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    <span>{data.location}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    <span>
                                        {checkInDate} - {checkOutDate}
                                    </span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <User className="w-5 h-5 mr-2" />
                                    <span>{adults} Guests</span>
                                </div>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                {subtotalprice && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Booking Cost</span>
                                        <span>
                                            {formatPrice(subtotalprice)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>Cleaning fee</span>
                                    <span>{data.meta.cleaning_fees}</span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Utility fee</span>
                                    <span>{data.meta.utility_fees}</span>
                                </div>
                            </div>

                            {/* Dynamic Pricing Details */}
                            {subtotalprice && (
                                <div className="space-y-4">
                                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                                        <span>Total</span>
                                        <span>
                                            {formatPrice(
                                                GenerateTotalPrice(
                                                    subtotalprice,
                                                    data.meta.cleaning_fees,
                                                    data.meta.utility_fees
                                                )
                                            )}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-start">
                                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                                    <p className="ml-2 text-sm text-gray-600">
                                        Pay secuirity deposit
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer data={all_titles} />
        </div>
    );
}

export default Checkout;
