import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '../components/Layout';
import slide1 from '../assets/slide1.jpeg';
import slide2 from '../assets/slide2.jpeg';
import slide3 from '../assets/slide3.jpeg';
import slide4 from '../assets/slide4.jpeg';
import slide5 from '../assets/slide5.jpeg';

const CampaignPage = () => {
    const slides = [
        {
            image: slide1,
            title: 'Slide 1',
        },
        {
            image: slide2,
            title: 'Slide 2',
        },
        {
            image: slide3,
            title: 'Slide 3',
        },
        {
            image: slide4,
            title: 'Slide 4',
        },
        {
            image: slide5,
            title: 'Slide 5',
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold text-green-800 mb-4">
                            Our Campaign
                        </h1>
                        <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                            Join us on a journey towards a sustainable future. Our campaign is dedicated to raising awareness about carbon footprint reduction and promoting eco-friendly practices. Together, we can make a significant impact on our planet by adopting conscious choices and supporting green initiatives. Every action counts, no matter how small. Let's build a greener world for future generations.
                        </p>
                    </div>

                    {/* Slideshow Container */}
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                        <div className="relative w-full h-96 bg-gray-200 flex items-center justify-center">
                            {/* Slide Image */}
                            <img
                                src={slides[currentSlide].image}
                                alt={slides[currentSlide].title}
                                className="w-full h-full object-cover"
                            />

                            {/* Previous Button */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-green-600 hover:text-white text-gray-800 rounded-full p-3 transition-all duration-300 shadow-lg hover:shadow-xl z-10"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft size={32} />
                            </button>

                            {/* Next Button */}
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-green-600 hover:text-white text-gray-800 rounded-full p-3 transition-all duration-300 shadow-lg hover:shadow-xl z-10"
                                aria-label="Next slide"
                            >
                                <ChevronRight size={32} />
                            </button>

                            {/* Slide Counter */}
                            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                {currentSlide + 1} / {slides.length}
                            </div>
                        </div>

                        {/* Slide Indicators */}
                        <div className="flex justify-center gap-2 p-6 bg-gray-50">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                            ? 'bg-green-600 w-8'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Campaign Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-xl font-bold text-green-700 mb-2">🌍 Our Mission</h3>
                            <p className="text-gray-600">
                                To empower individuals and organizations to reduce their carbon footprint and contribute to a more sustainable planet.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-xl font-bold text-green-700 mb-2">🎯 Our Goal</h3>
                            <p className="text-gray-600">
                                To create measurable impact by helping users track, understand, and reduce their environmental impact through informed choices.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <h3 className="text-xl font-bold text-green-700 mb-2">💚 Our Vision</h3>
                            <p className="text-gray-600">
                                A world where everyone is conscious of their carbon footprint and actively participates in building a sustainable future.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CampaignPage;
