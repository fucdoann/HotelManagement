import React, { useState } from "react";

const ImageSlider = ({ setOpenDetail, hotel, currentIndex, setCurrentIndex }) => {
    const baseUrl = import.meta.env.VITE_IMAGE_URL
    const images = hotel.images ? hotel.images : []
    const handleThumbnailClick = (index) => {
        setCurrentIndex(index);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg text-center w-[90%] h-[90%]">
                <nav className=" mx-auto flex justify-between items-center p-4 border-b border-gray-400 border-0.5 mb-3">
                    <div className="flex gap-4 items-center ml-[40%]">
                        <span className="font-bold">Cao Minh Hotel</span>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded">Đặt ngay</button>
                    </div>
                    <button className="flex flex-row items-center" onClick={() => { setOpenDetail(false) }}>
                        <span>Close</span>
                        <svg className="bk-icon -iconset-close_bold" height="32" width="32" viewBox="0 0 128 128" role="presentation" aria-hidden="true" focusable="false"><path d="M75.3 64l26.4-26.3a8 8 0 0 0-11.4-11.4L64 52.7 37.7 26.3a8 8 0 0 0-11.4 11.4L52.7 64 26.3 90.3a8 8 0 0 0 11.3 11.4L64 75.3l26.3 26.4a8 8 0 0 0 11.4-11.4z"></path></svg>
                    </button>
                </nav>
                <div className="w-[80%] mx-auto">
                    {/* Main Image */}
                    <div className="relative">
                        <img
                            src={`${baseUrl}${images[currentIndex]}`}
                            alt={`Slide ${currentIndex + 1}`}
                            className="w-full object-cover rounded-lg"
                        />
                        {/* Navigation Buttons */}
                        <button
                            onClick={handlePrev}
                            className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white p-2 rounded-full hover:bg-gray-400"
                        >
                            <svg className="bk-icon -iconset-navarrow_left" height="50" width="50" viewBox="0 0 128 128" role="presentation" aria-hidden="true" focusable="false"><path d="M73.7 96a4 4 0 0 1-2.9-1.2L40 64l30.8-30.8a4 4 0 0 1 5.7 5.6L51.3 64l25.2 25.2a4 4 0 0 1-2.8 6.8z"></path></svg>
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white p-2 rounded-full hover:bg-gray-400"
                        >
                            <svg className="bk-icon -iconset-navarrow_right" height="50" width="50" viewBox="0 0 128 128" role="presentation" aria-hidden="true" focusable="false"><path d="M54.3 96a4 4 0 0 1-2.8-6.8L76.7 64 51.5 38.8a4 4 0 0 1 5.7-5.6L88 64 57.2 94.8a4 4 0 0 1-2.9 1.2z"></path></svg>
                        </button>
                    </div>

                    {/* Thumbnails */}
                    <div className="flex justify-center mt-4 space-x-2">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => handleThumbnailClick(index)}
                                className={`border-2 rounded-lg overflow-hidden ${currentIndex === index ? "border-blue-500" : "border-gray-300 opacity-50"
                                    }`}
                            >
                                <img
                                    src={`${baseUrl}${image}`}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-20 h-20 object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageSlider;
