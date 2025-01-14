import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {useAuth} from '../Context/AuthProvider'

function Login() {
  const [loginFail, setLoginFail] = useState(false);
  const { login } = useAuth();
  const {
    register,
    formState: {errors},
    handleSubmit,
  } = useForm()
  const onSubmit = handleSubmit((data) => {
    console.log(data)
    try{
      login(data).then(
        res => {
            if(res.data.status_code == 201){
              setLoginFail(false)
              localStorage.setItem('token', res.data.access_token);
              window.location.href = '/'
            }
            else{
              setLoginFail(true)
            }
        }
    )
    } catch(e){
      setLoginFail(true)
      console.log(e)
    }
}) 


  return (
    <>
      <div className="bg-white dark:bg-gray-900">
        <div className="flex justify-center h-screen">
          <div
            className="hidden bg-cover lg:block lg:w-2/3"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)"
            }}
          >
            <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
              <div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  BeBook
                </h2>
                <p className="max-w-xl mt-3 text-gray-300">
                  Login your account and start booking
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
            <div className="flex-1">
              <div className="text-center">
                <div className="flex justify-center mx-auto">
                  <img
                    className="w-12 h-7 sm:h-8"
                    src="../public/bebook.svg"
                    alt=""
                  />
                </div>
                <p className="mt-3 text-gray-500 dark:text-gray-300">
                  Sign in to access your account
                </p>
              </div>
              <div className="mt-8">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-200 text-left"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="example@example.com"
                      {...register("email", { required: "Email is required", pattern: { value: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/, message: "Email is not valid" } })}
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                    <div className="text-red-500 px-2 text-sm" >{errors.email?.message}</div>

                  </div>
                  <div className="mt-6">
                    <div className="flex justify-between mb-2">
                      <label
                        htmlFor="password"
                        className="text-sm text-gray-600 dark:text-gray-200"
                      >
                        Password
                      </label>
                      <a
                        href="#"
                        className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      // onChange={setAccount()}
                      placeholder="Your Password"
                      {...register("password",{required:"Password is required"})}

                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                    <div className="text-red-500 px-2 text-sm" >{errors.password?.message}</div>

                  </div>
                  <div className="mt-6">
                  <div className="text-red-500 px-2 text-center mb-1" >{loginFail && <p>Email or password not true</p>}</div>
                    <button onClick={onSubmit} type="submit" className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                      Sign in
                    </button>
                  </div>
                </form>
                <p className="mt-6 text-sm text-center text-gray-400">
                  Don't have an account yet?{" "}
                  <a
                    href="/register"
                    className="text-blue-500 focus:outline-none focus:underline hover:underline"
                  >
                    Sign up
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login