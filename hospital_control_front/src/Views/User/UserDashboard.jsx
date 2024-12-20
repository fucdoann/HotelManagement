import React from "react";
import UsetrSidebar from "../../Components/User/UserSidebar";
import UserProfile from "../../Components/User/Profile";
export default function UserDasboard() {
    return (
        <>

            <div className="flex flex-row">
            <UsetrSidebar active={'profile'}/>
            <UserProfile/>
            </div>

        

        </>
    )
}