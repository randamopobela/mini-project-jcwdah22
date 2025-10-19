"use client";

import { useState } from "react";

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <div className="flex-shrink-0">
                            <span className="text-2xl font-bold text-orange-600">
                                RunTicket
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-2 flex-1 max-w-2xl">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Cari event lari..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Pilih lokasi"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    className="w-48 px-4 py-2 border-t border-b border-r border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <button className="bg-orange-600 text-white px-6 py-2 rounded-r-lg hover:bg-orange-700 transition-colors">
                                Cari
                            </button>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-6">
                        <a
                            href="#"
                            className="text-gray-700 hover:text-orange-600 transition-colors"
                        >
                            Temukan Event
                        </a>
                        <a
                            href="#"
                            className="text-gray-700 hover:text-orange-600 transition-colors"
                        >
                            Buat Event
                        </a>
                        <a
                            href="#"
                            className="text-gray-700 hover:text-orange-600 transition-colors"
                        >
                            Tiket Saya
                        </a>
                        <button className="text-gray-700 hover:text-orange-600 transition-colors">
                            Masuk
                        </button>
                        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                            Daftar
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
}
