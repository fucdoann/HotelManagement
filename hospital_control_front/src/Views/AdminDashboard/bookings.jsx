
import { useState, useEffect } from "react";
import { axios } from "../../api/axios";
import DropDownBooking from "../../Components/Admin/DropDownBooking";
import SuccessPop from "../../Components/PopUp/SuccessPop";
import ConfirmDelete from "../../Components/Admin/ConfirmDelete";
import { Input, Button, SendIcon } from "@material-tailwind/react";
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
const convertTime2 = (time) => {
  const date = new Date(time);


  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' }); // Abbreviated month
  const year = date.getFullYear();

  // Construct formatted string
  return ` ${month} ${day}, ${year}`;
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
export function Bookings() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [message, setMessage] = useState('');
  const [index, setIndex] = useState(0);
  const [listBook, setListBook] = useState([]);
  const [countIndex, setCountIndex] = useState(10);
  const [querySearch, setQuerySearch] = useState('');
  const [deleteId, setDeleteId] = useState(0);
  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % Math.ceil(countIndex / 10));
  };

  const handlePrev = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? Math.ceil(countIndex / 10) - 1 : prevIndex - 1
    );
  };
  // Function to fetch bookings
  const fetchHotels = () => {
    axios.post('/getListBookingAdmin', { querySearch })
      .then(res => {
        setListBook(res.data.data);
        setCountIndex(res.data.data.length);
      })
      .catch(error => {
        console.error(error);
      });
  };
  useEffect(() => {
    fetchHotels();
  }, [])
  const handleSearch = () => {
    fetchHotels();
  }
  // CRUD booking
  const updateBooking = (status, booking_id) => {
    axios.post('/booking/update', { status, booking_id })
      .then(res => {
        if (res.data.status === 200) {
          setMessage(res.data.message);
          setShowSuccess(true);
          fetchHotels();

        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  const deleteBooking = (booking_id) => {
    axios.post('/booking/delete', { booking_id })
      .then(res => {
        if (res.data.status === 200) {
          setMessage(res.data.message);
          setShowSuccess(true);
          setShowDelete(false);
          fetchHotels();

        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  return (
    <>
      {showDelete && <ConfirmDelete setShowDelete={setShowDelete} deleteHotel={deleteBooking} deleteId={deleteId} type={"Đơn đặt phòng"} />}
      {showSuccess && <SuccessPop mess={message} onClose={() => setShowSuccess(false)} />}
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <div className="bg-white p-8 rounded-md w-full">
          <div>
            <div className="flex flex-row gap-3">
              <div className="relative w-[200px] min-w-[200px] h-10">
                <input value={querySearch} onChange={(e) => setQuerySearch(e.target.value)} className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent placeholder:opacity-0 focus:placeholder:opacity-100 text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900" type="text" />
                <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">Search </label>
              </div>
              <Button onClick={handleSearch} variant="contained">
                Tìm kiếm theo tên
              </Button>
            </div>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">

              <div className="overflow-x-auto">
                <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                  <table className="min-w-full leading-normal bg-white border border-gray-200">
                    <thead className="bg-gray-200">
                      <tr>
                        {[
                          { name: "ID Booking", width: "w-[11%]" },
                          { name: "Khách Sạn" },
                          { name: "Phòng" },
                          { name: "Số Phòng" },
                          { name: "Thời Gian Đặt" },
                          { name: "Check In" },
                          { name: "Check Out" },
                          { name: "Thanh Toán" },
                          { name: "Trạng Thái", width: "w-[10%]" },
                          { name: "Edit" },
                        ].map((header, i) => (
                          <th
                            key={i}
                            className={`${header.width || ""} px-5 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider`}
                          >
                            {header.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {listBook.length > 0 &&
                        listBook.slice(index * 10, index * 10 + 10).map((item, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition">
                            <td className="px-5 py-4 border-b border-gray-200 text-sm text-center">
                              {item.booking_id}
                            </td>
                            <td className="px-5 py-4 border-b border-gray-200 text-sm">
                              {item.hotel_name}
                            </td>
                            <td className="px-5 py-4 border-b border-gray-200 text-sm">
                              {item.room_name}
                            </td>
                            <td className="px-5 py-4 border-b border-gray-200 text-sm">
                              {item.room_count}
                            </td>
                            <td className="px-5 py-4 border-b border-gray-200 text-sm">
                              {convertTime(item.created_at)}
                            </td>
                            <td className="px-5 py-4 border-b border-gray-200 text-sm">
                              {convertTime2(parseInt(item.check_in_date))}
                            </td>
                            <td className="px-5 py-4 border-b border-gray-200 text-sm">
                              {convertTime2(parseInt(item.check_out_date))}
                            </td>
                            <td className="px-5 py-4 border-b border-gray-200 text-sm">
                              {item.total_price} VND
                            </td>
                            <td
                              className={`px-5 py-4 border-b border-gray-200 text-sm text-center ${convertClass(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </td>
                            <td className="px-5 py-4 border-b border-gray-200 text-sm">
                              <DropDownBooking
                                id={item.booking_id}
                                status={item.status}
                                setShowDelete={setShowDelete}
                                updateBooking={updateBooking}
                                setDeleteId={setDeleteId}
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div className="px-5 py-4 bg-gray-50 flex items-center justify-between border-t border-gray-300">
                    <span className="text-sm text-gray-600">
                      Hiển thị {index * 10 + 1} - {Math.min(index * 10 + 10, countIndex)} trong
                      tổng số {countIndex} đơn đặt phòng
                    </span>
                    <div className="inline-flex">
                      <button
                        onClick={handlePrev}
                        className="text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-l"
                      >
                        Prev
                      </button>
                      <button
                        onClick={handleNext}
                        className="text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-r"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Bookings;
