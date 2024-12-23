import React from "react";
import { useState, useEffect } from "react";
import { axios } from "../../api/axios"
import Loader from "../../common/Loader";

const SvgIcon = ({ svgString }) => {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: svgString,
        }}
      />
    );
  };
const RoomDetail = ({ room_id,setShowRoom }) => {
    const baseUrl = import.meta.env.VITE_IMAGE_URL;
    const [room, setRoom] = useState({ images: [] });
    const images = room.images ? room.images : []

    const [currentIndex, setCurrentIndex] = useState(0);
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
    const [loading, setLoading] = useState(true);  // To track loading state
    const [error, setError] = useState(null);  // To track any errors

    // Fetch room details when room_id changes
    useEffect(() => {
        console.log(room_id)
        if (room_id) {
            setLoading(true);  // Start loading
            setError(null);  // Reset error

            // Perform the API call
            axios
                .post('/getRoom', { room_id })
                .then(async (response) => {
                    const roomData = response.data.data
                    try {
                        const convenientsRoom = await axios
                            .post("/getConve", {
                                'arrayConve': roomData.arrayConve,
                                'type': 'room'
                            });
                        const convenients = convenientsRoom.data.data;
                        return {
                            ...roomData,
                            convenients, // Add convenients to room data
                        }
                    }
                    catch (error) {
                        console.error(`Error fetching conveniences for room ${roomData.room_id}:`, error);
                        return roomData;
                    }

                })
                .then(roomWithConvenients => {
                    console.log(roomWithConvenients)
                    setRoom(roomWithConvenients);  // Store the fetched data
                })
                .catch((err) => {
                    setError("Failed to fetch room details");  // Handle error
                })
                .finally(() => {
                    setLoading(false);  // Stop loading
                });
        }
    }, [room_id]);  // Dependency array: re-fetch when room_id changes

    if (loading) {
        return <Loader></Loader>  // Show loading state
    }
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-full md:w-3/4 lg:w-2/3 xl:w-1/2 rounded-lg shadow-lg p-6 overflow-y-auto">
            <button className="flex w-full justify-end" onClick={() => { setShowRoom(false) }}>
                        <svg className="bk-icon -iconset-close_bold" height="32" width="32" viewBox="0 0 128 128" role="presentation" aria-hidden="true" focusable="false"><path d="M75.3 64l26.4-26.3a8 8 0 0 0-11.4-11.4L64 52.7 37.7 26.3a8 8 0 0 0-11.4 11.4L52.7 64 26.3 90.3a8 8 0 0 0 11.3 11.4L64 75.3l26.3 26.4a8 8 0 0 0 11.4-11.4z"></path></svg>
                    </button>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                        <div className="w-[80%] mx-auto">
                            {/* Main Image */}
                            <div className="relative">
                                <img
                                    src={`${baseUrl}${room.images[currentIndex]}`}
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
                                {room.images.map((image, index) => (
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

                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900">{room.name}</h2>
                        <p className="text-gray-700 mt-2">Diện tích {room.area}m²</p>
                        <p className="text-gray-700">Giường thoải mái. Dựa trên 32 đánh giá</p>
                        <p className="text-gray-700 mt-2">
                            {room.description}
                        </p>

                        <h3 className="font-semibold text-gray-900 mt-4">Tiện nghi phòng riêng của bạn:</h3>
                        <ul className="list-disc ml-6 mt-2">
                            {room.convenient && room.convenient.map((item, index) => (
                                <li key={index} className="text-gray-700">{item}</li>
                            ))}
                            <li className="text-gray-700">Đồ vệ sinh cá nhân miễn phí</li>
                            <li className="text-gray-700">Vòi sen</li>
                            <li className="text-gray-700">Chậu rửa vệ sinh (bidet)</li>
                        </ul>

                        <h3 className="font-semibold text-gray-900 mt-4">Hướng tầm nhìn:</h3>
                        <p className="text-gray-700">{room.view_room}</p>

                        <h3 className="font-semibold text-gray-900 mt-4">Tiện nghi:</h3>
                        <ul className=" ml-6 mt-2">
                            {room.convenients.length && room.convenients.map((item, index)=>(
                                <>
                                 <li key={index} className=" text-gray-700 flex flex-row gap-2"> <svg class="bk-icon -streamline-checkmark" fill="" size="small" width="14" height="14" viewBox="0 0 128 128"><path d="M56.33 100a4 4 0 0 1-2.82-1.16L20.68 66.12a4 4 0 1 1 5.64-5.65l29.57 29.46 45.42-60.33a4 4 0 1 1 6.38 4.8l-48.17 64a4 4 0 0 1-2.91 1.6z"></path></svg> {item.convenient_name}</li>
                                </>
                            ))}
                        </ul>

                        <h3 className="font-semibold text-gray-900 mt-4">Hút thuốc:</h3>
                        <p className="text-gray-700">Không hút thuốc</p>

                        <div className="flex justify-between items-center mt-6">
                            <p className="text-lg font-semibold text-gray-900">VND {room.price_per_night} cho 1 đêm</p>
                            <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Đặt ngay</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetail;