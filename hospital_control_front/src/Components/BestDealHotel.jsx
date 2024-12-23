import React from "react";
import { useNavigate } from "react-router-dom";

const BookingCard = () => {

    const navigate = useNavigate();
    const places = [
        {
            id: 1,
            name: 'Hà Nội',
            url: '/hotel/searchresult?ss=Thành phố Hà Nội&province=01&district=0&commune=0&checkin=4890693300541&checkout=4890779700541&children=0&adults=0&rooms=0',
        },
        {
            id: 2,
            name: 'Hồ Chí Minh',
            url: '/hotel/searchresult?ss=Thành phố Hồ Chí Minh&province=79&district=0&commune=0&checkin=4890693300541&checkout=4890779700541&children=0&adults=0&rooms=0',
        }, {
            id: 3,
            name: 'Đà Nẵng',
            url: '/hotel/searchresult?ss=Thành phố Hải Phòng&province=31&district=0&commune=0&checkin=4890693300541&checkout=4890779700541&children=0&adults=0&rooms=0',
        }, {
            id: 4,
            name: 'Hải Phòng',
            url: '/hotel/searchresult?ss=Thành phố Hải Phòng&province=31&district=0&commune=0&checkin=4890693300541&checkout=4890779700541&children=0&adults=0&rooms=0',
        }, {
            id: 5,
            name: 'Nghệ An',
            url: '/hotel/searchresult?ss=Tỉnh Nghệ An&province=40&district=0&commune=0&checkin=4890693300541&checkout=4890779700541&children=0&adults=0&rooms=0',
        }, {
            id: 6,
            name: 'Quảng Ninh',
            url: '/hotel/searchresult?ss=Tỉnh Quảng Ninh&province=22&district=0&commune=0&checkin=4890693300541&checkout=4890779700541&children=0&adults=0&rooms=0',
        }, {
            id: 7,
            name: 'Lào Cai',
            url: '/hotel/searchresult?ss=Tỉnh Lào Cai&province=10&district=0&commune=0&checkin=4890693300541&checkout=4890779700541&children=0&adults=0&rooms=0',
        },
        { 
            id: 8, 
            name: 'Tất cả', 
            url: '/hotel/searchresult?ss=Việt Nam&province=0&district=0&commune=0&checkin=4890693300541&checkout=4890779700541&children=0&adults=0&rooms=0', 
          },
    ];
    return (

        <div className="relative flex items-center justify-center mt-14">
            <div
                className="relative pb-11 w-8/12 bg-cover bg-center rounded-t-3xl shadow-lg overflow-hidden"
                style={{
                    backgroundImage: "url('https://tse3.mm.bing.net/th?id=OIP.e-HWIfjqkZQk5zKUQwTv4QAAAA&pid=Api')",
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50">
                    <div className="absolute top-0 h-40 w-full bg-gradient-to-b from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 h-40 w-full bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </div>

                {/* Bottom Fade Effect */}
                <div className="absolute inset-0">
                    <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-white to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center text-white px-6 py-10">
                    <h1 className="text-4xl font-bold mb-4">
                        Khám phá thời gian đặt phòng tốt nhất của bạn
                    </h1>

                    <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 w-10/12 max-w-4xl">
                        {/* City Buttons */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
                            {places.map((city) => (
                                <button
                                    onClick={() => {navigate(city.url)}}
                                    key={city.id}
                                    className="px-4 py-2 bg-blue-100 text-blue-600 font-medium rounded-lg hover:bg-blue-600 hover:text-white transition duration-300"
                                >
                                    {city.name}
                                </button>
                            ))}
                        </div>

                        {/* Pricing Information */}
                        <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
                            {[
                                { month: "November", price: "VND 300.000 - 350.000" },
                                { month: "December", price: "VND 200.000 - 300.000" },
                                { month: "January", price: "VND 200.000 - 400.000" },
                                { month: "February", price: "VND 500.000 - 800.000" },
                                { month: "March", price: "VND 500.000 - 700.000" },
                                { month: "April", price: "VND 400.000 - 500.000" },
                                { month: "May", price: "VND 200.000 - 1.000.000" },
                                { month: "June", price: "VND 400.000 - 900.000" },
                                { month: "July", price: "VND 900.000 - 1.000.000" },
                                { month: "August", price: "VND 400.000 - 700.000" },
                                { month: "September", price: "VND 600.000 - 800.000" },
                                { month: "October", price: "VND 1.000.000 - 1.300.000" },
                            ].map(({ month, price }) => (
                                <div
                                    key={month}
                                    className="flex flex-col items-start justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-300"
                                >
                                    <span className="font-semibold text-gray-700">{month}</span>
                                    <span className="text-blue-600 font-medium">{price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default BookingCard;
