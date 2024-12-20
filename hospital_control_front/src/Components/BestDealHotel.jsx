import React from "react";

const BookingCard = () => {
    return (

        <div className="relative flex items-center justify-center mt-14">
            <div className="relative w-8/12 bg-cover bg-center " style={{ backgroundImage: "https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_380,q_45,w_980/v1563453634/mag/2015/10/18153001/bekarliga-veda-las-vegas.jpeg" }}>
                {/* Overlay */}
                <div className=" overflow-hidden rounded-t-3xl w-full absolute inset-0 bg-opacity-40 before:content-[''] before:absolute before:top-0 before:h-40 before:w-full before:z-[1] before:bg-gradient-to-b before:from-[#000000b3] before:via-[#00000080] before:to-transparent after:content-[''] after:absolute after:bottom-0 after:bg-gradient-to-t after:from-white after:to-transparent after:h-40 after:w-full">
                <img className=" inset-0 w-full h-full object-cover" src="https://imgcy.trivago.com/c_fill,d_dummy.jpeg,e_sharpen:60,f_auto,h_380,q_45,w_980/v1563453634/mag/2015/10/18153001/bekarliga-veda-las-vegas.jpeg" alt="" />

                </div>
                {/* Content */}
                <div className="relative z-10  flex-col r h-full flex rounded-lg">
                    <h1 className="text-white text-3xl font-bold mb-4 p-5">Khám phá thời gian đặt phòng tốt nhất của bạn</h1>

                    <div className="bg-white rounded-lg shadow-lg p-6 w-9/12 mx-auto mt-12">
                        {/* City Buttons */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Chicago", "Paris", "Pigeon Forge", "Cancun", "New"].map((city) => (
                                <button
                                    key={city}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded-lg"
                                >
                                    {city}
                                </button>
                            ))}
                        </div>

                        {/* Pricing Information */}
                        <div className=" grid grid-cols-2 gap-4">
                            {[
                                { month: "November", price: "$50 - $270" },
                                { month: "December", price: "$50 - $375" },
                                { month: "January", price: "$65 - $370" },
                                { month: "February", price: "$70 - $350" },
                                { month: "March", price: "$80 - $350" },
                                { month: "April", price: "$80 - $410" },
                                { month: "May", price: "$80 - $395" },
                                { month: "June", price: "$70 - $285" },
                                { month: "July", price: "$70 - $290" },
                                { month: "August", price: "$75 - $315" },
                                { month: "September", price: "$85 - $330" },
                                { month: "October", price: "$120 - $445" },
                            ].map(({ month, price }) => (
                                <div
                                    key={month}
                                    className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    <span className="font-medium">{month}</span>
                                    <span className="text-gray-500">{price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingCard;
