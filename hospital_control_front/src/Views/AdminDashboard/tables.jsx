
import { useState, useEffect } from "react";
import { axios } from "../../api/axios";
import Dropdown from "../../Components/Admin/Dropdown";
import SuccessPop from "../../Components/PopUp/SuccessPop";
import ConfirmDelete from "../../Components/Admin/ConfirmDelete";
import { Input, Button, SendIcon } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
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
  if (status === 'Available') {
    return 'text-green-900 bg-green-200'
  }
  return 'text-red-900 bg-red-200 '
}
export function Tables() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [message, setMessage] = useState('');
  const [index, setIndex] = useState(0);
  const [listHotel, setListHotel] = useState([]);
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
    axios.post('/getListHotel', { querySearch })
      .then(res => {
        setListHotel(res.data.data);
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
  // CRUD hotel
  const activeHotel = (status, hotel_id) => {
    axios.post('/hotel/active', { status, hotel_id })
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
  const deleteHotel = (hotel_id) => {
    axios.post('/hotel/delete', { hotel_id })
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
  const EditHotel = (hotel_id) => {
    navigate(`/admin/edithotel?id=${hotel_id}`);
  }
  return (
    <>
      {showDelete && <ConfirmDelete setShowDelete={setShowDelete} deleteHotel={deleteHotel} deleteId={deleteId} />}
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

              <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th
                        className="w-[11%] px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        ID khách sạn
                      </th>
                      <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Tên khách sạn
                      </th>
                      <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Thời gian tạo
                      </th>
                      <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Giá tối thiểu
                      </th>
                      <th
                        className="w-[10%] px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Edit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listHotel.length > 0 && listHotel.slice(index * 10, index * 10 + 10).map((item, index) => (
                      <tr key={index}>
                        <td className="px-3 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap flex items-center justify-center">{item.hotel_id}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="flex items-center">
                            <div className="ml-3">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {item.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">{convertTime(item.created_at)}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {item.min_price} vnd
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
                        <td className="relative px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <Dropdown id={item.hotel_id} status={item.status} EditHotel={EditHotel} setDeleteId={setDeleteId} setShowDelete={setShowDelete} activeHotel={activeHotel} />
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
                      className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-[#424242] font-semibold py-2 px-4 rounded-l">
                      Prev
                    </button>
                    &nbsp; &nbsp;
                    <button onClick={() => handleNext()}
                      className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-[#424242] font-semibold py-2 px-4 rounded-r">
                      Next
                    </button>
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

export default Tables;
