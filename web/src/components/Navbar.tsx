"use client";

import Link from "next/link";
import Image from "next/image";
import flowbite from "flowbite";
import {
    Navbar,
    Button,
    NavbarBrand,
    NavbarToggle,
    NavbarCollapse,
    NavbarLink,
} from "flowbite-react";
import { Calendar, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function NavbarComponent() {
    const { user, logout } = useAuth();

    return (
        <Navbar fluid className="border-b border-gray-300 sticky top-0 z-50">
            <NavbarBrand as={Link} href="/">
                <Calendar className="mr-3 h-8 w-8 text-orange-600" />
                <span className="self-center whitespace-nowrap text-xl font-bold text-gray-900">
                    RunEvent
                </span>
            </NavbarBrand>
            <div className="flex md:order-2 gap-2">
                {user ? (
                    <>
                        <Link href="/profile">
                            <Button className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm gap-1 px-5 py-2.5 text-center me-2 mb-2">
                                <img
                                    src={
                                        `${process.env.NEXT_PUBLIC_API_URL}${user.profilePicture}` ||
                                        "https://flowbite.com/docs/images/logo.svg"
                                    } // ganti dengan path avatar user
                                    alt="Avatar"
                                    width={24}
                                    height={24}
                                    className="w-6 h-6 rounded-full object-cover aspect-square"
                                />
                                <span>{user.firstName}</span>
                            </Button>
                        </Link>

                        <Button
                            onClick={logout}
                            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 gap-1 text-center me-2 mb-2"
                        >
                            <LogOut />
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Link href="/login">
                            <Button className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                                Log In
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                                Sign Up
                            </Button>
                        </Link>
                    </>
                )}
            </div>
            <NavbarCollapse>
                {user ? (
                    <>
                        <NavbarLink href="/" active>
                            Find Events
                        </NavbarLink>
                        {user.role === "ORGANIZER" && (
                            <NavbarLink href="/dashboard">Dashboard</NavbarLink>
                        )}
                        <NavbarLink href="/purchase">Pembelian</NavbarLink>
                        <NavbarLink href="/about">About</NavbarLink>
                    </>
                ) : (
                    <></>
                )}
            </NavbarCollapse>
        </Navbar>
    );
}
