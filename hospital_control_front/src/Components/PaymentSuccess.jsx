import { data } from 'autoprefixer';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const formatDate = (timestamp) => {
  const year = timestamp.slice(0, 4);
  const month = timestamp.slice(4, 6);
  const day = timestamp.slice(6, 8);
  const hour = timestamp.slice(8, 10);
  const minute = timestamp.slice(10, 12);
  const navigate = useNavigate();
  const formattedDate = `${day}/${month}/${year} ${hour}:${minute}`;
  return formattedDate
}
const PaymentSuccess = ({ dataPayment }) => {
  return (
    <div className='fixed inset-0 bg-gray-800 z-50 flex justify-center items-center bg-opacity-50'>
      <div className="bg-white w-full md:w-3/4 lg:w-2/3 xl:w-1/2 rounded-lg shadow-lg p-6 overflow-y-auto border border-gray-200">
      {/* Header */}
      <h1 className="text-2xl font-bold text-blue-600 mb-6">THANH TOÁN ĐẶT PHÒNG THÀNH CÔNG</h1>
      {/* Details Section */}
      <div className="space-y-4 text-sm text-gray-700">
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Mã đơn hàng:</span>
          <span className="text-gray-900">{dataPayment.vnp_TxnRef}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Số tiền:</span>
          <span className="text-gray-900">{dataPayment.amount} VND</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Nội dung thanh toán:</span>
          <span className="text-gray-900">{dataPayment.vnp_OrderInfo}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Mã GD Tại VNPAY:</span>
          <span className="text-gray-900">{dataPayment.vnp_TransactionNo}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium">Mã Ngân hàng:</span>
          <span className="text-gray-900">{dataPayment.vnp_BankCode}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Thời gian thanh toán:</span>
          <span className="text-gray-900">{formatDate(dataPayment.vnp_PayDate)}</span>
        </div>
      </div>
      {/* Result Message */}
      <div className="mt-6 text-center">
        <p className="text-lg font-semibold text-green-600">Kết quả: Giao dịch thành công</p>
      </div>
      {/* Action Button */}
      <div className="mt-8 text-center gap-5 flex items-center justify-center">
        <button
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          onClick={() => navigate('/user/listbook')}
        >
          Xem phòng đã đặt
        </button>
        <button
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          onClick={() => () => navigate('/hotel')}
        >
          Tiếp tục đặt phòng
        </button>
      </div>
    </div>
    </div>
  );
};

export default PaymentSuccess;
