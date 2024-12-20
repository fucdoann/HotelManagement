import React from "react"
const PayMentFail = () => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-full md:w-3/4 lg:w-2/3 xl:w-1/2 rounded-lg shadow-lg p-6 overflow-y-auto">
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)] w-full md:w-3/4 lg:w-1/2 rounded-lg bg-white p-6 text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Thanh toán không thành công</h2>
                        <p className="text-gray-700 mb-6">
                            Thanh toán cho giao dịch đặt phòng của bạn đã thất bại, vui lòng quay trở lại trang đặt phòng.
                        </p>
                        <button
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            onClick={() => window.location.reload()}
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PayMentFail