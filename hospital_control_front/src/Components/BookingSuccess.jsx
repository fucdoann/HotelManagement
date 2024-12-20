import React from 'react';

const BookingSuccess = ({setStatus,bookingOffline}) => {
    return (
        <div className="p-6 bg-white rounded-md shadow-md  mx-auto col-span-2">
            {/* Payment Info */}
            <div className="mb-6">
                <h2 className="font-bold text-lg mb-2">Không yêu cầu thông tin thanh toán</h2>
                <p className="text-gray-700">
                    Thanh toán của bạn sẽ do Cao Minh Hotel xử lý, nên bạn không cần nhập thông tin thanh toán cho đơn đặt này.
                </p>
            </div>

            {/* Save Info Section */}
            <div className="mb-6 border-t pt-4">
                <h3 className="font-bold text-lg mb-2">Lưu thông tin của bạn</h3>
                <p className="text-gray-700 mb-2">
                    Dùng thông tin liên lạc của bạn để tạo tài khoản và đặt phòng nhanh hơn sau này.
                    <br />
                    (Chúng tôi sẽ không lưu trữ thông tin thanh toán của bạn.)
                </p>
                <div className="flex items-center mb-4">
                </div>
                <p className="text-gray-600 text-sm">
                    Qua việc đăng nhập hoặc tạo tài khoản, bạn đồng ý với các{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                        Điều khoản và Điều kiện
                    </a>{' '}
                    cũng như{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                        Chính sách An toàn và Bảo mật
                    </a>{' '}
                    của chúng tôi.
                </p>
            </div>

            {/* Email Marketing */}
            <div className="mb-6 border-t pt-4">
                <div className="flex items-start mb-4">
                    <input
                        id="marketing1"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        defaultChecked
                    />
                    <label htmlFor="marketing1" className="ml-2 text-gray-700">
                        Tôi đồng ý nhận email marketing từ BeBook.com, bao gồm khuyến mãi, các thông báo liên quan đến đặt phòng.
                    </label>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                    Với việc đăng ký nhận email marketing, bạn cho phép chúng tôi đề xuất các sản phẩm, dịch vụ, ưu đãi và nội dung theo sở thích của mình
                    bằng việc theo dõi cách bạn sử dụng Booking.com thông qua công nghệ theo dõi. Hủy đăng ký bất cứ lúc nào. Tham khảo{' '}
                    <a href="#" className="text-blue-600 hover:underline">chính sách bảo mật</a> của chúng tôi.
                </p>
            </div>

            {/* Bottom Section */}
            <div className="border-t pt-4">
                <p className="text-gray-700 mb-4">
                    Đặt phòng của bạn là đặt phòng trực tiếp với Cao Minh Hotel và bằng việc hoàn tất đặt phòng này, bạn đồng ý với{' '}
                    <a href="#" className="text-blue-600 hover:underline">điều kiện đặt phòng</a>,{' '}
                    <a href="#" className="text-blue-600 hover:underline">điều khoản chung</a> và{' '}
                    <a href="#" className="text-blue-600 hover:underline">chính sách bảo mật</a>.
                </p>
                <div className="flex space-x-4">
                    <button onClick={()=>setStatus(null)} className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
                        Kiểm tra lại đặt phòng
                    </button>
                    <button onClick={bookingOffline} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Hoàn tất đặt chỗ
                    </button>
                </div>
                <p className="mt-4 text-blue-600 hover:underline text-sm cursor-pointer">
                    Các điều kiện đặt phòng là gì?
                </p>
            </div>
        </div>
    );
};

export default BookingSuccess;
