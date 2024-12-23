import React from "react";
import { useState, useEffect } from "react";
import { axios } from "../../api/axios"

const convertTime = (time) => {
    const date = new Date(time);

    // Format components
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure 2 digits
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' }); // Abbreviated month
    const year = date.getFullYear();

    // Construct formatted string
    return `${hours}h${minutes} ${month} ${day}, ${year}`;
}
const convertClass = (status) => {
    if (status === 'Confirmed') {
        return 'text-green-900 bg-green-200'
    } else if (status === 'Paying') {
        return 'text-orange-900 bg-orange-200 '
    } else {
        return 'text-red-900 bg-red-200 '
    }
}

export default function UserListBook() {
    const [listBook, setListBook] = useState([])
    const [index, setIndex] = useState(0);
    const [countIndex, setCountIndex] = useState(10);
    const [querySearch, setQuerySearch] = useState('');
    const handleNext = () => {
        setIndex((prevIndex) => (prevIndex + 1) % Math.ceil(countIndex / 10));
    };

    const handlePrev = () => {
        setIndex((prevIndex) =>
            prevIndex === 0 ? Math.ceil(countIndex / 10) - 1 : prevIndex - 1
        );
    };
    // Function to fetch bookings
    const fetchBookings = () => {
        axios.post('/getListBooking', { querySearch })
            .then(res => {
                setListBook(res.data.data);
                setCountIndex(res.data.data.length);
            })
            .catch(error => {
                console.error(error);
            });
    };
    useEffect(() => {
        fetchBookings();
    }, [])
    const handleSearch = () => {
        fetchBookings();
    }
    return (
        <div className="bg-white p-8 rounded-md w-full">
            <div className=" flex items-center justify-between pb-6">
                <div>
                    <h2 className="text-gray-600 font-semibold">Khách sạn đã đặt</h2>
                    <span className="text-xs">Tất cả khách sạn</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex bg-gray-50 items-center p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd" />
                        </svg>
                        <input value={querySearch} onChange={(e) => setQuerySearch(e.target.value)} className="bg-gray-50 outline-none ml-1 block " type="text" name="" id="" placeholder="search..." />
                    </div>
                    <div className="lg:ml-40 ml-10 space-x-8">
                        <button onClick={handleSearch} className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">Tìm kiếm</button>
                    </div>
                </div>
            </div>
            <div>
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="w-[11%] px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        ID đặt phòng
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Khách sạn
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Loại phòng
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Thời gian đặt
                                    </th>
                                    <th className="w-[10%] px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Số phòng
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Thanh toán
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {listBook.length > 0 &&
                                    listBook.slice(index * 10, index * 10 + 10).map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition">
                                            <td className="px-3 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                                {item.booking_id}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 w-10 h-10">
                                                        <svg
                                                            fill="#359777"
                                                            version="1.1"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="30px"
                                                            height="30px"
                                                            viewBox="0 0 31 31"
                                                            stroke="#359777"
                                                        >
                                                            <g>
                                                                <path d="M30,8.049h-3.95l-8.354-4.515c0.058-0.2,0.098-0.406,0.098-0.624c0-1.265-1.025-2.292-2.292-2.292 c-1.266,0-2.292,1.026-2.292,2.292c0,0.218,0.04,0.424,0.097,0.624L4.952,8.049H1c-0.552,0-1,0.448-1,1v20.333c0,0.553,0.448,1,1,1 h29c0.552,0,1-0.447,1-1V9.049C31,8.497,30.552,8.049,30,8.049z M13.803,4.438c0.419,0.466,1.021,0.764,1.697,0.764 s1.277-0.298,1.697-0.763l6.742,3.61H7.06L13.803,4.438z M29,28.383H2V10.05h27V28.383z" />
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-gray-900 whitespace-no-wrap">{item.hotel_name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">{item.room_name}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">{convertTime(item.created_at)}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                                {item.room_count}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <span
                                                    className={
                                                        `relative rounded-full inline-block px-3 py-1 font-semibold leading-tight ${convertClass(item.status)}`
                                                    }
                                                >
                                                    <span aria-hidden className="absolute inset-0 opacity-50 rounded-full"></span>
                                                    <span className="relative">{item.status}</span>
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                        <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                            <span className="text-xs xs:text-sm text-gray-900">
                                Hiển thị {index * 10 + 1} - {Math.min(index * 10 + 10, countIndex)} trong tổng số {countIndex} khách sạn
                            </span>
                            <div className="inline-flex mt-2 xs:mt-0">
                                <button
                                    onClick={handlePrev}
                                    className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-l"
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="ml-2 text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-r"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}