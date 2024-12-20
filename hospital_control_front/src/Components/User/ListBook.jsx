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
                                    <th
                                        className="w-[11%] px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        ID đặt phòng
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Khách sạn
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Loại phòng
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Thời gian đặt
                                    </th>
                                    <th
                                        className="w-[10%] px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Số phòng
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Thanh toán
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {listBook.length > 0 && listBook.slice(index * 10, index * 10 + 10).map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-3 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap flex items-center justify-center">{item.booking_id}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-10 h-10">
                                                    <svg fill="#359777" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="30px" viewBox="0 0 31 31" xml:space="preserve" stroke="#359777"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M30,8.049h-3.95l-8.354-4.515c0.058-0.2,0.098-0.406,0.098-0.624c0-1.265-1.025-2.292-2.292-2.292 c-1.266,0-2.292,1.026-2.292,2.292c0,0.218,0.04,0.424,0.097,0.624L4.952,8.049H1c-0.552,0-1,0.448-1,1v20.333c0,0.553,0.448,1,1,1 h29c0.552,0,1-0.447,1-1V9.049C31,8.497,30.552,8.049,30,8.049z M13.803,4.438c0.419,0.466,1.021,0.764,1.697,0.764 s1.277-0.298,1.697-0.763l6.742,3.61H7.06L13.803,4.438z M29,28.383H2V10.05h27V28.383z M3.202,18.919 c0-1.641,2.269-3.205,4.328-3.205c0.172,0,0.333,0.012,0.493,0.023l-0.789,3.675h1.813l0.789-3.675h1.775l-1.96,9.223H7.876 l0.986-4.636H7.049L6.063,24.96H4.288l1.788-8.384c-1.085,0.456-1.726,1.393-1.726,2.698c0,0.629,0.161,0.729,0.173,0.84 C3.67,20.116,3.202,19.808,3.202,18.919z M11.075,23.063c0,1.404,0.826,1.946,1.973,1.946c1.517,0,2.75-1.43,2.947-3.711 c0.368-0.062,0.715-0.167,1.037-0.296l-0.374,1.75c-0.062,0.296-0.1,0.566-0.1,0.801c0,1.036,0.58,1.479,1.318,1.479 c0.512,0,1.348-0.167,2.025-1.149c0.252,0.805,0.908,1.149,1.808,1.149c1.265,0,2.172-0.683,2.847-1.513c0,0.002,0,0.006,0,0.008 c0,1.049,0.578,1.505,1.317,1.505c0.666,0,1.295-0.419,1.354-1.294c-0.072,0.035-0.172,0.072-0.395,0.072 c-0.382,0-0.506-0.209-0.506-0.492c0-0.11,0.025-0.233,0.05-0.357l1.417-6.656l-1.824,0.245l-1.32,6.179 c-0.004,0.021-0.002,0.039-0.008,0.062c-0.604,0.683-1.189,1.208-2.146,1.208c-0.593,0-0.888-0.197-0.888-1.036 c0-0.147,0.012-0.319,0.022-0.493c1.479-0.086,2.836-1.184,2.836-2.601c0-0.617-0.259-1.185-1.354-1.185 c-2.527,0-3.329,2.971-3.329,4.39c0,0.018,0.003,0.032,0.003,0.05c-0.225,0.422-0.574,0.714-0.951,0.714 c-0.345,0-0.505-0.11-0.505-0.456c0-0.111,0.012-0.234,0.049-0.395l0.789-3.699h0.74l0.099-0.493h-0.74l0.42-1.948l-1.824,0.247 l-0.369,1.701h-0.407l-0.101,0.493h0.408l-0.246,1.152c-0.344,0.144-0.693,0.24-0.983,0.24c-0.037,0-0.086,0-0.138-0.023 c0-1.295-0.518-1.973-1.576-1.973C11.914,18.687,11.075,21.646,11.075,23.063z M23.215,19.339c0.234,0,0.309,0.197,0.309,0.505 c0,1.023-0.838,1.974-1.787,2.034C21.982,20.658,22.586,19.339,23.215,19.339z M15.021,20.151c-0.222,0.101-0.382,0.32-0.382,0.666 c0,0.248,0.074,0.457,0.333,0.52c-0.197,1.455-0.826,2.562-1.431,2.562c-0.468,0-0.628-0.185-0.628-0.998 c0-1.209,0.764-3.465,1.64-3.465C14.873,19.438,14.996,19.635,15.021,20.151z M9.821,13.383l-0.667-0.65l0.922-0.134l0.412-0.836 l0.413,0.836l0.922,0.134l-0.667,0.65l0.157,0.919l-0.825-0.434l-0.824,0.434L9.821,13.383z M13.162,13.383l-0.667-0.65 l0.922-0.134l0.413-0.836l0.412,0.836l0.922,0.134l-0.668,0.65l0.158,0.919l-0.824-0.434l-0.825,0.434L13.162,13.383z M16.504,13.383l-0.668-0.65l0.922-0.134l0.412-0.836l0.413,0.836l0.922,0.134l-0.667,0.65l0.157,0.919l-0.825-0.434l-0.824,0.434 L16.504,13.383z M19.846,13.383l-0.669-0.65l0.923-0.134l0.412-0.836l0.412,0.836l0.922,0.134l-0.666,0.65l0.156,0.919 l-0.824-0.434l-0.824,0.434L19.846,13.383z"></path> </g> </g></svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-gray-900 whitespace-no-wrap">
                                                        {item.hotel_name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{item.room_name}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">
                                                {convertTime(item.created_at)}
                                            </p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="flex justify-center text-gray-900 whitespace-no-wrap">
                                                {item.room_count}
                                            </p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <span
                                                className={"relative rounded-full inline-block px-3 py-1 font-semibold leading-tight " + convertClass(item.status)}>
                                                <span aria-hidden
                                                    className="absolute inset-0  opacity-50 rounded-full"></span>
                                                <span className="relative">{item.status}</span>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div
                            className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                            <span className="text-xs xs:text-sm text-gray-900">
                                Hiển thị {index * 10 + 1} -  {Math.min(index * 10 + 10, countIndex)} trong tổng số {countIndex} khách sạn
                            </span>
                            <div className="inline-flex mt-2 xs:mt-0">
                                <button onClick={() => handlePrev()}
                                    className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-l">
                                    Prev
                                </button>
                                &nbsp; &nbsp;
                                <button onClick={() => handleNext()}
                                    className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-r">
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