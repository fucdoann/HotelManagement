import React from "react";
import { useState, useEffect, useRef } from "react";
import { axios } from "../../api/axios";
import CheckboxTwo from '../../Components/Checkboxes/CheckboxTwo';
import SuccessPopUp from "../../Components/SuccessPopUp";
import { useForm } from "react-hook-form";
import { useAuth } from '../../Context/AuthProvider';
import { useLocation } from 'react-router-dom';
import { data } from "autoprefixer";

const getConvenient = async (type) => {
    if (localStorage.getItem('token')) {
        try {
            const response = await axios.post('/getConvenients', { 'type': type },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    withCredentials: true, // Include cookies
                },
            );
            // return response
            return response.data.convenient
        } catch (error) {
            console.error('Error fetching convenients:', error);
            return null; // or handle the error appropriately
        }
    } else {
        console.error('No token found. Please log in.');
        return null; // Handle no token case
    }
}
const checkExist = (array, index) => {
    if (array.indexOf(index) == -1) {
        return false;
    }
    return true;
}
export function EditHotel() {
    // Handle get hotel
    const location = useLocation();
    // 
    const [searchInput, setSearchInput] = useState('');
    const [focusPlace, setFocusPlace] = useState(false);
    const [flagChange, setFlagChanghe] = useState(false);
    const [searchPlaces, setSearchPlaces] = useState([]);
    const [convenientsHotel, setConvenientsHotel] = useState([]);
    const [convenientsRoom, setConvenientsRoom] = useState([]);
    const [arrayConveHotel, setArrayConveHotel] = useState([]);
    const [arrayConveRoom, setArrayConveRoom] = useState([[]]);
    const [nameActiveRoom, setRoomName] = useState('');
    const [checkPay, setCheckPay] = useState(false);
    const dropdownRef = useRef(null);
    const [rooms, setRooms] = useState([{}])
    const [activeRoom, setActiveRoom] = useState(0);
    const [selectedImages, setSelectedImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [previewsRoom, setPreviewsRoom] = useState([]);
    const [commune, setCommune] = useState(0);
    const [district, setDistrict] = useState(0);
    const [province, setProvince] = useState(0);
    const [hotelImages, setHotelImages] = useState([]);
    const [roomImages, setRoomImages] = useState([]);
    const { user } = useAuth();
    // alert mess
    const [mess, setMess] = useState('');
    const [main_mess, setMainMess] = useState('');
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.size > 0) {
            const hotel_id = queryParams.get('id');
            axios.post('/hotel/getHotelAndRoom', { hotel_id })
                .then(res => {
                    const dataHotel = res.data.hotel;
                    const dataRoom = res.data.rooms;
                    setArrayConveHotel(dataHotel.convenients);
                    setCheckPay(dataHotel.pay_rule);
                    hotelForm.reset({
                        name: dataHotel.name,
                        min_price: dataHotel.min_price,
                        checkin_rule: dataHotel.checkin_rule,
                        checkout_rule: dataHotel.checkout_rule,
                        location: dataHotel.location,
                        address: dataHotel.address,
                        hotel_rule: dataHotel.hotel_rule,
                        description: dataHotel.description,
                        hot_conve: dataHotel.hot_conve ? dataHotel.hot_conve.join("\n") : "",

                    });
                    roomForm.reset({
                        description: dataRoom[0].description,
                        price_per_night: dataRoom[0].price_per_night,
                        guest_count: dataRoom[0].guest_count,
                        area: dataRoom[0].area,
                        view_room: dataRoom[0].view_room,
                        room_count: dataRoom[0].room_count,
                        room_count: dataRoom[0].room_rule,
                        convenient: dataRoom[0].convenient ? dataRoom[0].convenient.join("\n") : "",

                    });
                    setRooms(dataRoom);
                    const dataConveRoom = [];
                    dataRoom.map((room, index) => {
                        dataConveRoom[index] = room.arrayConve;
                    })
                    setArrayConveRoom(dataConveRoom);
                    setActiveRoom(0);
                })
                .catch(error => {
                    console.error(error)
                })
        }

    }, [location]);
    useEffect(() => {
        if (!flagChange) {
            const delaySearch = setTimeout(() => {
                axios.post('/city_search', { 'query': searchInput },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    },
                )
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
                                idCommune: item['idCommune'],

                            })
                        })
                        setSearchPlaces(dataPlace)
                        if (dataPlace.length) {
                            setFocusPlace(true)
                        }
                        else {
                            setFocusPlace(false)
                        }
                    })
                    .catch((error) => {
                        setFocusPlace(false)
                        window.alert(error)
                    })
            }, 1000)
            return () => clearTimeout(delaySearch)
        }
    }, [searchInput])

    useEffect(() => {
        const fetchConvenients = async () => {
            const convenients = await getConvenient('hotel');
            const convenients_room = await getConvenient('room')
            if (convenients && convenients_room) {
                setConvenientsHotel(convenients);
                setConvenientsRoom(convenients_room);
            } else {
                console.error('Failed to fetch convenients');
            }
        };
        fetchConvenients();
    }, [arrayConveRoom]);
    // Handle submitroom
    useEffect(() => {
        roomForm.setValue("description", rooms[activeRoom].description);
        roomForm.setValue("price_per_night", rooms[activeRoom].price_per_night);
        roomForm.setValue("guest_count", rooms[activeRoom].guest_count);
        roomForm.setValue("area", rooms[activeRoom].area);
        roomForm.setValue("view_room", rooms[activeRoom].view_room);
        roomForm.setValue("room_count", rooms[activeRoom].room_count);
        roomForm.setValue("room_rule", rooms[activeRoom].room_rule);
        roomForm.setValue("convenient", rooms[activeRoom].convenient ? rooms[activeRoom].convenient.join("\n") : "");
    }, [activeRoom])

    const roomForm = useForm();
    const hotelForm = useForm();
    // Watch the select value (optional)
    const selectedOption = hotelForm.watch("mySelect");
    const addMoreRoom = () => {
        setRooms([...rooms, {}]);
        setArrayConveRoom([...arrayConveRoom, []]);
        setRoomName('');
        setActiveRoom(rooms.length);
    }
    const deleteRoom = (key) => {
        if (rooms.length > 1) {
            setActiveRoom((activeRoom - 1) >= 0 ? activeRoom - 1 : 0);
            const data_room = rooms.filter((room, index) => index !== key);
            const data_converoom = arrayConveRoom.filter((room, index) => index !== key);
            setRooms(data_room);
            setArrayConveRoom(data_converoom);
        }
    }
    const roomSubmit = (data) => {
        data.name = nameActiveRoom;
        if (nameActiveRoom != '') {
            data.arrayConve = arrayConveRoom[activeRoom];
            data.images = roomImages;
            data.convenient = data.convenient.split("\n");
            const data_room = rooms;
            data_room[activeRoom] = data;
            console.log(data_room)
            setRooms(data_room);
            setMainMess(`Upload room ${nameActiveRoom} image successfully`);
            setMess('Edit then click upload button again to reset your room image');
            handleShowNotification();
        }
        else {
            setMainMess('Missing room name');
            setMess('Type your room type then submit again !');
            handleShowNotification();
        }
    }
    const hotelSubmit = (data) => {
        const submitData = {};
        submitData.hotel = data;
        submitData.hotel.admin_id = user.id
        submitData.hotel.convenients = arrayConveHotel
        submitData.hotel.commune = commune
        submitData.hotel.district = district
        submitData.hotel.province = province
        submitData.hotel.images = hotelImages
        submitData.hotel.pay_rule = checkPay ? 1 : 0;
        submitData.room = rooms;
        axios.post('/storeHotel', submitData).then(
            res => {
                if (res.data.status == 200) {
                    console.log(res.data)
                }
                else {
                    const errorResponse = res.data.error;
                    const errorKey = Object.keys(errorResponse.error)[0]; // Get the dynamic key
                    const errorMessage = errorResponse.error[errorKey][0]; // Access the message
                    console.error(errorMessage); // Outputs: "The name has already been taken."
                }
            }
        )
            .catch(error => {
                if (error.response) {
                    // Server responded with a status other than 2xx\
                    const errorResponse = error.response.data
                    const errorKey = Object.keys(errorResponse.error)[0]; // Get the dynamic key
                    const errorMessage = errorResponse.error[errorKey][0]; // Access the message
                    console.log(errorMessage); // Outputs: "The name has already been taken."
                } else if (error.request) {
                    // Request was made but no response received
                } else {
                    // Something else happene
                }
            })
    }
    // Hotel
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);

        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setPreviews(previewUrls);
    };
    const handleUpload = async () => {
        const formData = new FormData();
        selectedImages.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });

        try {
            const response = await axios.post('/storeHotelImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setHotelImages(response.data.uploaded_images);
            setMainMess('Upload Hotel image successfully');
            setMess('Upload images then click upload button again to reset your Hotel image');
            handleShowNotification();
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };
    // Room
    const handleFileChangeRoom = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);

        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setPreviewsRoom(previewUrls);
    };
    const handleUploadRoom = async () => {
        const formData = new FormData();
        selectedImages.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });
        console.log(formData)
        try {
            const response = await axios.post('/storeRoomImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log('Upload success:', response.data);
            setRoomImages(response.data.uploaded_images);
            setMainMess('Upload Room image successfully');
            setMess('Upload images then click upload button again to reset your Room image');
            handleShowNotification();
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };
    // Notify
    const [showNotification, setShowNotification] = useState(false);

    const handleShowNotification = () => {
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 2500); // 3 seconds
    };
    return (
        <>
            {showNotification && (
                <SuccessPopUp
                    mess={mess}
                    main_mess={main_mess}
                    onClose={() => setShowNotification(false)}
                />
            )}

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                <form onSubmit={(e) => {
                    e.stopPropagation(); // Prevent outer form from submitting
                    hotelForm.handleSubmit(hotelSubmit)(e);
                }}>
                    <div className="flex flex-col gap-9">
                        {/* <!-- Input Fields --> */}
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-6 dark:border-strokedark">
                                <h3 className="font-bold text-black dark:text-white">
                                    Thông tin cơ bản
                                </h3>
                            </div>
                            <div className="flex flex-col gap-5 p-6">
                                <div>
                                    <label className="mb-3 text-black dark:text-white flex flex-row items-center">
                                        Tên khách sạn
                                        <div className="text-red-500 px-2 text-sm" >{hotelForm.formState.errors.name?.message}</div>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập tên khách sạn"
                                        value={hotelForm.watch("name")}
                                        {...hotelForm.register("name", { required: "Hotel name room is required" })}
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="mb-3 flex flex-row items-center text-black dark:text-white">
                                        Loại khách sạn
                                        <div className="text-red-500 px-2 text-sm" >{hotelForm.formState.errors.mySelect?.message}</div>
                                    </label>

                                    <div className="relative z-20 bg-white dark:bg-form-input">
                                        <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <g opacity="0.8">
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M10.0007 2.50065C5.85852 2.50065 2.50065 5.85852 2.50065 10.0007C2.50065 14.1428 5.85852 17.5007 10.0007 17.5007C14.1428 17.5007 17.5007 14.1428 17.5007 10.0007C17.5007 5.85852 14.1428 2.50065 10.0007 2.50065ZM0.833984 10.0007C0.833984 4.93804 4.93804 0.833984 10.0007 0.833984C15.0633 0.833984 19.1673 4.93804 19.1673 10.0007C19.1673 15.0633 15.0633 19.1673 10.0007 19.1673C4.93804 19.1673 0.833984 15.0633 0.833984 10.0007Z"
                                                        fill="#637381"
                                                    ></path>
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M0.833984 9.99935C0.833984 9.53911 1.20708 9.16602 1.66732 9.16602H18.334C18.7942 9.16602 19.1673 9.53911 19.1673 9.99935C19.1673 10.4596 18.7942 10.8327 18.334 10.8327H1.66732C1.20708 10.8327 0.833984 10.4596 0.833984 9.99935Z"
                                                        fill="#637381"
                                                    ></path>
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M7.50084 10.0008C7.55796 12.5632 8.4392 15.0301 10.0006 17.0418C11.5621 15.0301 12.4433 12.5632 12.5005 10.0008C12.4433 7.43845 11.5621 4.97153 10.0007 2.95982C8.4392 4.97153 7.55796 7.43845 7.50084 10.0008ZM10.0007 1.66749L9.38536 1.10547C7.16473 3.53658 5.90275 6.69153 5.83417 9.98346C5.83392 9.99503 5.83392 10.0066 5.83417 10.0182C5.90275 13.3101 7.16473 16.4651 9.38536 18.8962C9.54325 19.069 9.76655 19.1675 10.0007 19.1675C10.2348 19.1675 10.4581 19.069 10.6159 18.8962C12.8366 16.4651 14.0986 13.3101 14.1671 10.0182C14.1674 10.0066 14.1674 9.99503 14.1671 9.98346C14.0986 6.69153 12.8366 3.53658 10.6159 1.10547L10.0007 1.66749Z"
                                                        fill="#637381"
                                                    ></path>
                                                </g>
                                            </svg>
                                        </span>

                                        <select
                                            value={selectedOption}
                                            {...hotelForm.register("type", { required: "This field is required" })}
                                            className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input
                        }`}
                                        >
                                            <option value="" disabled className="text-body dark:text-bodydark">
                                                Select Type
                                            </option>
                                            <option value="hotel" className="text-body dark:text-bodydark">
                                                Hotel
                                            </option>
                                            <option value="homestay" className="text-body dark:text-bodydark">
                                                Homestay
                                            </option>
                                        </select>

                                        <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <g opacity="0.8">
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                        fill="#637381"
                                                    ></path>
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-3 flex flex-row items-center text-black dark:text-white">
                                        Giá từ (vnd)
                                        <div className="text-red-500 px-2 text-sm" >{hotelForm.formState.errors.min_price?.message}</div>
                                    </label>
                                    <input
                                        value={hotelForm.watch("min_price")}
                                        name="min_price"
                                        {...hotelForm.register("min_price", {
                                            required: "Price room is required",
                                            validate: {
                                                positivePrice: value => value > 0 || "Price must be greater than 0",
                                            }
                                        })}
                                        type="number"
                                        placeholder="Giá phòng thấp nhất"
                                        className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                                    />
                                </div>
                                <div>
                                    <div className='p-2'>
                                        <label
                                            htmlFor={`checkboxLabel`}
                                            className="flex cursor-pointer select-none items-center"
                                        >
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    id={`checkboxLabel`}
                                                    className="sr-only"
                                                    onChange={() => {
                                                        setCheckPay(!checkPay);
                                                    }}
                                                />
                                                <div
                                                    className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${checkPay && 'border-primary bg-gray dark:bg-transparent'
                                                        }`}
                                                >
                                                    <span className={`opacity-0 ${checkPay && '!opacity-100'}`}>
                                                        <svg
                                                            width="11"
                                                            height="8"
                                                            viewBox="0 0 11 8"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                                                fill="#3056D3"
                                                                stroke="#3056D3"
                                                                strokeWidth="0.4"
                                                            ></path>
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='flex items-center font-semibold text-green-500' >
                                                Yêu cầu thanh toán online
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-3 text-black dark:text-white flex flex-row items-center">
                                        Thời gian checkin
                                        <div className="text-red-500 px-2 text-sm" >{hotelForm.formState.errors.checkin_rule?.message}</div>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ : 14:00 - 23:00"
                                        value={hotelForm.watch("checkin_rule")}
                                        {...hotelForm.register("checkin_rule", { required: "Check in time is required" })}
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="mb-3 text-black dark:text-white flex flex-row items-center">
                                        Thời gian checkout
                                        <div className="text-red-500 px-2 text-sm" >{hotelForm.formState.errors.checkout_rule?.message}</div>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: 12:00"
                                        value={hotelForm.watch("checkout_rule")}
                                        {...hotelForm.register("checkout_rule", { required: "Check out time is required" })}
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div className="w-full relative">
                                    <div>
                                        <label className="mb-3 flex flex-row items-center font-medium text-black dark:text-white">
                                            Vị trí (Tỉnh / Thành phố / Thị xã / Huyện)
                                            <div className="text-red-500 px-2 text-sm" >{hotelForm.formState.errors.location?.message}</div>
                                        </label>
                                        <input
                                            value={hotelForm.watch("location")}
                                            {...hotelForm.register("location", { required: "This location is required" })}
                                            onChange={(e) => { setSearchInput(e.target.value); setFlagChanghe(false) }}
                                            type="text"
                                            placeholder="Chọn từ danh sách hiện ra"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                                        />
                                    </div>
                                    {focusPlace && <div className="w-full border border-gray-200 rounded-lg bg-white shadow-md p-4 absolute z-50" ref={dropdownRef}>
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
                                <div>
                                    <label className="mb-3 flex flex-row items-center text-black dark:text-white">
                                        Địa chỉ chi tiết
                                        <div className="text-red-500 px-2 text-sm" >{hotelForm.formState.errors.address?.message}</div>
                                    </label>
                                    <input
                                        value={hotelForm.watch("address")}
                                        {...hotelForm.register("address", { required: "Address is required" })}
                                        type="text"
                                        placeholder="Số nhà, tên đường, phường, quận, thành phố"
                                        className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-3 flex flex-row items-center text-black">
                                        Điểm nổi bật của chỗ nghỉ
                                        <div className="text-red-500 px-2 text-sm" >{hotelForm.formState.errors.hot_conve?.message}</div>
                                    </label>
                                    <textarea
                                        rows={6}
                                        value={hotelForm.watch("hot_conve")}
                                        placeholder="Mô tả chi tiết khách sạn"
                                        {...hotelForm.register("hot_conve", { required: "Điểm nổi bật của chỗ nghỉ is required" })}
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-blue-gray-700 active:border-blue-gray-700 disabled:cursor-default disabled:bg-whiter border-form-strokedark bg-form-input focus:border-primary"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="mb-3 flex flex-row items-center text-black">
                                        Mô tả khách sạn
                                        <div className="text-red-500 px-2 text-sm" >{hotelForm.formState.errors.description?.message}</div>
                                    </label>
                                    <textarea
                                        rows={6}
                                        placeholder="Mô tả chi tiết khách sạn"
                                        {...hotelForm.register("description", { required: "Hotel description is required" })}
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-blue-gray-700 active:border-blue-gray-700 disabled:cursor-default disabled:bg-whiter border-form-strokedark bg-form-input focus:border-primary"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Toggle switch input --> */}
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-6 dark:border-strokedark">
                                <h3 className="font-medium text-black dark:text-white">
                                    Tiện ích nổi bật của khách sạn
                                </h3>
                            </div>
                            {convenientsHotel.length > 0 && convenientsHotel ?

                                (convenientsHotel.map((item) => <CheckboxTwo check={checkExist(arrayConveHotel, item.id)} key={item.id} type="hotel" arrayConveHotel={arrayConveHotel} setArrayConveHotel={setArrayConveHotel} id={item.id} name={item.convenient_name} />))
                                : (
                                    <li className="text-red-500">No convenients found.</li>
                                )
                            }
                        </div>
                        <div>
                            <label className="mb-3 flex flex-row items-center text-black dark:text-white">
                                Yêu cầu đặt biệt
                            </label>
                            <textarea
                                name="hotel_rule"
                                value={roomForm.watch("hotel_rule")}
                                rows={5}
                                {...roomForm.register("hotel_rule")}
                                placeholder="Yêu cầu về chi phí hoàn hủy, trẻ em, ..."
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                            ></textarea>
                        </div>

                        {/* <!-- File upload --> */}
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-6 dark:border-strokedark">
                                <h3 className="font-medium text-black dark:text-white">
                                    Upload ảnh khách sạn
                                </h3>
                            </div>
                            <div className="flex flex-col gap-5 p-6">
                                <div>
                                    <label className="mb-3 block text-black dark:text-white">
                                        Đính kèm tất cả ảnh tại đây
                                    </label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div className="flex gap-6 mt-5 w-full overflow-hidden overflow-x-scroll">
                                    {previews.map((preview, index) => (
                                        <img
                                            key={index}
                                            src={preview}
                                            alt={`Preview ${index}`}
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                    ))}
                                </div>
                                <button className="w-[40%] font-bold bg-[#2c6657] border-[#2c6657] border rounded-full inline-flex items-center justify-center py-3 px-7 text-center text-base text-white hover:bg-[#0BB489] hover:border-[#0BB489] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5" onClick={e => { e.preventDefault(); handleUpload() }}>Xác nhận ảnh khách sạn</button>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className='mt-4 mx-auto font-bold bg-[#0c0f0e] border-[#2c6657] border rounded-xl inline-flex items-center justify-center py-3 px-7 text-center text-base text-white hover:bg-[#0BB489] hover:border-[#0BB489] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5'>
                        Hoàn tất khách sạn
                    </button>
                </form>
                <div className="flex flex-col mt-5 gap-3">
                    {/* <!-- Textarea Fields --> */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="flex flex-row w-full items-center gap-9 justify-center pt-3">
                            <div className="flex flex-col">
                                {rooms.length > 0
                                    && rooms.map((item, key) =>
                                        <ul key={key} className={`w-full bg-white shadow overflow-hidden sm:rounded-md max-w-sm ${key == activeRoom ? 'border border-red-500' : ''}`}>
                                            <li>
                                                <div className="px-4 py-5 sm:px-6">
                                                    <div className="flex items-center justify-between">
                                                        <input type="text" disabled={key != activeRoom} onChange={(e) => setRoomName(e.target.value)} value={item.name} className="focus:border-white p-1 text-lg leading-6 font-bold text-gray-900" placeholder="Tên loại phòng" />
                                                        <div onClick={() => setActiveRoom(key)} className="pr-2 font-bold cursor-pointer text-indigo-600 hover:text-indigo-500">Sửa</div>
                                                        <div onClick={() => deleteRoom(key)} className="font-bold cursor-pointer text-red-600 hover:text-indigo-500">Xóa</div>

                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    )
                                }
                            </div>

                            <button className='bg-[#6B7280] border-[#6B7280] border rounded-md inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-[#0BB489] hover:border-[#0BB489] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5'>
                                <span className='mr-[10px]'>
                                    <svg
                                        width={20}
                                        height={20}
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="fill-current"
                                    >
                                        <g clipPath="url(#clip0_906_8052)">
                                            <path d="M13.1875 9.28125H10.6875V6.8125C10.6875 6.4375 10.375 6.125 9.96875 6.125C9.59375 6.125 9.28125 6.4375 9.28125 6.84375V9.3125H6.8125C6.4375 9.3125 6.125 9.625 6.125 10.0312C6.125 10.4062 6.4375 10.7187 6.84375 10.7187H9.3125V13.1875C9.3125 13.5625 9.625 13.875 10.0312 13.875C10.4062 13.875 10.7187 13.5625 10.7187 13.1562V10.6875H13.1875C13.5625 10.6875 13.875 10.375 13.875 9.96875C13.875 9.59375 13.5625 9.28125 13.1875 9.28125Z" />
                                            <path d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.8125 19.4688 10.0312 19.4688C15.25 19.4688 19.5 15.2188 19.5 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.5625 18.0625 10C18.0625 14.4375 14.4375 18.0625 10 18.0625Z" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_906_8052">
                                                <rect width={20} height={20} fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </span>
                                <span onClick={addMoreRoom} className="font-bold">Thêm phòng</span>
                            </button>
                        </div>
                        <div className="flex flex-col gap-5 p-6">
                            <form onSubmit={(e) => {
                                e.preventDefault(); // Prevent inner form from submitting to the outer form
                                e.stopPropagation(); // Prevent outer form from submitting
                                roomForm.handleSubmit(roomSubmit)(e);
                            }} className="">
                                <div>
                                    <label className="mb-3 text-black dark:text-white flex flex-row items-center">
                                        Mô tả phòng
                                        <div className="text-red-500 px-2 text-sm" >{roomForm.formState.errors.description?.message}</div>
                                    </label>
                                    <textarea
                                        rows={6}
                                        name="description"
                                        value={roomForm.watch("description")}
                                        {...roomForm.register("description", { required: "Description room is required" })}
                                        placeholder="Default textarea"
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="mb-3 text-black items-center dark:text-white flex flex-row">
                                        Giá phòng (vnd)
                                        <div className="text-red-500 px-2 text-sm" >{roomForm.formState.errors.price_per_night?.message}</div>
                                    </label>
                                    <input
                                        type="number"
                                        value={roomForm.watch("price_per_night")}
                                        name="price_per_night"
                                        {...roomForm.register("price_per_night", {
                                            required: "Price room is required",
                                            validate: {
                                                positivePrice: value => value > 0 || "Price must be greater than 0",
                                            }
                                        })}
                                        placeholder="Ex: 100.5 $"
                                        className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-3  text-black items-center dark:text-white flex flex-row">
                                        Số lượng khách tối đa
                                        <div className="text-red-500 px-2 text-sm" >{roomForm.formState.errors.guest_count?.message}</div>
                                    </label>
                                    <input
                                        name="guest_count"
                                        value={roomForm.watch("guest_count")}
                                        type="number"
                                        {...roomForm.register("guest_count", {
                                            required: "Guest accept is required",
                                            validate: {
                                                positivePrice: value => value > 1 || "Guests must be greater than 1",
                                            }
                                        })}
                                        placeholder="Ex: 2"
                                        className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-3 flex flex-row items-center text-black dark:text-white">
                                        Diện tích (m²)
                                        <div className="text-red-500 px-2 text-sm" >{roomForm.formState.errors.area?.message}</div>
                                    </label>
                                    <input
                                        type="number"
                                        value={roomForm.watch("area")}
                                        name="area"
                                        {...roomForm.register("area", {
                                            required: "Area room is required",
                                            validate: {
                                                positivePrice: value => value > 10 || "Area must be greater than 10",
                                            }
                                        })}
                                        placeholder="Ex: 27"
                                        className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-3  text-black items-center dark:text-white flex flex-row">
                                        Số lượng phòng
                                        <div className="text-red-500 px-2 text-sm" >{roomForm.formState.errors.room_count?.message}</div>
                                    </label>
                                    <input
                                        name="room_count"
                                        value={roomForm.watch("room_count")}
                                        type="number"
                                        {...roomForm.register("room_count", {
                                            required: "Rooms accept is required",
                                            validate: {
                                                positivePrice: value => value >= 1 || "Rooms must be greater or equal 1",
                                            }
                                        })}
                                        placeholder="Ex: 2"
                                        className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-3 flex flex-row items-center text-black dark:text-white">
                                        Hướng tầm nhìn
                                        <div className="text-red-500 px-2 text-sm" >{roomForm.formState.errors.view_room?.message}</div>
                                    </label>
                                    <input
                                        type="text"
                                        value={roomForm.watch("view_room")}
                                        name="view_room"
                                        {...roomForm.register("view_room", {
                                            required: "View room is required",
                                        })}
                                        placeholder="Ví dụ: Nhìn ra biển"
                                        className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-3 flex flex-row items-center text-black dark:text-white">
                                        Tiện ích nổi bật
                                    </label>
                                    {convenientsRoom.length > 0 && convenientsRoom ?

                                        (convenientsRoom.map((item) => <CheckboxTwo check={checkExist(arrayConveRoom[activeRoom], item.id)} roomId={activeRoom} key={item.id} type="room" arrayConveHotel={arrayConveRoom} setArrayConveHotel={setArrayConveRoom} id={item.id} name={item.convenient_name} />))
                                        : (
                                            <li className="text-red-500">No convenients found.</li>
                                        )
                                    }
                                </div>
                                <div>
                                    <label className="mb-3 flex flex-row items-center text-black dark:text-white">
                                        Thêm tiện ích
                                        <div className="text-red-500 px-2 text-sm" >{roomForm.formState.errors.convenient?.message}</div>
                                    </label>
                                    <textarea
                                        name="convenient"
                                        value={roomForm.watch("convenient")}
                                        rows={5}
                                        {...roomForm.register("convenient", { required: "Convenient room is required" })}
                                        placeholder="Mỗi tiện ích bạn ghi 1 dòng ( Tối đa 10 )"
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="mb-3 flex flex-row items-center text-black dark:text-white">
                                        Yêu cầu đặt biệt
                                    </label>
                                    <textarea
                                        name="room_rule"
                                        value={roomForm.watch("room_rule")}
                                        rows={5}
                                        {...roomForm.register("room_rule")}
                                        placeholder="Yêu cầu về chi phí hoàn hủy, trẻ em, ..."
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                                    ></textarea>
                                </div>
                                {/* <!-- File upload --> */}
                                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                    <div className="flex flex-col gap-5 p-6">
                                        <div>
                                            <label className="mb-3 block text-black dark:text-white">
                                                Upload ảnh phòng
                                            </label>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleFileChangeRoom}
                                                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                        <div className="flex gap-6 mt-5 w-full overflow-hidden overflow-x-scroll">
                                            {previewsRoom.map((preview, index) => (
                                                <img
                                                    key={index}
                                                    src={preview}
                                                    alt={`Preview ${index}`}
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                />
                                            ))}
                                        </div>
                                        <button className="w-[40%] font-bold bg-[#2c6657] border-[#2c6657] border rounded-full inline-flex items-center justify-center py-3 px-7 text-center text-base text-white hover:bg-[#0BB489] hover:border-[#0BB489] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5" onClick={e => { e.preventDefault(); handleUploadRoom() }}>Xác nhận ảnh phòng</button>
                                    </div>
                                </div>
                                <button type="submit" className='mt-4 font-bold bg-[#0c0f0e] border-[#2c6657] border rounded-xl inline-flex items-center justify-center py-3 px-7 text-center text-base text-white hover:bg-[#0BB489] hover:border-[#0BB489] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5'>
                                    Hoàn tất tạo phòng này
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default EditHotel;
