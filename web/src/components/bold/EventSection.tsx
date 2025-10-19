export default function EventSection() {
    const events = [
        {
            title: "Jakarta Marathon 2024",
            date: "15 Nov 2024",
            location: "Jakarta, Indonesia",
            price: "Rp 250.000",
            image: "https://images.pexels.com/photos/2402926/pexels-photo-2402926.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "Marathon",
        },
        {
            title: "Bali Fun Run",
            date: "22 Nov 2024",
            location: "Bali, Indonesia",
            price: "Rp 150.000",
            image: "https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "Fun Run",
        },
        {
            title: "Bandung Trail Run",
            date: "30 Nov 2024",
            location: "Bandung, Indonesia",
            price: "Rp 200.000",
            image: "https://images.pexels.com/photos/221210/pexels-photo-221210.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "Trail Run",
        },
        {
            title: "Surabaya Color Run",
            date: "5 Des 2024",
            location: "Surabaya, Indonesia",
            price: "Rp 175.000",
            image: "https://images.pexels.com/photos/2402926/pexels-photo-2402926.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "Color Run",
        },
        {
            title: "Yogyakarta Half Marathon",
            date: "10 Des 2024",
            location: "Yogyakarta, Indonesia",
            price: "Rp 225.000",
            image: "https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "Half Marathon",
        },
        {
            title: "Medan Virtual Run",
            date: "15 Des 2024",
            location: "Online",
            price: "Rp 100.000",
            image: "https://images.pexels.com/photos/221210/pexels-photo-221210.jpeg?auto=compress&cs=tinysrgb&w=600",
            category: "Virtual Run",
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Event Lari di Indonesia
                        </h2>
                        <div className="flex items-center gap-2 text-sm">
                            <button className="text-orange-600 font-semibold flex items-center gap-1">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                Pilih lokasi
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                                    style={{
                                        backgroundImage: `url(${event.image})`,
                                    }}
                                />
                                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                                    {event.category}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                    {event.title}
                                </h3>
                                <div className="flex items-center text-sm text-gray-600 mb-1">
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    {event.date}
                                </div>
                                <div className="flex items-center text-sm text-gray-600 mb-3">
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    {event.location}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-orange-600">
                                        {event.price}
                                    </span>
                                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold">
                                        Beli Tiket
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <button className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                        Lihat Semua Event
                    </button>
                </div>
            </div>
        </section>
    );
}
