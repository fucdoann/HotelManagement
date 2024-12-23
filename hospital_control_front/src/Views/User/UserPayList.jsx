import React from "react";
import UsetrSidebar from "../../Components/User/UserSidebar";
import UserListPay from "../../Components/User/ListPay";
export default function ListPay() {
    return (
        <>

            <div className="flex flex-row">
            <UsetrSidebar active={'listpay'}/>
            <UserListPay/>
            </div>

        

        </>
    )
}