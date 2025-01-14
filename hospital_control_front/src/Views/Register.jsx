import React from "react";
import { useState } from "react";
import { useForm, FormProvider, useFormContext, useWatch } from "react-hook-form"
import { axios } from "../api/axios";
import { redirect } from "react-router-dom";
import SuccessPopUp from "../Components/SuccessPopUp"
export default function Register() {
    const baseURL = import.meta.env.VITE_URL_API_BASE
    const [typeRegis, setTypeRegis] = useState('admin') //Role sign up
    const [regisFail, setRegisFail] = useState(false)
    const [failMessage, setFailMessage] = useState('')
    //Submit form
    const { handleSubmit, register, formState: { errors } } = useForm()

    const onSubmit = handleSubmit((data) => {
        data['role'] = typeRegis
        axios.post('/register', data).then(
            res => {
                if (res.data.status == 200) {
                    window.location.href = '/'
                }
                else {
                    setRegisFail(true)
                    setFailMessage(res.data.error.user_phone || res.data.error.email)
                }
            }
        )
            .catch(error => {
                setRegisFail(true);
                console.log(error)
                if (error.response) {
                    // Server responded with a status other than 2xx
                    setFailMessage(error.response.data.error.email || error.response.data.error.user_phone || "An error occurred during registration.");
                } else if (error.request) {
                    // Request was made but no response received
                    setFailMessage("No response from server. Please try again later.");
                } else {
                    // Something else happened
                    setFailMessage("Registration failed. Please try again.");
                }
            })
    })


    return (
        <>
            <section className="bg-gray-50">
                <div className="flex justify-center min-h-screen">
                    <div
                        className="hidden bg-cover lg:block lg:w-2/5"
                        style={{
                            backgroundImage:
                                'url("https://s-real.vn/wp-content/uploads/2021/09/Villa-c%C3%B3-ph%E1%BA%A3i-l%C3%A0-bi%E1%BB%87t-th%E1%BB%B1-kh%C3%B4ng.jpg")',
                        }}
                    ></div>
                    <div className="flex items-center w-full max-w-3xl p-10 mx-auto lg:px-16 lg:w-3/5 bg-white shadow-lg rounded-lg">
                        <div className="w-full">
                            <h1 className="text-3xl font-bold text-gray-800 capitalize">Tạo tài khoản của bạn</h1>
                            <p className="mt-4 text-gray-600">
                                Hãy bắt đầu bằng cách tạo tài khoản để đặt phòng cho chuyến đi mơ ước tiếp theo của bạn.
                            </p>

                            <div className="mt-6">
                                <h1 className="text-lg font-medium text-gray-700">Chọn loại tài khoản</h1>
                                <div className="mt-4 flex items-center gap-4">
                                    <button
                                        className={`flex items-center gap-2 px-6 py-3 border rounded-lg text-sm font-medium transition-colors duration-300 ${typeRegis === "admin"
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                                            }`}
                                        onClick={() => setTypeRegis("admin")}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                        Quản lý
                                    </button>
                                    <button
                                        className={`flex items-center gap-2 px-6 py-3 border rounded-lg text-sm font-medium transition-colors duration-300 ${typeRegis === "user"
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                                            }`}
                                        onClick={() => setTypeRegis("user")}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        Khách hàng
                                    </button>
                                </div>
                            </div>

                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
                            >
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Họ</label>
                                    <input
                                        type="text"
                                        placeholder="Nguyễn"
                                        {...register("firstName", { required: "Họ là bắt buộc" })}
                                        className="block w-full px-5 py-3 border rounded-lg text-gray-700 bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <div className="text-red-500 mt-1 text-sm">{errors.firstName?.message}</div>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Tên</label>
                                    <input
                                        type="text"
                                        placeholder="Văn A"
                                        {...register("lastName", { required: "Tên là bắt buộc" })}
                                        className="block w-full px-5 py-3 border rounded-lg text-gray-700 bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <div className="text-red-500 mt-1 text-sm">{errors.lastName?.message}</div>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Số điện thoại</label>
                                    <input
                                        type="text"
                                        placeholder="0123-456-789"
                                        {...register("user_phone", {
                                            required: "Số điện thoại là bắt buộc",
                                            pattern: {
                                                value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                                                message: "Số điện thoại không hợp lệ",
                                            },
                                        })}
                                        className="block w-full px-5 py-3 border rounded-lg text-gray-700 bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <div className="text-red-500 mt-1 text-sm">{errors.phone?.message}</div>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Địa chỉ Email</label>
                                    <input
                                        type="email"
                                        placeholder="nguyenvana@gmail.com"
                                        {...register("email", {
                                            required: "Email là bắt buộc",
                                            pattern: {
                                                value: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/,
                                                message: "Email không hợp lệ",
                                            },
                                        })}
                                        className="block w-full px-5 py-3 border rounded-lg text-gray-700 bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <div className="text-red-500 mt-1 text-sm">{errors.email?.message}</div>
                                </div>

                                <div>
                                    <label className="text-left block mb-2 text-sm text-gray-600 dark:text-gray-200">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        id="password"
                                        {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password need at least 8 character" } })}
                                        className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                    />
                                    <div className="text-red-500 px-2 text-sm" >{errors.password?.message}</div>

                                </div>
                                <div>
                                    <label className="text-left block mb-2 text-sm text-gray-600 dark:text-gray-200">
                                        Confirm password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        id="rePassword"
                                        {...register("rePassword", {
                                            required: "Confirm Password is required", validate: (val) => {
                                                if (password.value != val) {
                                                    return "Confirm password not match"
                                                }
                                            }
                                        })}
                                        className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                    />
                                    <div className="text-red-500 px-2 text-sm" >{errors.rePassword?.message}</div>
                                </div>

                                <div className="col-span-2">
                                    <button
                                        className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors duration-300"
                                        onClick={onSubmit}
                                    >
                                        Đăng ký
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>



        </>
    )
}