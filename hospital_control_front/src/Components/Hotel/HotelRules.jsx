import React from "react";
export default function HotelRules() {
    return (
        <a name="rules" className="flex w-full items-center justify-center flex-col">
            <h2 className=" w-[80%] text-3xl font-bold mb-4 flex items-start justify-start">Quy tắc chung</h2>
            <div className="w-[80%] p-6 bg-white rounded-lg shadow-md">
                <p className="text-gray-600 mb-6">
                    Cao Minh Hotel nhận yêu cầu đặc biệt - gửi yêu cầu trong bước kế tiếp!
                </p>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-lg">➡️</span>
                            <span className="font-semibold">Nhận phòng</span>
                        </div>
                        <span className="text-gray-600">Từ 14:00 - 23:30</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-lg">⬅️</span>
                            <span className="font-semibold">Trả phòng</span>
                        </div>
                        <span className="text-gray-600">Đến 12:00</span>
                    </div>

                    <div className="space-y-2">
                        <span className="font-semibold">Hủy đặt phòng/ Trả trước</span>
                        <p className="text-gray-600">
                            Các chính sách hủy và thanh toán trước sẽ khác nhau tùy vào từng loại chỗ
                            nghỉ. Vui lòng{' '}
                            <a href="#" className="text-blue-500 underline">
                                nhập ngày lưu trú
                            </a>{' '}
                            và xem điều kiện áp dụng cho lựa chọn chỗ nghỉ của bạn.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <span className="font-semibold">Đặt cọc đề phòng hư hại có thể hoàn lại</span>
                        <p className="text-gray-600">
                            Yêu cầu VND 1.000.000 tiền đặt cọc đề phòng hư hại khi đến nghỉ. Số tiền
                            này tương đương US$39. Số tiền này sẽ được chỗ nghỉ thu bằng tiền mặt. Bạn
                            sẽ được hoàn lại khi trả phòng. Tiền đặt cọc của bạn sẽ được hoàn lại
                            toàn bộ bằng tiền mặt, nhưng cũng phụ thuộc vào mức hư hại mà bạn có thể
                            gây ra tại chỗ nghỉ.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <span className="font-semibold">Trẻ em và giường</span>
                        <p className="text-gray-600">Chính sách trẻ em</p>
                        <p className="text-gray-600">
                            Phù hợp cho tất cả trẻ em. Để xem thông tin giá và tình trạng phòng trống
                            chính xác, vui lòng thêm số lượng và độ tuổi của trẻ em trong nhóm của bạn
                            khi tìm kiếm.
                        </p>
                        <p className="text-gray-600">Chính sách nôi (cũi) và giường phụ</p>
                        <p className="text-gray-600">
                            Chỗ nghỉ này không có nôi/cũi và giường phụ.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <span className="font-semibold">Không giới hạn độ tuổi</span>
                        <p className="text-gray-600">Không có yêu cầu độ tuổi khi nhận phòng</p>
                    </div>

                    <div className="space-y-2">
                        <span className="font-semibold">Vật nuôi</span>
                        <p className="text-gray-600">Vật nuôi không được phép.</p>
                    </div>

                    <div className="space-y-2">
                        <span className="font-semibold">Chỉ thanh toán bằng tiền mặt</span>
                        <p className="text-gray-600">
                            Chỗ nghỉ này chỉ chấp nhận thanh toán bằng tiền mặt.
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="font-bold">Ghi chú</h3>
                    <p className="text-gray-600 mt-2">
                        Yêu cầu VND 1.000.000 tiền đặt cọc đề phòng hư hại khi đến nghỉ. Số tiền
                        này sẽ được chỗ nghỉ thu bằng tiền mặt. Bạn sẽ được hoàn lại khi trả phòng.
                        Tiền đặt cọc của bạn sẽ được hoàn lại toàn bộ bằng tiền mặt, nhưng cũng phụ
                        thuộc vào mức hư hại mà bạn có thể gây ra tại chỗ nghỉ.
                    </p>
                </div>
            </div>

        </a>

    )
}