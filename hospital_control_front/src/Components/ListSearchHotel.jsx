import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axios } from "../api/axios"

const FilterSection = () => {
    return (
        <div className="w-64 bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Bộ lọc tiện ích</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold">Thanh toán</h4>
                    <label className="block">
                        <input type="checkbox" className="mr-2" /> Thanh toán tại khách sạn
                    </label>
                    <label className="block">
                        <input type="checkbox" className="mr-2" /> Thanh toán online
                    </label>
                </div>

                <div>
                    <h4 className="font-semibold">Ăn uống</h4>
                    <label className="block">
                        <input type="checkbox" className="mr-2" /> Buffet ăn sáng tại khách sạn
                    </label>
                    <label className="block">
                        <input type="checkbox" className="mr-2" /> Tất cả bữa ăn tại khách sạn
                    </label>
                </div>

                <div>
                    <h4 className="font-semibold">Tiện ích khác</h4>
                    <label className="block">
                        <input type="checkbox" className="mr-2" /> Parking
                    </label>
                    <label className="block">
                        <input type="checkbox" className="mr-2" /> Free Wi-Fi
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
                        <div key={index} className="border rounded-lg shadow-lg p-4 flex bg-white mb-3">
                            {/* Left Section: Image */}
                            <div className="w-1/3">
                                <img
                                    src={`${hotel.images.length ? baseUrl + hotel.images[0] : 'https://as2.ftcdn.net/v2/jpg/07/91/22/59/1000_F_791225927_caRPPH99D6D1iFonkCRmCGzkJPf36QDw.jpg'}`} // Replace with your image source
                                    alt="Hotel"
                                    className="rounded-lg w-full h-full object-cover"
                                />
                            </div>

                            {/* Right Section: Hotel Info */}
                            <div className="w-2/3 pl-4 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-blue-600 font-bold text-3xl">
                                            {hotel.name}
                                        </h2>
                                        <div className="text-[#ff9128] text-lg flex items-center">
                                            ★★★★
                                        </div>
                                    </div>
                                    <div className="text-blue-400 text-[1rem]">
                                        <a href="#" className="hover:underline">{hotel.provinceName}</a> ·{" "}
                                        <a href="#" className="hover:underline">Xem trên bản đồ</a>
                                    </div>

                                    <p className="font-semibold mt-2">
                                        <span className="font-bold">Phòng Superior Có Giường Cỡ King</span>
                                        <br />
                                        1 giường đôi cực lớn
                                    </p>
                                </div>

                                {/* Price and Availability */}
                                <div className="flex justify-between items-center mt-4">
                                    <div>
                                        <p className="text-gray-500 text-sm">2 đêm, 2 người lớn</p>
                                        <p className="text-lg font-bold text-gray-800">US${hotel.min_price}</p>
                                        <p className="text-gray-500 text-xs">Đã bao gồm thuế và phí</p>
                                    </div>

                                    <button onClick={() => { navigate(`/hotel/detail?id=${hotel.hotel_id}`) }} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                        Xem chỗ trống
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hotels found for your search criteria. Try adjusting the filters.</p>
                )}
            </div>
        </div>
    );
};
export default ListSearchHotel;