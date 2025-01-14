import React from "react";
import UsetrSidebar from "../../Components/User/UserSidebar";
import ChatComponent from "../../Components/User/ChatComponent";
export default function UserChat() {
    return (
        <>

            <div className="flex flex-row">
            <UsetrSidebar active={'userchat'}/>
            <ChatComponent/>
            </div>

        

        </>
    )
}