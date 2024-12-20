import React, { useEffect } from "react";

export default function WarningToast({ mess, main_mess, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Call the onClose function to hide the toast after 1 second
    }, 1000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [onClose]);

  return (
    <section
      className="fixed z-50 top-4 right-4 transition-transform duration-500 ease-in-out transform translate-x-0"
    >
      <div className="flex w-full max-w-[490px] items-center rounded-lg border border-[#F5C5BB] bg-[#FCEDEA] p-4">
        <div className="mr-5 flex h-[45px] w-full max-w-[45px] items-center justify-center rounded bg-[#EA4E2C] text-white sm:h-[60px] sm:max-w-[60px]">
          <svg viewBox="0 0 32 32" className="h-7 w-7 sm:h-8 sm:w-8">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.2002 3.33487C14.7493 3.0257 15.3689 2.86328 15.9991 2.86328C16.6292 2.86328 17.2488 3.0257 17.7979 3.33487C18.347 3.64403 18.8072 4.08951 19.1341 4.62831L19.1369 4.63306L30.4303 23.4864L30.4384 23.5002C30.7585 24.0547 30.9279 24.6833 30.9297 25.3235C30.9315 25.9637 30.7656 26.5933 30.4486 27.1495C30.1315 27.7057 29.6744 28.1693 29.1226 28.4939C28.5708 28.8186 27.9436 28.9932 27.3034 29.0002L27.2924 29.0003L4.69473 29.0003C4.05452 28.9932 3.42732 28.8186 2.87553 28.4939C2.32372 28.1693 1.86656 27.7057 1.54951 27.1495C1.23246 26.5933 1.06658 25.9637 1.06837 25.3235C1.07017 24.6833 1.23957 24.0547 1.55973 23.5002L1.56785 23.4864L12.8612 4.63307L13.7191 5.14694L12.8641 4.62831C13.1909 4.08951 13.6511 3.64403 14.2002 3.33487ZM14.5753 5.66344C14.5749 5.66415 14.5745 5.66486 14.5741 5.66557L3.28818 24.5065C3.14494 24.757 3.06917 25.0404 3.06837 25.3291C3.06755 25.6201 3.14295 25.9063 3.28706 26.1591C3.43118 26.4119 3.63898 26.6226 3.8898 26.7702C4.13921 26.917 4.42251 26.9962 4.71181 27.0003H27.2863C27.5756 26.9962 27.8589 26.917 28.1083 26.7702C28.3591 26.6226 28.5669 26.4119 28.711 26.1591C28.8552 25.9063 28.9306 25.6201 28.9297 25.3291C28.9289 25.0404 28.8532 24.757 28.7099 24.5065L17.4241 5.66557C17.4236 5.66486 17.4232 5.66415 17.4228 5.66344C17.2743 5.41949 17.0656 5.21776 16.8167 5.07764C16.5671 4.93711 16.2855 4.86328 15.9991 4.86328C15.7126 4.86328 15.431 4.93711 15.1814 5.07764C14.9325 5.21776 14.7238 5.41949 14.5753 5.66344Z"
              fill="white"
            />
          </svg>
        </div>
        <div className="flex w-full items-center justify-between">
          <div>
            <h6 className="text-base font-semibold text-black sm:text-lg">
              {mess}
            </h6>
            <p className="text-sm font-medium text-body-color">{main_mess}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
