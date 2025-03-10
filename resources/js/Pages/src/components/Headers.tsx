import { useEffect, useState } from "react";
import SeasideVacationLogo from "../assets/seasidebeachvacationslogo.png";

import { Link } from "@inertiajs/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "../utils/cn";

interface DataItem {
    title: string;
    slug: string;
}

export default function Headers({ datas }: { datas: any }) {
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const pathname = location.pathname.split("/");
    const [data, setData] = useState<DataItem[]>([]);
    const [scrolly, setScrolly] = useState<number>(0);
    const [isMobile, setIsMobile] = useState(false);
    // Fetch data when datas is available
    useEffect(() => {
        if (datas) {
            setData(
                datas.map((item: { title: string; slug: string }) => ({
                    title: item.title,
                    slug: item.slug,
                }))
            );
        }
    }, [datas]); // Re-run when datas updates

    // Check the window width on mount and resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Call on mount to check the initial screen size
        handleResize();

        // Add event listener to handle resizing
        window.addEventListener("resize", handleResize);

        // Cleanup the event listener when component is unmounted
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolly(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav
            className={cn("z-50 w-full", {
                "fixed top-0 left-0 right-0 transition-all duration-300": true,
                "shadow-md": scrolly > 0,
                "shadow-none": scrolly <= 0,
                "py-2 bg-white": scrolly > 0, // Add padding when scrolled
                "py-4": scrolly <= 0, // Larger padding when at the top
            })}
        >
            <div className="w-11/12 xl:max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
                <Link href="/">
                    <img
                        src={SeasideVacationLogo}
                        className="w-32"
                        alt="logo"
                    />
                </Link>

                <button
                    data-collapse-toggle="navbar-dropdown"
                    type="button"
                    onClick={() => setOpenMenu(!openMenu)}
                    className={cn(
                        "inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200",
                        {
                            "bg-white": scrolly <= 0,
                        }
                    )}
                >
                    {openMenu ? <X /> : <Menu />}
                </button>

                <div
                    className={cn("hidden w-full md:block md:w-auto", {
                        "block absolute top-24 left-0 px-8 md:block md:static":
                            openMenu,
                    })}
                >
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent shadow-xl md:shadow-none">
                        <li className=" ">
                            <Link
                                href={"/"}
                                className={cn(
                                    "block py-2 px-3 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0",
                                    {
                                        "text-black md:text-white":
                                            scrollY <= 0,
                                        "text-black": scrollY > 0,
                                    },
                                    {
                                        " md:text-black":
                                            pathname.includes("checkout"),
                                    }
                                )}
                            >
                                Home
                            </Link>
                        </li>
                        <li className="group relative">
                            <button
                                onClick={() => setShowDropDown(!showDropDown)}
                                className={cn(
                                    "flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto py-4 md:hidden",
                                    {
                                        "text-black md:text-white":
                                            scrollY <= 0,
                                        "text-black": scrollY > 0,
                                    },
                                    {
                                        " md:text-black":
                                            pathname.includes("checkout"),
                                    }
                                )}
                            >
                                Houses
                                <ChevronDown
                                    className={cn(
                                        "transition-all duration-150 md:group-hover:rotate-180",
                                        {
                                            "rotate-180": showDropDown,
                                            "rotate-0": !showDropDown,
                                        }
                                    )}
                                />
                            </button>

                            <button
                                className={cn(
                                    "items-center hidden md:flex justify-between w-full py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto py-4",
                                    {
                                        "text-black md:text-white":
                                            scrollY <= 0,
                                        "text-black": scrollY > 0,
                                    },
                                    {
                                        " md:text-black":
                                            pathname.includes("checkout"),
                                    }
                                )}
                            >
                                Houses
                                <ChevronDown
                                    className={cn(
                                        "transition-all duration-150 md:group-hover:rotate-180",
                                        {
                                            "rotate-180": showDropDown,
                                            "rotate-0":
                                                !showDropDown || !isMobile,
                                        }
                                    )}
                                />
                            </button>
                            {/* <!-- Dropdown menu --> */}
                            <div
                                className={cn(
                                    "z-10 hidden md:group-hover:block md:group-hover:absolute left-0 top-6 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow-md w-44 ",
                                    {
                                        "block w-full":
                                            showDropDown && isMobile, // Apply only on mobile and if showDropDown is true
                                    },
                                    {
                                        " md:text-black":
                                            pathname.includes("checkout"),
                                    }
                                )}
                            >
                                <ul className="py-2 text-sm text-gray-700 ">
                                    {data.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={"/" + item.slug}
                                                className="block px-4 py-2 hover:bg-gray-100"
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                        <li>
                            <a
                                href={
                                    pathname.includes("checkout")
                                        ? "/"
                                        : "#features-and-amenities"
                                }
                                className={cn(
                                    "block py-2 text-gray-900 px-3  rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0",
                                    {
                                        "text-black md:text-white":
                                            scrollY <= 0,
                                        "text-black": scrollY > 0,
                                    },
                                    {
                                        " md:text-black":
                                            pathname.includes("checkout"),
                                    }
                                )}
                            >
                                Features
                            </a>
                        </li>
                        <li>
                            <a
                                href={
                                    pathname.includes("checkout")
                                        ? "/"
                                        : "#how-to-book"
                                }
                                className={cn(
                                    "block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0",
                                    {
                                        "text-black md:text-white":
                                            scrollY <= 0,
                                        "text-black": scrollY > 0,
                                    },
                                    {
                                        " md:text-black":
                                            pathname.includes("checkout"),
                                    }
                                )}
                            >
                                How To Book
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
