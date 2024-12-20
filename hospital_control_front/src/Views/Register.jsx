import React from "react";
import { useState } from "react";
import { useForm, FormProvider, useFormContext, useWatch } from "react-hook-form"
import {axios} from "../api/axios";
import { redirect } from "react-router-dom";
import  SuccessPopUp from "../Components/SuccessPopUp" 
export default function Register() {
    const baseURL = import.meta.env.VITE_URL_API_BASE
    const [typeRegis, setTypeRegis] = useState('admin') //Role sign up
    const [regisFail, setRegisFail] = useState(false)
    const [failMessage, setFailMessage] = useState('')
    //Submit form
    const { handleSubmit, register, formState: { errors } } = useForm()

    const onSubmit = handleSubmit((data) => {
        data['role'] = typeRegis
        console.log(data)
        axios.post('/register', data).then(
            res => {
                if (res.data.status == 200) {
                    window.location.href = '/'
                }
                else {
                    setRegisFail(true)
                    setFailMessage(res.data.error.user_phone || res.data.error.email )                    
                }
            }
        )
        .catch(error => {
            setRegisFail(true);
            console.log(error)
            if (error.response) {
                // Server responded with a status other than 2xx
                setFailMessage(error.response.data.error.email ||error.response.data.error.user_phone|| "An error occurred during registration.");
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
            <section className="bg-white dark:bg-gray-900">
                <div className="flex justify-center min-h-screen">
                    <div
                        className="hidden bg-cover lg:block lg:w-2/5"
                        style={{
                            backgroundImage:
                                'url("https://images.unsplash.com/photo-1494621930069-4fd4b2e24a11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80")'
                        }}
                    ></div>
                    <div className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5">
                        <div className="w-full">
                            <h1 className="text-2xl font-semibold tracking-wider text-gray-800 capitalize dark:text-white">
                                Get your free account now.
                            </h1>
                            <p className="mt-4 text-gray-500 dark:text-rgay-400">
                                Let’s get you all set up so you can verify your personal account and
                                begin setting up your profile.
                            </p>
                            <div className="mt-6">
                                <h1 className="text-gray-500 dark:text-gray-300">
                                    Select type of account
                                </h1>
                                <div className="mt-3 md:flex md:items-center md:-mx-2 justify-center" >
                                    <button className={"flex justify-center w-full px-6 py-3 rounded-lg md:w-auto md:mx-2 focus:outline-none" + (typeRegis == 'admin' ? " text-white bg-blue-500" : " text-blue-500 border border-blue-500 dark:border-blue-400 dark:text-blue-400")} onClick={() => setTypeRegis('admin')}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-6 h-6"
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
                                        <span className="mx-2">Manager</span>
                                    </button>
                                    <button className={"flex justify-center w-full px-6 py-3 mt-4 rounded-lg md:mt-0 md:w-auto md:mx-2  focus:outline-none" + (typeRegis == 'user' ? " text-white bg-blue-500" : " text-blue-500 border border-blue-500 dark:border-blue-400 dark:text-blue-400")} onClick={() => setTypeRegis('user')}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-6 h-6"
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
                                        <span className="mx-2">Client</span>
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={e => e.preventDefault()} className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
                                <div>
                                    <label className="text-left block mb-2 text-sm text-gray-600 dark:text-gray-200">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="John"
                                        id="firstName"
                                        {...register("firstName", { required: "First name is required" })}
                                        className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                    />
                                    <div className="text-red-500 px-2 text-sm" >{errors.firstName?.message}</div>
                                </div>
                                <div>
                                    <label className="text-left block mb-2 text-sm text-gray-600 dark:text-gray-200">
                                        Last name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Snow"
                                        id="lastName"
                                        {...register("lastName", { required: "Last name is required" })}
                                        className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                    />
                                    <div className="text-red-500 px-2 text-sm" >{errors.lastName?.message}</div>

                                </div>
                                <div>
                                    <label className="text-left block mb-2 text-sm text-gray-600 dark:text-gray-200">
                                        Phone number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="XXX-XX-XXXX-XXX"
                                        id='phone'
                                        {...register("user_phone", { required: "Phone is required", pattern: { value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, message: "Phone is not valid" } })}
                                        className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                    />
                                    <div className="text-red-500 px-2 text-sm" >{errors.phone?.message}</div>

                                </div>
                                <div>
                                    <label className="text-left block mb-2 text-sm text-gray-600 dark:text-gray-200">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="johnsnow@example.com"
                                        id="email"
                                        {...register("email", { required: "Email is required", pattern: { value: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/, message: "Email is not valid" } })}
                                        className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                                    />
                                    <div className="text-red-500 px-2 text-sm" >{errors.email?.message}</div>

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

                                <div>
                                    <div className="text-red-500 px-2 text-sm mb-2" >{regisFail && failMessage}</div>
                                    <button className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50" onClick={onSubmit}>


                                        <span>Sign Up </span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5 rtl:-scale-x-100"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
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