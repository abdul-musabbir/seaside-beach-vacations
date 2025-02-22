import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

import { Link } from "react-router-dom";
import SeasideLogo from "../assets/seasidebeachvacationslogo.png";
const Footer = () => {
  // const scrollToTop = () => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  return (
    <footer className="bg-black text-white pt-16 pb-6">
      <div className="w-[92%] xl:max-w-screen-xl mx-auto">
        {/* Top Section with Logo and Phone */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <div className="flex items-center gap-2">
            <Link to={"/"} className="text-2xl font-bold">
              <img src={SeasideLogo} className="w-44" alt="" />
            </Link>
          </div>
          {/* <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Need help? Call us</span>
            <Phone className="h-4 w-4 text-amber-500" />
            <span className="text-amber-500">+1 201-921-9969</span>
          </div> */}
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[30%_1fr_1fr_1fr]  lg:gap-5 gap-8 mb-12">
          {/* Contact Us */}
          <div className="">
            <h3 className="font-semibold mb-4">How to Book</h3>
            <p className="text-gray-400 text-sm mb-2">
              Payment can be made by Venmo, Zelle, or by check. Deposit is due
              at the time of booking to secure your rental date. The rest of the
              rental payment will be put into a pay plan for your convenience.
              The entire rental must be paid off a month prior to the date of
              rental.
            </p>
          </div>

          {/* Support */}
          <div className=" md:pl-24">
            <h3 className="font-semibold mb-4">Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="#" className="hover:text-amber-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-500">
                  How to Book
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-500">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          <div className=" lg:pl-16">
            <h3 className="font-semibold mb-4">Home</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-amber-500">
                  Unit 1
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500">
                  Unit 2
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500">
                  Unit 3
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500">
                  Ocean Oasis
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500">
                  Beach Escape
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:pl-24 lg:pl-0">
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="tel:2019219969" className="hover:text-amber-500">
                  201-921-9969
                </a>
              </li>
              <li>
                <a
                  href="mailto:seasidebeachvacations@gmail.com"
                  className="hover:text-amber-500"
                >
                  seasidebeachvacations@gmail.com
                </a>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-500">
                  23 Farragut Ave, Seaside Park NJ 08752
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-500">
                  29 Farragut Ave, Seaside Park NJ 08752
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-500">
                  30 Farragut Ave, Seaside Park, NJ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 mt-6">
          <div className="flex flex-col space-y-5 md:space-y-0 md:flex-row justify-between items-center text-sm text-gray-400">
            <p>
              © 2025 Seaside Beach Vacations. All rights reserved. Proudly
              Develop by{" "}
              <a href="https://www.graphicsurface.com" target="_blank">
                <strong>Graphic Surface</strong>
              </a>
            </p>

            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/seasidebeachvacations/"
                target="_blank"
                className="hover:text-amber-500"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/seasidebeachvacations"
                target="_blank"
                className="hover:text-amber-500"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/SeaVacations"
                target="_blank"
                className="hover:text-amber-500"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/seasidebeachvacations/"
                target="_blank"
              >
                <Linkedin />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
