"use client";

import { useState, useEffect } from "react";

const slides = [
    {
        title: "MARATHON JAKARTA 2024",
        subtitle: "SIAP BERLARI?",
        cta: "Dapatkan Tiket Sekarang",
        image: "https://images.pexels.com/photos/2402926/pexels-photo-2402926.jpeg?auto=compress&cs=tinysrgb&w=1920",
    },
    {
        title: "FUN RUN BALI",
        subtitle: "LARI DI PANTAI",
        cta: "Dapatkan Tiket Sekarang",
        image: "https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&w=1920",
    },
    {
        title: "TRAIL RUN BOGOR",
        subtitle: "TANTANG DIRIMU",
        cta: "Dapatkan Tiket Sekarang",
        image: "https://images.pexels.com/photos/221210/pexels-photo-221210.jpeg?auto=compress&cs=tinysrgb&w=1920",
    },
];

export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="relative w-full h-[500px] overflow-hidden bg-black">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                        index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-40" />
                    </div>

                    <div className="relative h-full flex items-center justify-center text-center px-4">
                        <div className="max-w-4xl">
                            <h2 className="text-white text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
                                {slide.subtitle}
                            </h2>
                            <h1 className="text-orange-400 text-6xl md:text-8xl font-black mb-8 drop-shadow-lg stroke-text">
                                {slide.title}
                            </h1>
                            <button className="bg-lime-400 text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-lime-300 transition-all transform hover:scale-105 shadow-lg">
                                {slide.cta}
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={prevSlide}
                className="absolute left-8 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-all"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-8 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-all"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                            index === currentSlide
                                ? "bg-white w-8"
                                : "bg-white bg-opacity-50"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
