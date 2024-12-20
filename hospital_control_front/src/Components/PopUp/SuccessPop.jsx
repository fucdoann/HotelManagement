import { useEffect } from "react";
import React from "react";
export default function SuccessPop({mess, onClose}){
     useEffect(() => {
        const timer = setTimeout(() => {
          onClose(); // Call the onClose function to hide the toast after 1 second
        }, 1000);
    
        return () => clearTimeout(timer); // Cleanup the timer on unmount
      }, [onClose]);
    return(
        <section className="bg-gray-2 fixed z-50 top-4 right-4 transition-transform duration-500 ease-in-out transform translate-x-0">
      <div className="mx-auto px-4 sm:container">
        <div className="flex justify-end">
          <div className="relative flex w-full max-w-[460px] items-center rounded-lg border border-[#3758F9] bg-[#3758F90D] px-5 py-[18px]">
            <span className="mr-4 flex h-[30px] w-full max-w-[30px] items-center justify-center rounded-full bg-[#3758F9]">
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.15 3.34999C14.925 3.12499 14.575 3.12499 14.35 3.34999L5.85 11.6L1.65 7.47499C1.425 7.24999 1.075 7.27499 0.850003 7.47499C0.625003 7.69999 0.650003 8.04999 0.850003 8.27499L5.275 12.575C5.425 12.725 5.625 12.8 5.85 12.8C6.075 12.8 6.25 12.725 6.425 12.575L15.15 4.09999C15.375 3.92499 15.375 3.57499 15.15 3.34999Z"
                  fill="white"
                />
              </svg>
            </span>
            <p className="text-base font-semibold text-[#3758F9] sm:text-lg">
              {mess}
            </p>
           
          </div>
        </div>
      </div>
    </section>
    )
}