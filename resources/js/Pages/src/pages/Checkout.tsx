import axios from "axios";
import { format } from "date-fns";
import jsPDF from "jspdf";
import {
  Calendar,
  ChevronRight,
  Download,
  Hotel,
  Loader,
  MapPin,
  Printer,
  Shield,
  User,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Footer from "../components/Footer";

import { useCallback } from "react";
import Headers from "../components/Headers";
function Checkout() {
  const [step, setStep] = useState(1);
  const [showInvoice, setShowInvoice] = useState(false);
  const invoiceRef = useRef(null);
  const [formDatas, setFormDatas] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    document.title = "Checkout | Seaside Beach Vacations";
  }, []);

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

  const location = useLocation();

  const navigate = useNavigate();
  const { data, checkIn, checkOut, adults, subtotalprice } =
    location.state || {};
  const [loader, setLoader] = useState<boolean>(false);
  useEffect(() => {
    // This will run when the component mounts
    window.scrollTo(0, 0);
  }, []);
  // Redirect if no item is found
  useEffect(() => {
    if (!data) {
      navigate("/", { replace: true }); // Replaces history to prevent going back
    }
  }, [data, navigate]);

  if (!data) return null; // Prevents rendering before redirection

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

  const bookingDetails = {
    hotelName: "LuxStay Grand Resort",
    roomType: "Deluxe Suite",
    location: "123 Luxury Avenue, Paradise City",
    checkIn: "March 15, 2024",
    checkOut: "March 18, 2024",
    guests: 2,
    nights: 3,
    pricePerNight: 299,
    taxRate: 0.12,
    bookingRef: "LUXSTAY-2024-03-15",
  };

  const calculateTotal = () => {
    const subtotal = bookingDetails.nights * bookingDetails.pricePerNight;
    const tax = subtotal * bookingDetails.taxRate;
    return {
      subtotal,
      tax,
      total: subtotal + tax,
    };
  };

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice-${bookingDetails.bookingRef}`,
  });

  const handleDownloadInvoice = () => {
    const { subtotal, tax, total } = calculateTotal();
    const doc = new jsPDF();

    // Add hotel logo and header
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text("LuxStay", 20, 20);

    // Add hotel details
    doc.setFontSize(10);
    doc.text("123 Luxury Avenue", 20, 30);
    doc.text("Paradise City, PC 12345", 20, 35);
    doc.text("contact@luxstay.com", 20, 40);

    // Add invoice details
    doc.setFontSize(16);
    doc.text("INVOICE", 150, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 30);
    doc.text(`Invoice #: INV-${bookingDetails.bookingRef}`, 150, 35);

    // Add booking details
    doc.setFontSize(14);
    doc.text("Booking Details", 20, 60);
    doc.setFontSize(10);
    doc.text(`Hotel: ${bookingDetails.hotelName}`, 20, 70);
    doc.text(`Room Type: ${bookingDetails.roomType}`, 20, 75);
    doc.text(`Check-in: ${bookingDetails.checkIn}`, 20, 80);
    doc.text(`Check-out: ${bookingDetails.checkOut}`, 20, 85);
    doc.text(`Guests: ${bookingDetails.guests} Adults`, 20, 90);
    doc.text(`Duration: ${bookingDetails.nights} Nights`, 20, 95);

    // Add charges
    doc.setFontSize(14);
    doc.text("Charges", 20, 115);
    doc.setFontSize(10);
    doc.text(
      `Room Charges (${bookingDetails.nights} nights × $${bookingDetails.pricePerNight})`,
      20,
      125
    );
    doc.text(`$${subtotal}`, 170, 125, { align: "right" });
    doc.text("Taxes & Fees (12%)", 20, 130);
    doc.text(`$${tax.toFixed(2)}`, 170, 130, { align: "right" });

    // Add total
    doc.setLineWidth(0.5);
    doc.line(20, 135, 190, 135);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Total", 20, 142);
    doc.text(`$${total.toFixed(2)}`, 170, 142, { align: "right" });

    // Save the PDF
    doc.save(`Invoice-${bookingDetails.bookingRef}.pdf`);
  };

  const Invoice = React.forwardRef((props, ref) => {
    const { subtotal, tax, total } = calculateTotal();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">
          <div ref={ref} className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Hotel className="w-8 h-8 text-blue-600" />
                  <span className="text-2xl font-semibold text-gray-900">
                    LuxStay
                  </span>
                </div>
                <p className="text-gray-600">123 Luxury Avenue</p>
                <p className="text-gray-600">Paradise City, PC 12345</p>
                <p className="text-gray-600">contact@luxstay.com</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  INVOICE
                </h2>
                <p className="text-gray-600">
                  Date: {new Date().toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Invoice #: INV-{bookingDetails.bookingRef}
                </p>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Guest Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Booking Reference:</p>
                  <p className="font-medium">{bookingDetails.bookingRef}</p>
                </div>
                <div>
                  <p className="text-gray-600">Room Type:</p>
                  <p className="font-medium">{bookingDetails.roomType}</p>
                </div>
                <div>
                  <p className="text-gray-600">Check-in:</p>
                  <p className="font-medium">{bookingDetails.checkIn}</p>
                </div>
                <div>
                  <p className="text-gray-600">Check-out:</p>
                  <p className="font-medium">{bookingDetails.checkOut}</p>
                </div>
                <div>
                  <p className="text-gray-600">Guests:</p>
                  <p className="font-medium">{bookingDetails.guests} Adults</p>
                </div>
                <div>
                  <p className="text-gray-600">Duration:</p>
                  <p className="font-medium">{bookingDetails.nights} Nights</p>
                </div>
              </div>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3">Description</th>
                  <th className="text-right py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3">
                    {bookingDetails.roomType} - {bookingDetails.nights} nights ×
                    ${bookingDetails.pricePerNight}
                  </td>
                  <td className="text-right">${subtotal}</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-3">Taxes & Fees (12%)</td>
                  <td className="text-right">${tax.toFixed(2)}</td>
                </tr>
                <tr className="border-t-2 border-gray-900 font-semibold">
                  <td className="py-3">Total</td>
                  <td className="text-right">${total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleDownloadInvoice}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={() => setShowInvoice(false)}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  });

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={checkOutPageSubmit} className="space-y-6">
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
                type="submit"
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
                  Your reservation has been successfully confirmed. A
                  confirmation email has been sent to your inbox.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto mb-8">
                <h3 className="font-medium text-gray-900 mb-4">
                  Booking Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-600">Hotel</p>
                    <p className="font-medium">{data.title}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Guests</p>
                    <p className="font-medium">{adults} Guest</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-medium">{checkInDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-medium">{checkOutDate}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="font-medium text-gray-900 mb-4">
                  Booking Reference
                </h3>
                <p className="text-2xl font-mono text-blue-600 mb-4">
                  {reference_code ? reference_code : "Loading..."}
                </p>
                {/* <div className="text-sm text-gray-600 mb-6">
                  Keep this reference number handy for check-in
                </div> */}
                {/* <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowInvoice(true)}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    View Invoice
                  </button>
                  <button
                    onClick={handleDownloadInvoice}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        );
    }
  };

  const checkOutPageSubmit = (e) => {
    e.preventDefault();

    if (
      !formDatas.firstName ||
      !formDatas.lastName ||
      !formDatas.email ||
      !formDatas.phone
    ) {
      console.log("Please fill in all fields");
      return;
    }

    setLoader(true);
    const listing_id = data.id;
    axios
      .post("https://hello.seasidebeachvacations.com/bookingform.php", {
        data: {
          ...formDatas,
          listing_id,
          checkInDate,
          checkOutDate,
          adults,
          referenceCode,
        },
      })
      .then((res) => {
        setRefernceCode(res.data.reference_code);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoader(false);
        setStep(2);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 md:pt-40">
      {showInvoice && <Invoice ref={invoiceRef} />}

      {/* Header */}
      <Headers />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between">
                {["Guest Details", "Confirmation"].map((label, index) => (
                  <div key={label} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        step > index + 1
                          ? "bg-green-500"
                          : step === index + 1
                          ? "bg-blue-600"
                          : "bg-gray-200"
                      } text-white font-semibold transition-colors duration-200`}
                    >
                      {step > index + 1 ? "✓" : index + 1}
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
                ))}
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

              {/* <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {bookingDetails.nights} nights × $
                      {bookingDetails.pricePerNight}
                    </span>
                    <span className="text-gray-900">
                      ${bookingDetails.nights * bookingDetails.pricePerNight}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & fees</span>
                    <span className="text-gray-900">
                      $
                      {(
                        bookingDetails.nights *
                        bookingDetails.pricePerNight *
                        bookingDetails.taxRate
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-4 border-t">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold text-lg">
                      ${calculateTotal().total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div> */}

              <div className="space-y-2 border-t pt-4">
                {subtotalprice && (
                  <div className="flex justify-between text-gray-600">
                    <span>Booking Cost</span>
                    <span>{formatPrice(subtotalprice)}</span>
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

      <Footer />
    </div>
  );
}

export default Checkout;
