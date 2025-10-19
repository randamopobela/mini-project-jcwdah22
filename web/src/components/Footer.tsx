"use client";

import {
    Footer,
    FooterTitle,
    FooterLinkGroup,
    FooterLink,
    FooterCopyright,
    FooterIcon,
} from "flowbite-react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function FooterComponent() {
    return (
        <Footer container className="rounded-none border-t">
            <div className="w-full">
                <div className="grid w-full grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4">
                    <div>
                        <FooterTitle title="Use RunEvent" />
                        <FooterLinkGroup col>
                            <FooterLink href="/">Browse Events</FooterLink>
                            <FooterLink href="/dashboard">
                                Create Events
                            </FooterLink>
                            <FooterLink href="/pricing">Pricing</FooterLink>
                            <FooterLink href="/mobile">Mobile App</FooterLink>
                        </FooterLinkGroup>
                    </div>
                    <div>
                        <FooterTitle title="Plan Events" />
                        <FooterLinkGroup col>
                            <FooterLink href="/dashboard/create-event">
                                Create Event
                            </FooterLink>
                            <FooterLink href="/pricing">Pricing</FooterLink>
                            <FooterLink href="/resources">Resources</FooterLink>
                            <FooterLink href="/blog">Event Planning</FooterLink>
                        </FooterLinkGroup>
                    </div>
                    <div>
                        <FooterTitle title="Connect" />
                        <FooterLinkGroup col>
                            <FooterLink href="/about">About Us</FooterLink>
                            <FooterLink href="/contact">Contact Us</FooterLink>
                            <FooterLink href="/help">Help Center</FooterLink>
                            <FooterLink href="/careers">Careers</FooterLink>
                        </FooterLinkGroup>
                    </div>
                    <div>
                        <FooterTitle title="Legal" />
                        <FooterLinkGroup col>
                            <FooterLink href="/terms">
                                Terms of Service
                            </FooterLink>
                            <FooterLink href="/privacy">
                                Privacy Policy
                            </FooterLink>
                            <FooterLink href="/cookies">
                                Cookie Policy
                            </FooterLink>
                            <FooterLink href="/accessibility">
                                Accessibility
                            </FooterLink>
                        </FooterLinkGroup>
                    </div>
                </div>
                <div className="w-full bg-gray-100 px-4 py-6 sm:flex sm:items-center sm:justify-between">
                    <FooterCopyright href="/" by="RunEvent™" year={2024} />
                    <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                        <FooterIcon href="#" icon={Facebook} />
                        <FooterIcon href="#" icon={Twitter} />
                        <FooterIcon href="#" icon={Instagram} />
                        <FooterIcon href="#" icon={Linkedin} />
                    </div>
                </div>
            </div>
        </Footer>
    );
}
