import React from "react";
import { useState } from "react";
import { useAuth } from "../../Context/AuthProvider";
import {axios} from '../../api/axios'
import { useForm } from 'react-hook-form'
import SuccessPop from "../PopUp/SuccessPop";

export default function UserProfile() {
    const { user } = useAuth();
    const [name , setName] = useState(user.name || '');
    const [email , setEmail] = useState(user.email || '');
    const [phone , setPhone] = useState(user.user_phone || '');
    const [address , setAddress] = useState(user.address || '');
    const [update , setUpdate] = useState(false);
    const {
        register,
        formState: {errors},
        handleSubmit,
      } = useForm()
      const onSubmit = handleSubmit((data) => {
        axios.post('/changeuser', data)
        .then(res => {
            if(res.data.status ===200){
                setUpdate(true);
            }
        })
        .catch(err => console.log(err))
        console.log(data);
      })
    return (
        <>
            {update && <SuccessPop mess="Cập nhập hồ sơ thành công" onClose={() => setUpdate(false)}/>}
            <section className="bg-white dark:bg-gray-900 w-[80%]">
                <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Chỉnh sửa hồ sơ</h2>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Họ tên</label>
                                <input type="text" {...register("name", { required: "Name is required" })} name="name" onChange={(e) => setName(e.target.value)} id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={name} placeholder="Họ tên của bạn" required=""/>
                                <div className="text-red-500 px-2 text-sm" >{errors.name?.message}</div>
                            </div>
                            <div className="w-full">
                                <label htmlFor="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input  readOnly type="email"  {...register("email")} name="email" onChange={(e) => setEmail(e.target.value)} id="brand" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={email} placeholder="Email của bạn" required=""/>
                            </div>
                            <div className="w-full">
                                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Người dùng</label>
                                <input type="text" name="price"  id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value="Người đặt phòng" disabled required=""/>
                            </div>
                            <div>
                                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Số điện thoại</label>
                                <input {...register("user_phone", { required: "Phone is required", pattern: { value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, message: "Phone is not valid" } })} type="phone" name="brand" onChange={(e) => setPhone(e.target.value)} id="brand" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={phone} placeholder="Số điện thoại của bạn" required=""/>
                                <div className="text-red-500 px-2 text-sm" >{errors.phone?.message}</div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Địa chỉ</label>
                                <textarea id="description" {...register("address")} rows="8" value={address} onChange={(e) => setAddress(e.target.value)} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Địa chỉ ở đây..."></textarea>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button type="submit" onClick={onSubmit} className="text-blue-600  inline-flex items-center hover:text-white border border-blue-600 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                                Cập nhập hồ sơ
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    )
}