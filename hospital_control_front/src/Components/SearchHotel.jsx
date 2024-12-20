import { DesktopDatePicker, DatePicker } from "@mui/x-date-pickers";
import { TextField } from '@mui/material';
import React from "react";
import { useState, useEffect, useRef } from "react";
import { axios } from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import FailPopUp from "./FailPopUp";
import dayjs from "dayjs";
import WarningToast from "./PopUp/WarningPop";

export default function SearchHotel() {
    // Extract query parameters
    const location = useLocation();
    const navigate = useNavigate(); // ✅ Hooks are valid here.
    //  Start
    const [focusedIndex, setFocusedIndex] = useState(false);
    const [searchPlaces, setSearchPlaces] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [isPetFriendly, setIsPetFriendly] = useState(false);
    const [focusAdult, setFocusAdult] = useState(false);
    const [focusPlace, setFocusPlace] = useState(false);
    const [flagChange, setFlagChanghe] = useState(false);
    const [guests, setGuests] = useState(2); // initial guests
    const [rooms, setRooms] = useState(1);  // initial rooms
    const [fromDate, setFromDate] = useState(dayjs());
    const [toDate, setToDate] = useState(dayjs().add(1, "day"));
    const [province, setProvince] = useState(0);
    const [district, setDistrict] = useState(0);
    const [commune, setCommune] = useState(0);
    const [errorTime, setErrorTime] = useState(false);
    const dropdownRef = useRef(null);
    // Get seatch hotels if params
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.size > 0) {
            setFlagChanghe(true)
            setFromDate(dayjs(new Date(Number(queryParams.get("checkin")))));
            setToDate(dayjs(new Date(Number(queryParams.get("checkout")))));
            setSearchInput(queryParams.get("ss"))
            setAdults(queryParams.get('adults'))
            setChildren(queryParams.get('children'))
            setRooms(queryParams.get('rooms'))
        }

    }, [location]);
    const handleIncrement = (setter, value) => setter(value + 1);
    const handleDecrement = (setter, value) => setter(Math.max(0, value - 1));
    useEffect(() => {
        setGuests(+children + +adults)
    }, [children, adults])

    useEffect(() => {
        if (!flagChange && searchInput.trim() !== "") {
            const delaySearch = setTimeout(() => {
                axios.post('/city_search', { 'query': searchInput })
                    .then((response) => {
                        const data = response.data.results
                        const dataPlace = []
                        data.slice(0, 10).map(item => {
                            dataPlace.push({
                                type: "City",
                                name: item['name'],
                                location: item['location'],
                                idProvince: item['idProvince'],
                                idDistrict: item['idDistrict'],
                                idCommune: item['idCommune']

                            })
                        })
                        setSearchPlaces(dataPlace)
                        if (dataPlace != []) {
                            setFocusPlace(true)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }, 1000)
            return () => clearTimeout(delaySearch)
        }
    }, [searchInput])
    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setFocusAdult(false);
                setFocusPlace(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    // Handle search
    const searchHotel = () => {
        if(fromDate > toDate){
            setErrorTime(true);
            return;
        }
        navigate(`/hotel/searchresult?ss=${searchInput}&province=${province}&district=${district}&commune=${commune}&checkin=${fromDate.$d.getTime().toString()}&checkout=${toDate.$d.getTime().toString()}&children=${children}&adults=${adults}&rooms=${rooms}`)
    }
    return (
        <>
        {errorTime && <WarningToast mess="Ngày checkin phải trước ngày checkout" main_mess={"Vui lòng chọn lại"} onClose={() => setErrorTime(false)}/>}
        <div className="flex flex-col items-center py-8 bg-gray-100">
            <h2 className="text-2xl font-bold">Tiết kiệm lên đến 40% vào lần đặt phòng tiếp theo của bạn</h2>
            <p className="text-gray-600 mb-6">Chúng tôi bao gồm nhiều chuỗi khách sạn trên cả nước</p>
            <div className="bg-white shadow-lg rounded-lg flex items-center space-x-4 p-4 w-full max-w-7xl">
                {/* Location Input */}

                <div className="border-r-2 h-full">
                    <div className={`flex items-center pr-4 border-2 ${!focusedIndex ? "border-white" : "border-blue-600"}  rounded-[10px] px-4 py-2 bg-white`}>
                        <svg className="w-8 h-8 text-gray-800 mr-2" fill="gray-800" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 488.4 488.4" xmlSpace="preserve">
                            <g>
                                <g>
                                    <path d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6
			s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2
			S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7
			S381.9,104.65,381.9,203.25z"/>
                                </g>
                            </g>
                        </svg>
                        <input type="text" value={searchInput} onFocus={() => setFocusedIndex(true)} onBlur={() => setFocusedIndex(false)} onChange={(e) => { setSearchInput(e.target.value); setFlagChanghe(false) }} placeholder="Bạn muốn tới ... " className="outline-none text-gray-700 placeholder-gray-500 font-bold" />
                    </div>
                    {focusPlace && <div className="w-96 border border-gray-200 rounded-lg bg-white shadow-md p-4 absolute mt-8 z-30" ref={dropdownRef}>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">
                            Choose your Place has the hotel
                        </h4>
                        <ul className="space-y-3">
                            {searchPlaces.map((place, index) => (
                                <li
                                    className="flex hover:bg-gray-100 items-center border-b last:border-b-0 pb-2 last:pb-0"
                                    key={index}
                                    onClick={(e) => { setFlagChanghe(true); setSearchInput(place.name); setFocusPlace(false); setProvince(place.idProvince); setDistrict(place.idDistrict); setCommune(place.idCommune) }}
                                >
                                    <div className="text-2xl mr-3">
                                        {place.type === "City" ? <img src="../../public/location.svg" alt="" /> : place.type === "Hotel" ? <img src="../../public/hotel.svg" alt="" /> : <img src="../../public/homestay.svg" alt="" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-base p-2 font-semibold text-gray-900">
                                            {place.name}
                                        </span>
                                        <span className="text-sm pl-1 text-gray-500">{place.location}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>}
                </div>

                {/* Check in date */}
                <DesktopDatePicker
                    label='Check in'
                    defaultValue={dayjs()}
                    value={fromDate}
                    minDate={dayjs()} // Restrict to today or later
                    onChange={(date) => {setFromDate(date)}}
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
                    onChange={(date) => setToDate(date)}
                    defaultValue={dayjs().add(1, "day")}
                    minDate={fromDate ? dayjs(fromDate).add(1, "day") : dayjs().add(1, "day")} // Restrict to 1 day after check-in
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
                            <p className="text-sm text-gray-500">Số lượng khách và phòng</p>
                            <p className="text-lg font-semibold text-black">{guests} Khách, {rooms} Phòng</p>
                        </div>
                    </div>
                    {focusAdult && <div className="absolute pt-8 z-50" ref={dropdownRef}>
                        <div className="p-6 w-96 bg-white rounded-lg shadow-lg">
                            <div className="space-y-4">
                                {/* Adults */}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 font-bold ">Người lớn</span>
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
                                    <span className="text-gray-700 font-bold ">Trẻ em</span>
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

                                {/* Rooms */}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 font-bold ">Phòng</span>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleDecrement(setRooms, rooms)}
                                            className="w-8 h-8 flex justify-center items-center border border-gray-300 rounded-full text-blue-500 hover:bg-blue-100"
                                        >
                                            -
                                        </button>
                                        <span className="text-gray-800 font-medium">{rooms}</span>
                                        <button
                                            onClick={() => handleIncrement(setRooms, rooms)}
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
                                        Yêu động vật
                                        <div className="font-medium">Chọn khách sạn cho phép thú cưng</div>
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
                                    Đặt lại
                                </button>
                                <button onClick={() => { setFocusAdult(false) }} className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600">
                                    Áp dụng
                                </button>
                            </div>
                        </div>
                    </div>}
                </div>

                {/* Search Button */}
                <button onClick={searchHotel} className="bg-blue-600 text-white font-bold w-32 h-16 !ml-12  px-6 py-2 rounded-lg hover:bg-blue-700">
                    Tìm kiếm
                </button>
            </div>

            {/* Partner Logos */}
            <div className="flex items-center justify-center space-x-6 mt-6">
                <img className="w-32" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/626.png" alt="Booking.com" />
                <img className="w-32" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/406.png" alt="Expedia" />
                <img className="w-32" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/3340.png" alt="Hotels.com" />
                <img className="w-32" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/2564.png" alt="Vrbo" />
                <img className="w-32" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/14.png" alt="Accor" />
                <img className="w-32" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/634.png" alt="Trip.com" />
                <img className="w-32" src="https://imgcy.trivago.com/image/upload/hardcodedimages/mpm-localised-logos-dark/54.png" alt="Priceline" />
                <span className="text-gray-500">+100s more</span>
            </div>
        </div>
        </>
    );
    
}

const HotelIcon = () => {
    <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#3d71a5"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
}
