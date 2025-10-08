import CategorySection from "@/components/bold/CategorySection";
import EventSection from "@/components/bold/EventSection";
import Footer from "@/components/bold/Footer";
import Header from "@/components/bold/Header";
import HeroCarousel from "@/components/bold/HeroCarousel";
import Image from "next/image";

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <Header />
            <HeroCarousel />
            <CategorySection />
            <EventSection />
            <Footer />
        </main>
    );
}
