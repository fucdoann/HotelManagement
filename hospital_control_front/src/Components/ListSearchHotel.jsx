import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axios } from "../api/axios"

const FilterSection = () => {
    return (
        <div className="w-72 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">
                Bộ lọc tiện ích
            </h3>
            <div className="space-y-6">
                {/* Thanh toán Section */}
                <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
                        <span className="material-icons text-blue-500 mr-2">Thanh toán</span>
                    </h4>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" className="form-checkbox text-blue-600 rounded" />
                        <span>Thanh toán tại khách sạn</span>
                    </label>
                    <label className="flex items-center space-x-2 mt-2">
                        <input type="checkbox" className="form-checkbox text-blue-600 rounded" />
                        <span>Thanh toán online</span>
                    </label>
                </div>

                {/* Ăn uống Section */}
                <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
                        <span className="material-icons text-blue-600  mr-2">Ăn uống</span>
                    </h4>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" className="form-checkbox text-blue-600  rounded" />
                        <span>Buffet ăn sáng tại khách sạn</span>
                    </label>
                    <label className="flex items-center space-x-2 mt-2">
                        <input type="checkbox" className="form-checkbox text-blue-600  rounded" />
                        <span>Tất cả bữa ăn tại khách sạn</span>
                    </label>
                </div>

                {/* Tiện ích khác Section */}
                <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
                        <span className="material-icons text-blue-600  mr-2">Tiện ích khác</span>
                    </h4>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" className="form-checkbox text-blue-600 rounded" />
                        <span>Parking</span>
                    </label>
                    <label className="flex items-center space-x-2 mt-2">
                        <input type="checkbox" className="form-checkbox text-blue-600  rounded" />
                        <span>Free Wi-Fi</span>
                    </label>
                </div>
            </div>
        </div>

    );
};

const ListSearchHotel = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_IMAGE_URL
    const queryParams = new URLSearchParams(location.search);
    const [children, setChildren] = useState(Number(queryParams.get('children') || 0));
    const [adults, setAdults] = useState(Number(queryParams.get('adults') || 0));
    const [rooms, setRooms] = useState(Number(queryParams.get('rooms') || 1));
    const [province, setProvince] = useState(queryParams.get('province') || '');
    const [district, setDistrict] = useState(queryParams.get('district') || '');
    const [commune, setCommune] = useState(queryParams.get('commune') || '');
    const [checkin, setCheckin] = useState(queryParams.get('checkin') || '');
    const [checkout, setCheckout] = useState(queryParams.get('checkout') || '');
    const guest = children + adults; // Dynamically calculate the total guests
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('/hotel_search', {
                    'check_in_date': checkin,
                    'check_out_date': checkout,
                    'commune': commune,
                    'district': district,
                    'province': province,
                    'guest_count': guest,
                    'rooms': rooms,
                })
                setHotels(response.data.data)
            }
            catch (error) {
                console.error(error)
            }
        };

        fetchData();
    }, [province, district, commune, checkin, checkout, guest, rooms]);
    return (
        <div className="flex p-8 space-x-8 w-[75%] m-auto justify-center">
            <FilterSection />
            <div className="w-[60%]">
                {hotels ? (
                    hotels.map((hotel, index) => (
                        <div
                            key={index}
                            className="border rounded-lg shadow-md p-4 flex bg-white mb-5 hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Left Section: Image */}
                            <div className="w-1/3">
                                <img
                                    src={`${hotel.images.length ? baseUrl + hotel.images[0] : 'https://as2.ftcdn.net/v2/jpg/07/91/22/59/1000_F_791225927_caRPPH99D6D1iFonkCRmCGzkJPf36QDw.jpg'}`}
                                    alt="Hotel"
                                    className="rounded-lg w-full h-40 object-cover"
                                />
                            </div>

                            {/* Right Section: Hotel Info */}
                            <div className="w-2/3 pl-4 flex flex-col justify-between">
                                {/* Hotel Name and Rating */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-blue-600 font-bold text-2xl truncate">
                                            {hotel.name}
                                        </h2>
                                        <div className="text-[#ff9128] text-xl flex items-center space-x-1">
                                            {'★'.repeat(hotel.star_rating || 4)}
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="text-blue-400 text-sm mt-1">
                                        <a href="#" className="hover:underline">{hotel.provinceName}</a> ·{" "}
                                        <a href="#" className="hover:underline">Xem trên bản đồ</a>
                                    </div>

                                    {/* Hotel Conveniences */}
                                    {hotel.hot_conve && hotel.hot_conve.length > 0 && (
                                        <p className="font-semibold text-gray-600 mt-3 text-sm space-y-1">
                                            {hotel.hot_conve.map((item, idx) => (
                                                <span key={idx} className="block">- {item}</span>
                                            ))}
                                        </p>
                                    )}
                                </div>

                                {/* Price and Availability */}
                                <div className="flex justify-between items-center mt-5">
                                    <div>
                                        <p className="text-gray-500 text-sm">1 đêm, 2 người lớn</p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(hotel.min_price || 0)}
                                        </p>
                                        <p className="text-gray-500 text-xs">Đã bao gồm thuế và phí</p>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/hotel/detail?id=${hotel.hotel_id}`)}
                                        className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                    >
                                        Xem chỗ trống
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">
                        Không tìm thấy khách sạn phù hợp với tiêu chí của bạn. Vui lòng thử thay đổi bộ lọc.
                    </p>
                )}
            </div>

        </div>
    );
};
export default ListSearchHotel;