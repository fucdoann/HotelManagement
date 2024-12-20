import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form'
import { axios } from "../api/axios"
import PayMentFail from "./PaymentFail";
import { useAuth } from "../Context/AuthProvider";
import BookingSuccess from "./BookingSuccess";
import PaymentSuccess from "./PaymentSuccess";
import FailPopUp from "./FailPopUp";

function formatTimestampToVietnamese(timestamp) {
    // Create a Date object
    const date = new Date(timestamp);
    // Get the day of the week and map it to Vietnamese abbreviations
    const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const dayOfWeek = daysOfWeek[date.getDay()];

    // Format the date using vi-VN locale
    const formattedDate = new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);

    // Return the combined result
    return `${dayOfWeek}, ${formattedDate}`;
}
function calculateDaysBetween(timestamp1, timestamp2) {
    // Number of milliseconds in a day
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = Math.abs(timestamp2 - timestamp1);

    // Convert milliseconds to days
    const daysDifference = Math.floor(differenceInMilliseconds / millisecondsPerDay);

    return daysDifference;
}
const BookingDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm()
    const [nameLocaiton, setNameLocation] = useState('Việt Nam');
    const [roomData, setRoomData] = useState(location.state || {});
    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [numRoom, setNumRoom] = useState(1);
    const [children, setChildren] = useState(0);
    const [adults, setAdults] = useState(0);
    const [night, setNight] = useState(0);
    const [prices, setPrices] = useState(0);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState('');
    const [dataPayment, setDataPayment] = useState({})
    const [timeCheckin, setTimeCheckin] = useState('14:00 - 15:00');
    const [failPop, setFailPop] = useState(false);
    const [phone, setPhone] = useState('');
    const [email, setEmail ] = useState('');
    const [name, setName] = useState('');

    const handleChange = (event) => {
        setTimeCheckin(event.target.value); // Update state when value changes
    };
    const [payType, setPayType] = useState("offline");
    const handleCheckboxChange = (event) => {
        const { value } = event.target;
        setPayType(value); // Update the state with the selected checkbox's value
    };
    useEffect(() => {
        setRoomData(location.state || {});
    }, [location]);
    const [hotelName, setHotelName] = useState('');
    const fetchData = async (type, id) => {
        try {
            const response = await axios.post('/name_search', {
                'type': type,
                'id': id
            })
            setNameLocation(response.data.name)
        } catch (error) {
            console.error(`Failed to fetch ${type}`, error);
        }
    };
    const fetchRoom = async (id) => {
        try {
            const response = await axios.post('/getRoom', {
                'room_id': id
            })
            setPrices(+response.data.data.price_per_night * +night)
        } catch (error) {
            console.error(`Failed to fetch room price`, error);
        }
    };
    useEffect(() => {
        if (!roomData) {
            // Redirect if no data is found (user tried to directly access the page)
            navigate("/hotel");
        }
        setNumRoom(roomData.rooms);
        setAdults(roomData.adults);
        setChildren(roomData.children);
        setCheckin(formatTimestampToVietnamese(roomData.checkin));
        setCheckout(formatTimestampToVietnamese(roomData.checkout));
        setNight(calculateDaysBetween(roomData.checkin, roomData.checkout))
        const hotel_id = roomData.hid
        axios.post('/detailHotel', { hotel_id })
            .then(res => {
                setHotelName(res.data.hotel.name)
                if (res.data.hotel.commune !== 0) {
                    fetchData("commune", res.data.hotel.commune);
                } else if (res.data.hotel.district !== 0) {
                    fetchData("district", res.data.hotel.district);
                } else if (res.data.hotel.province !== 0) {
                    fetchData("province", res.data.hotel.province);
                }
            })
            .catch(error => {
                console.error(error)
            })
    }, [roomData])
    useEffect(() => {
        if (!roomData) {
            // Redirect if no data is found (user tried to directly access the page)
            navigate("/hotel");
        }
        fetchRoom(roomData.rid);
    }, [night])
    const fetchPaymentStatus = async (transactionId) => {
        try {
            const response = await axios.get("/bookings/payment-status", {
                params: { transactionId },
            });
            setStatus(response.data.status);
        } catch (error) {
            console.error("Error fetching payment status:", error);
        } finally {
            setLoading(false);
        }
    };
    const onSubmit = handleSubmit(async (data) => {
        console.log(data)
        setLoading(true);
        if (payType == 'offline') {
            setName(data.firstName + ' ' + data.lastName);
            setPhone(data.phone);
            setEmail(data.email);
            setLoading(false);
            setStatus('payoffline');
            return;
        }
        try {
            const response = await axios.post("/bookings", {
                user_id: user.id,
                name: data.firstName + ' ' + data.lastName,
                phone: data.phone,
                email: data.email,
                room_id: roomData.rid,
                room_count: numRoom,
                time_checkin: timeCheckin,
                request: request,
                total_price: +prices,
                check_in_date: checkin,
                check_out_date: checkout
                // Example amount
            });
            // Open VNPay in a new tab
            const paymentUrl = response.data.paymentUrl;
            const paymentWindow = window.open(paymentUrl, "_blank");

            // Periodically check payment status
            const paymentCheckInterval = setInterval(async () => {
                if (paymentWindow.closed) {
                    clearInterval(paymentCheckInterval);
                    await fetchPaymentStatus(response.data.transactionId);
                }
            }, 1000);
        } catch (error) {
            console.error("Error during booking submission:", error);
            setLoading(false);
        }
    })
    const bookingOffline = async () => {
        try {
            const response = await axios.post("/booking_offline", {
                user_id: user.id,
                name: name,
                phone: phone,
                email: email,
                room_id: roomData.rid,
                room_count: numRoom,
                time_checkin: timeCheckin,
                request: request,
                total_price: +prices,
                check_in_date: checkin,
                check_out_date: checkout
                // Example amount
            });
            const status = response.data.status;
            if(status == 201){
                navigate('/');
            }else{
                setFailPop(true);
            }
            
        } catch (error) {
            console.error("Error during booking submission:", error);
            // setLoading(false);
        }
    }
    window.addEventListener("message", (event) => {
        // Validate the origin of the message for security
        if (event.origin !== "http://localhost:8000") {
            console.warn("Received message from an unknown origin:", event.origin);
            return;
        }

        // Process the message data
        setDataPayment(event.data)
        console.log(event.data)
    });
    return (
        <>  
           {failPop &&  <FailPopUp main_mess={'Opps! Đặt phòng thất bại'} mess={'Đã xảy ra lỗi trong quá trình đặt phòng, vui lòng kiểm tra lại.'} setFailPop={setFailPop} />}
            {status == 'Confirmed' && <PaymentSuccess dataPayment={dataPayment} />}
            {status == 'Cancelled' && <PayMentFail />}
            <div className="bg-gray-100 min-h-screen py-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Content */}
                    {status != 'payoffline' ?
                        <div className="col-span-2 bg-white p-6 md:p-8 shadow-md rounded-lg">
                            {/* Header */}
                            <div className="flex justify-between items-center border-b pb-4">
                                <h1 className="text-xl md:text-3xl font-bold text-blue-600">
                                    {hotelName}
                                </h1>
                                <div className="text-sm font-semibold text-gray-500">
                                    <span className="block">{nameLocaiton}</span>
                                    <a href="#map" className="text-blue-500 ">
                                        Vị trí xuất sắc - 9.7
                                    </a>
                                </div>
                            </div>

                            {/* Booking Summary */}
                            <div className="mt-6 space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700">
                                    <div>
                                        <p className="font-semibold">Ngày nhận phòng</p>
                                        <p className="text-sm">{checkin}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Ngày trả phòng</p>
                                        <p className="text-sm">{checkout}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Tổng thời gian lưu trú</p>
                                        <p className="text-sm">{night} đêm</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Phòng</p>
                                        <p className="text-sm">{numRoom} phòng cho {adults > 0 && `${adults} người lớn`} {children > 0 && ` và ${children} trẻ em`}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Added New Section */}
                            <div className="mt-8 border-t pt-6">
                                <h3 className="text-lg font-bold mb-4">Chọn phương thức thanh toán</h3>
                                <div className="p-4 bg-gray-50 border rounded-md space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox"
                                            value="offline"
                                            checked={payType === "offline"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <p>Thanh toán trực tiếp tại khách sạn<span className="text-green-600 font-semibold pl-2">Làm việc với lễ tân</span></p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input type="checkbox"
                                            value="online"
                                            checked={payType === "online"}
                                            onChange={handleCheckboxChange}
                                        />
                                        <p>Thanh toán online với thẻ ngân hàng hoặc VNPAY <span className="text-green-600 font-semibold pl-2">Xác thực nhanh</span></p>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        Các lựa chọn thanh toán online sẽ diễn ra ở bước tiếp theo
                                    </p>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-bold mb-2">Các Yêu Cầu Đặc Biệt</h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                        Các yêu cầu đặc biệt không đảm bảo sẽ được đáp ứng – tuy nhiên, chỗ nghỉ sẽ cố gắng hết sức để thực hiện.
                                    </p>
                                    <textarea
                                        onChange={(e) => setRequest(e.target.value)}
                                        placeholder="Vui lòng ghi yêu cầu của bạn tại đây."
                                        className="w-full p-3 border rounded-md"
                                    ></textarea>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-bold mb-2">Thời gian đến của bạn</h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                        Phòng của bạn sẽ sẵn sàng để nhận trong khoảng từ 14:00 đến 23:00.
                                    </p>
                                    <select
                                        value={timeCheckin}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-md">
                                        <option>Vui lòng chọn</option>
                                        <option value="14:00 - 15:00">14:00 - 15:00</option>
                                        <option value="15:00 - 16:00">15:00 - 16:00</option>
                                        <option value="16:00 - 17:00">16:00 - 17:00</option>
                                        <option value="17:00 - 18:00">17:00 - 18:00</option>
                                        <option value="18:00 - 19:00">18:00 - 19:00</option>
                                        <option value="19:00 - 20:00">19:00 - 20:00</option>
                                        <option value="20:00 - 21:00">20:00 - 21:00</option>
                                        <option value="21:00 - 22:00">21:00 - 22:00</option>
                                        <option value="22:00 - 23:00">22:00 - 23:00</option>


                                    </select>
                                </div>
                            </div>

                            {/* Input Section */}
                            <div className="mt-8 border-t pt-6">
                                <h3 className="text-lg font-bold mb-4">Nhập thông tin chi tiết của bạn</h3>
                                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                                    <div className="flex flex-col md:flex-row md:space-x-4">
                                        <input
                                            type="text"
                                            placeholder="Họ (tiếng Anh)"
                                            {...register("firstName", { required: "First name is required" })}
                                            className="w-full p-3 border rounded-md"
                                        />
                                        <div className="text-red-500 px-2 text-sm" >{errors.firstName?.message}</div>
                                        <input
                                            type="text"
                                            placeholder="Và (ví dụ: Tuấn)"
                                            {...register("lastName", { required: "Last name is required" })}
                                            className="w-full p-3 border rounded-md"
                                        />
                                        <div className="text-red-500 px-2 text-sm" >{errors.lastName?.message}</div>
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Địa chỉ email"
                                        {...register("email", { required: "Email is required", pattern: { value: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/, message: "Email is not valid" } })}
                                        className="w-full p-3 border rounded-md"
                                    />
                                    <div className="text-red-500 px-2 text-sm" >{errors.email?.message}</div>
                                    <input
                                        type="tel"
                                        {...register("phone", { required: "Phone is required", pattern: { value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, message: "Phone is not valid" } })}
                                        placeholder="Số điện thoại"
                                        className="w-full p-3 border rounded-md"
                                    />
                                    <div className="text-red-500 px-2 text-sm" >{errors.phone?.message}</div>
                                    {!loading
                                        ? <button
                                            onClick={onSubmit}
                                            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
                                        >
                                            Tiếp theo: Chi tiết cuối cùng
                                        </button>
                                        :
                                        <button className="inline-flex h-12 items-center justify-center gap-2.5 rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white">
                                            <span>
                                                <svg
                                                    className="animate-spin"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <circle
                                                        opacity="0.5"
                                                        cx="10"
                                                        cy="10"
                                                        r="9"
                                                        stroke="white"
                                                        strokeWidth="2"
                                                    />
                                                    <mask id="path-2-inside-1_2527_20936" fill="white">
                                                        <path d="M18.4713 13.0345C18.9921 13.221 19.5707 12.9508 19.7043 12.414C20.0052 11.2042 20.078 9.94582 19.9156 8.70384C19.7099 7.12996 19.1325 5.62766 18.2311 4.32117C17.3297 3.01467 16.1303 1.94151 14.7319 1.19042C13.6285 0.597723 12.4262 0.219019 11.1884 0.0708647C10.6392 0.00512742 10.1811 0.450137 10.1706 1.00319C10.1601 1.55625 10.6018 2.00666 11.1492 2.08616C12.0689 2.21971 12.9609 2.51295 13.7841 2.95511C14.9023 3.55575 15.8615 4.41394 16.5823 5.45872C17.3031 6.50351 17.7649 7.70487 17.9294 8.96348C18.0505 9.89002 18.008 10.828 17.8063 11.7352C17.6863 12.2751 17.9506 12.848 18.4713 13.0345Z" />
                                                    </mask>
                                                    <path
                                                        d="M18.4713 13.0345C18.9921 13.221 19.5707 12.9508 19.7043 12.414C20.0052 11.2042 20.078 9.94582 19.9156 8.70384C19.7099 7.12996 19.1325 5.62766 18.2311 4.32117C17.3297 3.01467 16.1303 1.94151 14.7319 1.19042C13.6285 0.597723 12.4262 0.219019 11.1884 0.0708647C10.6392 0.00512742 10.1811 0.450137 10.1706 1.00319C10.1601 1.55625 10.6018 2.00666 11.1492 2.08616C12.0689 2.21971 12.9609 2.51295 13.7841 2.95511C14.9023 3.55575 15.8615 4.41394 16.5823 5.45872C17.3031 6.50351 17.7649 7.70487 17.9294 8.96348C18.0505 9.89002 18.008 10.828 17.8063 11.7352C17.6863 12.2751 17.9506 12.848 18.4713 13.0345Z"
                                                        stroke="white"
                                                        strokeWidth="4"
                                                        mask="url(#path-2-inside-1_2527_20936)"
                                                    />
                                                </svg>
                                            </span>
                                            Đang trong quá trình thanh toán ....
                                        </button>
                                    }

                                </form>
                            </div>
                        </div>
                        :
                        <BookingSuccess setStatus={setStatus} bookingOffline={bookingOffline} />
                    }

                    {/* Side Summary */}
                    <div className="bg-white p-6 shadow-md rounded-lg space-y-6">
                        {/* Booking Summary */}
                        <div>
                            <h2 className="text-lg font-bold mb-4">Chi tiết đặt phòng của bạn</h2>
                            <p>
                                <strong>Nhận phòng:</strong> {checkin}<br />
                                <strong>Trả phòng:</strong>{checkout}<br />
                                <strong>Tổng cộng:</strong>{' '}
                                <span className="text-green-600 font-semibold">US${prices}</span>
                            </p>
                        </div>

                        {/* Payment Schedule */}
                        <div className="border-t pt-4">
                            <h3 className="font-semibold">Lịch thanh toán của bạn</h3>
                            <p className="text-green-600 text-sm mt-1">
                                Không cần thanh toán hôm nay. Bạn sẽ trả khi đến nghỉ.
                            </p>
                        </div>

                        {/* Cancellation Policy */}
                        <div className="border-t pt-4">
                            <h3 className="font-semibold">Chi phí hủy là bao nhiêu?</h3>
                            <p className="text-green-600 text-sm mt-1">
                                Hủy miễn phí trước 18 tháng 12
                            </p>
                            <p className="text-gray-600 text-sm">
                                Từ 00:00 ngày 18 tháng 12&nbsp;
                                <span className="font-semibold">US$58</span>
                            </p>
                        </div>

                        {/* Alert Box */}
                        <div className="border-t pt-4">
                            <div className="p-4 bg-red-100 border border-red-400 rounded-md">
                                <h3 className="text-red-600 font-semibold">
                                    Hãy thanh toán trực tuyến để được xác thực nhanh, bỏ qua nguy cơ bị mất phòng !
                                </h3>
                                <p className="text-sm text-red-600 mt-1">
                                    Nhiều trường hợp đặt phòng không thành công do chưa thanh toán.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingDetails;
