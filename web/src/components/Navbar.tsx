"use client";

import Link from "next/link";
import flowbite from "flowbite";
import {
    Navbar,
    Button,
    NavbarBrand,
    NavbarToggle,
    NavbarCollapse,
    NavbarLink,
} from "flowbite-react";
import { Calendar } from "lucide-react";

export default function NavbarComponent() {
    return (
        <Navbar fluid className="border-b border-gray-300 sticky top-0 z-50">
            <NavbarBrand as={Link} href="/">
                <Calendar className="mr-3 h-8 w-8 text-orange-600" />
                <span className="self-center whitespace-nowrap text-xl font-bold text-gray-900">
                    RunEvent
                </span>
            </NavbarBrand>
            <div className="flex md:order-2 gap-2">
                <Link href="/login">
                    <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                            Log In
                        </span>
                    </button>
                </Link>
                <Link href="/register">
                    <button className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                        Sign Up
                    </button>
                </Link>
            </div>
            <NavbarCollapse>
                <NavbarLink href="/" active>
                    Find Events
                </NavbarLink>
                <NavbarLink href="/dashboard">Create Events</NavbarLink>
                <NavbarLink href="/pricing">Pricing</NavbarLink>
                <NavbarLink href="/help">Help Center</NavbarLink>
            </NavbarCollapse>
        </Navbar>
    );
}
