import axios from "axios";
import { Mail, MapPin, Phone } from "lucide-react";
import React, { useState } from "react";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null); // Reset previous errors
    setSuccessMessage(null); // Reset success message

    axios
      .post(
        "https://hello.seasidebeachvacations.com/sendMail.php",
        {
          data: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            message: formData.message,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setSuccessMessage("Message sent successfully!");
          console.log(response.data);
          setFormData({
            name: "",
            phone: "",
            email: "",
            message: "",
          });
        }
      })
      .catch((err) => {
        setErrorMessage(
          "There was an error sending your message. Please try again."
        );
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-[92%] xl:max-w-screen-xl mx-auto px-4 py-28 sm:px-6 lg:px-8">
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
                      Looking for your perfect beach getaway? We're here to help
                      you find the ideal vacation rental in beautiful Seaside
                      Park, NJ. Reach out to us and let's make your beach dreams
                      come true.
                    </p>
                  </div>

                  <div className="pt-8">
                    <div className="space-y-8">
                      <div className="flex items-center space-x-4 group">
                        <div className="bg-white/10 p-3 rounded-lg group-hover:bg-white/20 transition duration-300">
                          <Phone className="w-6 h-6 text-blue-300" />
                        </div>
                        <div>
                          <p className="text-blue-200 text-sm font-medium">
                            Phone
                          </p>
                          <p className="text-white text-lg">201-921-9969</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 group">
                        <div className="bg-white/10 p-3 rounded-lg group-hover:bg-white/20 transition duration-300">
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

                      <div className="flex items-start space-x-4 group">
                        <div className="bg-white/10 p-3 rounded-lg group-hover:bg-white/20 transition duration-300">
                          <MapPin className="w-6 h-6 text-blue-300" />
                        </div>
                        <div>
                          <p className="text-blue-200 text-sm font-medium">
                            Locations
                          </p>
                          <div className="space-y-1 mt-1">
                            <p className="text-white">
                              23 Farragut Ave, Seaside Park NJ 08752
                            </p>
                            <p className="text-white">
                              29 Farragut Ave, Seaside Park NJ 08752
                            </p>
                            <p className="text-white">
                              30 Farragut Ave, Seaside Park, NJ 08752
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
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                    placeholder="Your name"
                    required
                  />
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
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                    placeholder="Your phone number"
                    required
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
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                    placeholder="your@email.com"
                    required
                  />
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
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                    placeholder="Your message"
                    required
                  ></textarea>
                </div>

                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                {successMessage && (
                  <p style={{ color: "green" }}>{successMessage}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
                >
                  {isLoading ? "Sending..." : "Send Message"}
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
