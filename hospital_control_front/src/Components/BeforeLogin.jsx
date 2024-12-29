import React from "react";

export default function SignIn() {
    return(
        <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
        <a
          href="/login"
          className="px-7 py-3 text-base font-medium text-dark hover:text-blue-600 dark:text-white"
        >
          Đăng nhập
        </a>

        <a
          href="/register"
          className="py-3 text-base font-medium rounded-md bg-primary px-7 text-white hover:bg-blue-800 bg-blue-600 "
        >
          Đăng ký
        </a>
      </div>
    )
}