"use client";

import Link from "next/link";
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
        <Navbar fluid className="border-b shadow-sm">
            <NavbarBrand as={Link} href="/">
                <Calendar className="mr-3 h-8 w-8 text-orange-600" />
                <span className="self-center whitespace-nowrap text-xl font-bold text-gray-900">
                    RunEvent
                </span>
            </NavbarBrand>
            <div className="flex md:order-2 gap-2">
                <Link href="/login">
                    <Button color="light" size="sm">
                        Log In
                    </Button>
                </Link>
                <Link href="/register">
                    <Button color="warning" size="sm">
                        Sign Up
                    </Button>
                </Link>
                <NavbarToggle />
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
