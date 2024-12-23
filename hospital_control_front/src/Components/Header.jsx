import React from "react";
import { useState } from "react";
import { useAuth } from "../Context/AuthProvider";
import SignIn from "./BeforeLogin";
import AccountDropdown from "./UserDropDown"
 export default function Header (){
    const [open, setOpen] = useState(false);
    const {user } = useAuth();
  return (
    <>
    <header className={`p-5 absolute flex justify-center items-center left-0 top-0 z-20 flex w-full items-center shadow-lg sticky bg-white max-h-24`}>
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between pr-14">
          <div className="w-60 max-w-full px-4">
            <a href="/#" className="block w-full py-5">
              <img
                src="../public/bebook.svg"
                alt="logo"
                className="w-24 dark:hidden"
              />
              <img
                src="https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo-white.svg"
                alt="logo"
                className="w-full hidden dark:block"
              />
            </a>
          </div>
          <div className="flex w-full items-center justify-between px-4">
            <div>
              <button
                onClick={() => setOpen(!open)}
                id="navbarToggler"
                className={` ${
                  open && "navbarTogglerActive"
                } absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden`}
              >
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color dark:bg-white"></span>
              </button>
              <nav
                id="navbarCollapse"
                className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none lg:dark:bg-transparent ${
                  !open && "hidden"
                } `}
              >
                <ul className="block lg:flex">
                  <ListItem NavLink="/#">Trang chủ</ListItem>
                  <ListItem NavLink="/#">Thanh toán</ListItem>
                  <ListItem NavLink="/#">Về chúng tôi</ListItem>
                  <ListItem NavLink="/#">Blog</ListItem>
                </ul>
              </nav>
            </div>
           {/* Start */}
           {user != null ? <AccountDropdown/> : <SignIn/> }
          </div>
        </div>
      </div>
    </header>
    </>
  );
 }
 const ListItem = ({ children, NavLink }) => {
    return (
      <>
        <li>
          <a
            href={NavLink}
            className="flex py-2 text-base text-gray-800 font-bold hover:text-blue-600 dark:text-white lg:ml-10 lg:inline-flex"
          >
            {children}
          </a>
        </li>
      </>
    );
  };