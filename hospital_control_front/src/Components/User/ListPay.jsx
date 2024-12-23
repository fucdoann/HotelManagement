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
    if (status === 'confirmed') {
        return 'text-green-900 bg-green-200'
    } else if (status === 'pending') {
        return 'text-orange-900 bg-orange-200 '
    } else {
        return 'text-red-900 bg-red-200 '
    }
}

export default function UserListPay() {
    const [listpay, setListPay] = useState([])
    const [index, setIndex] = useState(0);
    const [countIndex, setCountIndex] = useState(10);
    const [querySearch, setQuerySearch] = useState('');
    const [total, setTotal] = useState(0);
    const handleNext = () => {
        setIndex((prevIndex) => (prevIndex + 1) % Math.ceil(countIndex / 10));
    };

    const handlePrev = () => {
        setIndex((prevIndex) =>
            prevIndex === 0 ? Math.ceil(countIndex / 10) - 1 : prevIndex - 1
        );
    };
    // Function to fetch bookings
    const fetchPayings = () => {
        axios.post('/getListPaymentSuccess', { querySearch })
            .then(res => {
                setListPay(res.data.data);
                setCountIndex(res.data.data.length);
                setTotal(res.data.amount);
            })
            .catch(error => {
                console.error(error);
            });
    };
    useEffect(() => {
        fetchPayings();
    }, [])
    const handleSearch = () => {
        fetchPayings();
    }
    return (
        <div className="bg-white p-8 rounded-md w-full">
            <div className=" flex items-center justify-between pb-6">
                <div>
                    <h2 className="text-gray-600 font-semibold">Đơn thanh toán thành công</h2>
                    <span className="text-xs">Tất cả đơn</span>
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
            <div className="overflow-x-auto px-4 sm:px-8 py-4">
    <div className="inline-block min-w-full shadow-lg rounded-lg overflow-hidden bg-white">
        <table className="min-w-full table-auto leading-normal">
            <thead>
                <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        ID đơn thanh toán
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Đơn đặt phòng
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Thời gian thanh toán
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Số tiền
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Trạng thái
                    </th>
                </tr>
            </thead>
            <tbody>
                {listpay.length > 0 &&
                    listpay.slice(index * 10, index * 10 + 10).map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                            <td className="px-6 py-4 border-b border-gray-200 text-center text-sm">
                                {item.id}
                            </td>
                            <td className="px-6 py-4 border-b border-gray-200 text-sm">
                                <div className="flex items-center">
                                    <div className="ml-3">
                                        <p className="text-gray-900">{item.booking_id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 border-b border-gray-200 text-sm">
                                <p className="text-gray-900">{convertTime(item.created_at)}</p>
                            </td>
                            <td className="px-6 py-4 border-b border-gray-200 text-center text-sm">
                                {item.amount} VND
                            </td>
                            <td className="px-6 py-4 border-b border-gray-200 text-sm">
                                <span
                                    className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${convertClass(item.status)}`}
                                >
                                    <span className="absolute inset-0 opacity-50 rounded-full"></span>
                                    <span className="relative">{item.status}</span>
                                </span>
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>

        {/* Display Total Amount */}
        <div className="px-6 py-4 border-t border-gray-200 text-right">
            <span className="text-xl font-semibold text-gray-900">Tổng số tiền đã thanh toán: {total} VND</span>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-5 bg-gray-50 flex justify-between items-center">
            <span className="text-xs text-gray-900">
                Hiển thị {index * 10 + 1} - {Math.min(index * 10 + 10, countIndex)} trong tổng số {countIndex} đơn thanh toán
            </span>
            <div className="inline-flex mt-2">
                <button
                    onClick={handlePrev}
                    className="text-sm text-white transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-l shadow-md"
                >
                    Prev
                </button>
                <button
                    onClick={handleNext}
                    className="ml-2 text-sm text-white transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-r shadow-md"
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