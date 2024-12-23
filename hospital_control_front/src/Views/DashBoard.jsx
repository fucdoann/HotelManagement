import React, { useState } from "react";
import Header from "../Components/Header";
import SingleImage from "../Components/SingleImage";
const DashBoard = () => {
  return (
    <>
      <Header />
      <div className="relative h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 pb-[120px] pt-[150px] dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between">
            {/* Left Content */}
            <div className="w-full lg:w-6/12 mb-12 lg:mb-0">
              <div className="max-w-lg mx-auto lg:mx-0">
                <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Tìm nơi lưu trú lý tưởng
                </h1>
                <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
                Đặt phòng khách sạn mơ ước dễ dàng với BeBook. Ưu đãi độc quyền, phòng cao cấp và trải nghiệm đặt phòng mượt mà đang chờ bạn.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a
                    href="/hotel"
                    className="inline-block bg-blue-600 hover:bg-blue-800 text-white text-lg font-semibold px-8 py-3 rounded-md shadow-lg"
                  >
                    Bắt đầu đặt phòng
                  </a>
                  <a
                    href="/about"
                    className="inline-block text-blue-600 hover:underline text-lg font-semibold"
                  >
                    Tìm hiểu thêm
                  </a>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="w-full lg:w-5/12">
              <div className="relative">
                <img
                  src="../public/dashboardimg.jpg"
                  alt="Luxury Hotel"
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-md shadow-md">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    <span className="text-blue-600">10%</span> giảm giá vào lần đặt phòng đầu tiên!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoard;




