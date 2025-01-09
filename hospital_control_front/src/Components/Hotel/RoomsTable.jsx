import React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { axios } from "../../api/axios"
import RoomDetail from "./DetailRoom";
import dayjs from "dayjs";
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
export default function RoomsTable({ rooms, hotel_id }) {
    const [roomsAvai, setRoomsAvai] = useState(rooms);
    useEffect(() => {
        setRoomsAvai(rooms)
    }, [rooms])
    const [inputRoom, setInputRoom] = useState([]); // To store input room
    const [fromDate, setFromDate] = useState(dayjs());
    const [toDate, setToDate] = useState(dayjs().add(1, 'day'));
    const [focusAdult, setFocusAdult] = useState(false);
    const [guests, setGuests] = useState(2); // initial guests
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [isPetFriendly, setIsPetFriendly] = useState(false);
    const [showRoom, setShowRoom] = useState(false);
    const [showRoomId, setShowRoomId] = useState(0);
    const dropdownRef = useRef(null);
    const handleIncrement = (setter, value) => setter(value + 1);
    const handleDecrement = (setter, value) => setter(Math.max(0, value - 1));
    useEffect(() => {
        setGuests(+children + +adults)
    }, [children, adults]);
    const [isSearch, setIsSearch] = useState(false);
    const handleSearchRoom = () => {
        const fetchRooms = () => {
            axios
                .post('/getAvailableRooms', {
                    'check_in_date': fromDate.$d.getTime(),
                    'check_out_date': toDate.$d.getTime(),
                    'guest_count': guests,
                    'hotel_id': hotel_id
                })
                .then((res) => {
                    const roomsData = res.data.data;
                    return Promise.all(
                        roomsData.map(async (room) => {
                            try {
                                const conveniencesResponse = await axios
                                    .post("/getConve", { 'arrayConve': room.arrayConve, 'type': 'room' }) // Send convenience IDs
                                    ;
                                const conveniences = conveniencesResponse.data.data;
                                return {
                                    ...room,
                                    conveniences, // Add conveniences to room data
                                };
                            } catch (error) {
                                console.error(`Error fetching conveniences for room ${room.room_id}:`, error);
                                return room;
                            }
                        })
                    );
                })
                .then(roomsWithConveniences => {
                    setInputRoom(Array(roomsWithConveniences.length).fill(1));
                    setRoomsAvai(roomsWithConveniences); // Update rooms state with rooms and conveniences
                })
                .catch((error) => {
                    console.error("Error fetching list rooms:", error);
                })
                .finally(() => {
                    setIsSearch(true);
                })
        };
        fetchRooms();
    }
    const handleShowRoom = (id) => {
        setShowRoomId(id);
        setShowRoom(true);
    }
    const handleInputChange = (index, value) => {
        const updatedValues = [...inputRoom];
        updatedValues[index] = Number(value) || 1; // Ensure it's stored as a number
        setInputRoom(updatedValues);
    };
    // Order room
    const navigate = useNavigate();
    const OrderRoom = (index, room_id) => {
        console.log(hotel_id)
        const room = inputRoom[index];
        const roomdata = {
            'rid': room_id,
            'hid': hotel_id,
            'rooms': room,
            'checkin': fromDate.$d.getTime(),
            'checkout': toDate.$d.getTime(),
            'adults': adults,
            'children': children
        }
        // console.log(formatTimestampToVietnamese(roomdata.checkin));
        navigate(`/hotel/booking`, { state: roomdata });
    }

    return (
        <>
            {showRoom && <RoomDetail setShowRoom={setShowRoom} room_id={showRoomId} />}
            <a name="rooms">
                <div className="max-w-7xl mx-auto flex justify-center flex-col pt-7 items-center">
                    <h2 className="w-full text-start font-bold text-3xl pb-4">
                        Phòng trống
                    </h2>
                    <div className="flex flex-col items-start gap-2 ">
                        <p className="text-red-500 text-sm">
                            Chọn ngày để xem phòng trống và giá tại chỗ nghỉ này
                        </p>
                        <div className="flex items-center border border-blue-gray-700 rounded-lg p-4 gap-2">
                            {/* Date Picker */}
                            <div className="flex items-center border-r pr-2">
                                {/* Check in date */}
                                <DesktopDatePicker
                                    label='Check in'
                                    defaultValue={dayjs()}
                                    value={fromDate}
                                    onChange={(date) => setFromDate(date)}
                                    slotProps={{
                                        layout: {
                                            sx: {
                                                fontSize: '500',
                                                color: 'blue',
                                                borderRadius: '6px',
                                                borderWidth: '1px',
                                                borderColor: '#2196f3',
                                                border: '1px solid',
                                                backgroundColor: '#90caf9',
                                            },
                                        },
                                        textField: {
                                            sx: {
                                                '& .MuiOutlinedInput-root': {
                                                    border: '2px solid white', // Change border of parent div
                                                    borderRadius: '6px', // Optional: Rounded corners
                                                },
                                                "& fieldset": {
                                                    borderColor: "white", // Change border color to green
                                                },
                                            },
                                        },
                                    }}
                                />

                                {/* Check-out Date */}
                                <DesktopDatePicker
                                    label='Check out'
                                    value={toDate}
                                    defaultValue={dayjs().add(1, 'day')}
                                    onChange={(date) => setToDate(date)}
                                    slotProps={{
                                        layout: {
                                            sx: {
                                                color: '#ad1457',
                                                borderRadius: '6px',
                                                borderWidth: '1px',
                                                borderColor: '#e91e63',
                                                border: '1px solid',
                                                backgroundColor: '#f48fb1',
                                            }
                                        },
                                        textField: {
                                            sx: {
                                                "& fieldset": {
                                                    borderColor: "white", // Change border color to green
                                                },
                                            }
                                        }
                                    }}
                                />
                            </div>

                            {/* Guests and Rooms */}
                            <div className="border-l-2">
                                <div onClick={(e) => { e.stopPropagation(); setFocusAdult(true) }} className={`flex items-center space-x-4 pl-4 pr-4 pt-1 pb-1 border ${!focusAdult ? "border-white" : "border-blue-600"} rounded-lg`}>
                                    {/* Icon for guests and rooms */}
                                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path d="M14 10a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            <path fillRule="evenodd" d="M10 2a7 7 0 017 7v2a5 5 0 015 5v3a5 5 0 01-5 5H5a5 5 0 01-5-5v-3a5 5 0 015-5V9a7 7 0 017-7zM9 4a6 6 0 0112 0 6 6 0 0112 6v2a4 4 0 014 4v3a4 4 0 01-4 4H5a4 4 0 01-4-4v-3a4 4 0 014-4V10a6 6 0 016-6z" clipRule="evenodd" />
                                        </svg>
                                    </div>

                                    {/* Text for Guests and Rooms */}
                                    <div>
                                        <p className="text-sm text-gray-500">Số lượng khách</p>
                                        <p className="text-lg font-semibold text-black">{guests} Khách</p>
                                    </div>
                                </div>
                                {focusAdult && <div className="absolute pt-8" ref={dropdownRef}>
                                    <div className="p-6 w-96 bg-white rounded-lg shadow-lg">
                                        <div className="space-y-4">
                                            {/* Adults */}
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-700 font-bold ">Adults</span>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleDecrement(setAdults, adults)}
                                                        className="w-8 h-8 flex justify-center items-center border border-gray-300 rounded-full text-blue-500 hover:bg-blue-100"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-gray-800 font-medium">{adults}</span>
                                                    <button
                                                        onClick={() => handleIncrement(setAdults, adults)}
                                                        className="w-8 h-8 flex justify-center items-center border border-gray-300 rounded-full text-blue-500 hover:bg-blue-100"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Children */}
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-700 font-bold ">Children</span>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleDecrement(setChildren, children)}
                                                        className="w-8 h-8 flex justify-center items-center border border-gray-300 rounded-full text-blue-500 hover:bg-blue-100"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-gray-800 font-medium">{children}</span>
                                                    <button
                                                        onClick={() => handleIncrement(setChildren, children)}
                                                        className="w-8 h-8 flex justify-center items-center border border-gray-300 rounded-full text-blue-500 hover:bg-blue-100"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Pet Friendly */}
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    id="pet-friendly"
                                                    className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                                                    checked={isPetFriendly}
                                                    onChange={(e) => setIsPetFriendly(e.target.checked)}
                                                />
                                                <label
                                                    htmlFor="pet-friendly"
                                                    className="text-gray-700 font-bold "
                                                >
                                                    Pet friendly
                                                    <div className="font-medium">Only show places that allow pet</div>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex justify-between items-center mt-6">
                                            <button
                                                className="text-gray-400 font-medium hover:underline"
                                                onClick={() => {
                                                    setAdults(2);
                                                    setChildren(0);
                                                    setRooms(1);
                                                    setIsPetFriendly(false);
                                                }}
                                            >
                                                RESET
                                            </button>
                                            <button onClick={() => { setFocusAdult(false) }} className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600">
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                </div>}
                            </div>

                            {/* Apply Button */}
                            <button onClick={handleSearchRoom} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex flex-row gap-2 items-center ">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px"><path d="M4.5 14.248v4.5l.75-.75H.75a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 0-1.5 0m15-4.5v-4.5l-.75.75h4.5a.75.75 0 0 0 0-1.5h-4.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0m-1.01-3.984a9.002 9.002 0 0 1-9.956 14.544.75.75 0 1 0-.576 1.384 10.5 10.5 0 0 0 11.311-2.117c4.184-4.017 4.32-10.665.304-14.85a.75.75 0 0 0-1.082 1.04zM5.51 18.232a9.003 9.003 0 0 1 9.957-14.54.75.75 0 1 0 .576-1.385A10.5 10.5 0 0 0 4.749 4.42C.56 8.43.414 15.08 4.425 19.27a.75.75 0 0 0 1.084-1.038z"></path></svg>
                                Áp dụng thay đổi
                            </button>
                        </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden shadow-lg max-w-7xl  mb-6 mt-3">
                        {/* Column Titles */}
                        <div className={`grid ${isSearch ? 'grid-cols-5' : 'grid-cols-4'} bg-blue-300 font-bold text-center text-gray-700 py-2`}>
                            <div>Loại chỗ nghỉ</div>
                            <div>Số lượng khách</div>
                            <div>Giá cho 1 đêm</div>
                            {isSearch && <div>Số lượng phòng</div>}
                            <div>Các lựa chọn</div>
                        </div>

                        {/* Content Rows */}

                        {roomsAvai.length ? roomsAvai.map((item, index) => (

                            <>
                                <div key={item.room_id} className="flex flex-col md:flex-row">
                                    <div className="p-4 flex-1 border-r">
                                        <h2 onClick={() => handleShowRoom(item.room_id)} className="font-bold text-lg text-blue-600 cursor-pointer">
                                            {item.name}
                                        </h2>
                                        {isSearch &&
                                            (
                                                <>
                                                    <ul className="mt-2 text-sm text-gray-700 space-y-1">
                                                        <li>1 giường đôi lớn</li>
                                                        <li>🏡 {item.area}m²</li>
                                                        {item.conveniences && item.conveniences.map(item => (
                                                            <>
                                                                <li key={item.id} className="flex flex-row gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="20px"><path d="M56.33 100a4 4 0 0 1-2.82-1.16L20.68 66.12a4 4 0 1 1 5.64-5.65l29.57 29.46 45.42-60.33a4 4 0 1 1 6.38 4.8l-48.17 64a4 4 0 0 1-2.91 1.6z"></path></svg> {item.convenient_name}</li>
                                                            </>
                                                        ))}
                                                    </ul>
                                                    <ul className="mt-4 text-sm text-gray-700 space-y-1">
                                                    {item.hot_conve && item.hot_conve.map((item, index) => (
                                                            <>
                                                                <li key={index} className="flex flex-row gap-2">✔️ {item.convenient_name}</li>
                                                            </>
                                                        ))}
                                                        <li>✔️ Đồ vệ sinh cá nhân miễn phí</li>
                                                        <li>✔️ Áo choàng tắm, Két an toàn</li>
                                                        <li>✔️ Máy sấy tóc, Máy sấy quần áo</li>
                                                        <li>✔️ Sàn lát gỗ, Khăn tắm</li>
                                                    </ul>
                                                </>
                                            )}
                                    </div>

                                    {/* Guest Info */}
                                    <div className="p-4 flex-1 border-r text-center">
                                        <p className="text-2xl flex justify-center items-center"><svg fill="#df7b31" height="24px" width="24px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512.001 512.001" xmlSpace="preserve" stroke="#df7b31"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M156.683,411.479h-22.274v-19.652c0-8.907-7.246-16.153-16.153-16.153H82.367c-8.907,0-16.153,7.246-16.153,16.153v19.652 H43.941c-6.244,0-11.307,5.063-11.307,11.307v77.906c0,6.245,5.063,11.307,11.307,11.307h112.741 c6.244,0,11.307-5.063,11.307-11.307v-77.906C167.989,416.541,162.927,411.479,156.683,411.479z M116.845,411.479h-0.001H83.78 v-18.24h33.065V411.479z"></path> </g> </g> <g> <g> <circle cx="259.839" cy="42.141" r="42.141"></circle> </g> </g> <g> <g> <path d="M467.168,326.163h-9.066v-54.005h7.442c2.221,0,4.022-1.801,4.022-4.022v-13.406c0-2.221-1.801-4.022-4.022-4.022H412.71 c2.989-8.683-0.201-18.595-8.286-23.747l-41.732-26.595l-0.331-54.776c-0.133-26.399-21.718-47.876-48.118-47.876 c-11.299,0-97.821,0-109.159,0c-26.4,0-47.985,21.477-48.118,47.876l-0.751,149.38c-0.057,11.23,9.001,20.379,20.23,20.435 c0.036,0,0.07,0,0.104,0c11.181,0,20.275-9.037,20.331-20.23l0.751-149.38c0.011-2.166,1.772-3.913,3.936-3.908 c2.165,0.006,3.915,1.762,3.915,3.926l0.009,341.787c0,13.476,10.924,24.4,24.4,24.4c13.476,0,24.4-10.924,24.4-24.4V292.57 h10.534v195.029c0,13.476,10.924,24.4,24.4,24.4c13.476,0,24.4-10.924,24.4-24.4c0-318.415-0.432-143.909-0.443-341.647 c0-2.323,1.863-4.217,4.186-4.256c2.323-0.038,4.249,1.794,4.324,4.116c0,0,0,0.001,0,0.002l0.398,65.869 c0.041,6.903,3.582,13.314,9.405,17.024l45.98,29.302v10.125c0,2.221,1.801,4.022,4.022,4.022h7.442v54.005h-9.066 c-6.738,0-12.199,5.462-12.199,12.199v139.941c0,6.738,5.462,12.199,12.199,12.199h9.066v13.177c0,4.595,3.726,8.321,8.321,8.321 c4.595,0,8.321-3.726,8.321-8.321v-13.177h35.877v13.177c0,4.595,3.726,8.321,8.321,8.321c4.595,0,8.321-3.726,8.321-8.321 v-13.177h9.065c6.738,0,12.199-5.462,12.199-12.199v-139.94C479.366,331.624,473.906,326.163,467.168,326.163z M441.46,326.163 h-35.873v-54.005h35.873V326.163z"></path> </g> </g> </g></svg></p>
                                        <p className="text-sm text-gray-700">{item.guest_count} Khách</p>
                                    </div>

                                    {/* Price */}
                                    <div className="p-4 flex-1 border-r">
                                        <p className="text-lg font-bold text-gray-800">VND {item.price_per_night}</p>
                                        <p className="text-sm text-gray-600">Đã bao gồm thuế và phí</p>
                                    </div>
                                    {/* Số lượng phòng */}
                                    {
                                        isSearch &&
                                        <>
                                            <div className="p-4 flex-1 border-r">
                                                <div className={`flex items-center pr-4 border-2  "border-blue-600"  rounded-[10px] px-4 py-2 bg-white`}>
                                                    <svg fill="#000000" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 511.999 511.999" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M493.223,240.057L379.687,126.521c-10.027-10.014-22.537-16.011-35.54-18.013 C321.227,22.333,165.328-31.774,98.232,21.369C43.267,25.67,0,71.637,0,127.705c0,24.015,7.939,46.175,21.333,64.004v63.996 c0,9.183,5.876,17.335,14.587,20.239l22.619,7.54l-27.707,18.471c-12.666,8.444-12.666,27.057,0,35.501l37.374,24.916 l-37.374,24.916c-5.935,3.957-9.5,10.618-9.5,17.75v42.667c0,7.133,3.565,13.794,9.5,17.75l64,42.667 c7.166,4.777,16.501,4.777,23.667,0l64-42.667c5.935-3.957,9.5-10.618,9.5-17.75V191.709 c13.394-17.829,21.333-39.989,21.333-64.004c0-34.784-16.656-65.677-42.423-85.149c51.223,1.261,118.296,33.944,131.195,73.877 c-4.675,2.724-9.083,6.082-13.09,10.088l-55.531,55.531c-25.034,25.034-25.034,65.606-0.01,90.662l113.546,113.546 c25.035,25.035,65.636,25.035,90.671,0l55.531-55.531C518.258,305.693,518.258,265.092,493.223,240.057z M106.667,63.705 c35.343,0,64,28.657,64,64s-28.657,64-64,64s-64-28.657-64-64S71.323,63.705,106.667,63.705z M106.667,464.732L64,436.288 v-19.832l54.5-36.333c12.666-8.444,12.666-27.057,0-35.501l-37.374-24.916l37.374-24.916 c14.771-9.847,11.754-32.375-5.087-37.989L64,240.329v-14.842c13.067,5.71,27.495,8.885,42.667,8.885s29.6-3.175,42.667-8.885 v210.801L106.667,464.732z M463.053,300.558l-55.531,55.531c-8.373,8.373-21.959,8.373-30.331,0L263.655,242.553 c-8.374-8.385-8.374-21.957,0-30.331l55.531-55.531c8.374-8.374,21.946-8.374,30.341,0.01l113.526,113.526 C471.425,278.599,471.425,292.185,463.053,300.558z"></path> <path d="M106.667,127.705c11.776,0,21.333-9.557,21.333-21.333s-9.557-21.333-21.333-21.333s-21.333,9.557-21.333,21.333 S94.891,127.705,106.667,127.705z"></path> <path d="M305.329,198.374c-8,8-8,20.992,0,29.013c8.021,8,21.013,8,29.013,0c8-8.021,8-21.013,0-29.013 S313.35,190.374,305.329,198.374z"></path> <path d="M378.434,241.303c-8.331-8.331-21.839-8.331-30.17,0s-8.331,21.839,0,30.17l43.52,43.52 c8.331,8.331,21.839,8.331,30.17,0c8.331-8.331,8.331-21.839,0-30.17L378.434,241.303z"></path> </g> </g> </g> </g></svg>
                                                    <input type="number" onChange={(e) => handleInputChange(index, e.target.value)} min="1" max={item.available_rooms} placeholder="Số phòng" className="pl-2 w-full outline-none text-gray-700 placeholder-gray-500 font-bold" />
                                                </div>
                                                <p className="text-sm text-gray-600">Còn {item.available_rooms} phòng trống</p>

                                            </div>
                                        </>
                                    }
                                    {/* Payment Options */}
                                    <div className="p-4 flex-1">
                                        {item.pay_rule == 0
                                            ?
                                            <>
                                                <h3 className="font-bold text-green-600 text-sm">Không cần thanh toán luôn</h3>
                                                <ul className="text-sm text-gray-700 mt-2 space-y-1">
                                                    <li>💸 Phí hủy: Toàn bộ tiền phòng</li>
                                                    <li>✔️ Không cần thanh toán trước - thanh toán tại chỗ nghỉ</li>
                                                </ul>
                                            </>
                                            :
                                            <>
                                                <h3 className="font-bold text-red-600 text-sm">Cần thanh toán online</h3>
                                                <ul className="text-sm text-gray-700 mt-2 space-y-1">
                                                    <li>💸 Phí hủy: Toàn bộ tiền phòng</li>
                                                    <li>✔️ Thanh toán đa dạng VNPAY, thẻ ngân hàng, thẻ tín dụng, ..</li>
                                                </ul>
                                            </>
                                        }
                                        <div className="mt-4 flex justify-center">
                                            {isSearch &&
                                                <button onClick={() => OrderRoom(index, item.room_id)} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                                                    Tôi sẽ đặt 
                                                </button>}
                                        </div>
                                    </div>
                                </div>
                            </>

                        ))
                            :
                            <div></div>
                        }
                        {/* Accommodation Type */}


                    </div>
                </div>
            </a>
        </>
    )
}