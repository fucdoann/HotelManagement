import React from 'react'
import ConversationItem from './ConversationItem';
import { useState, useEffect } from 'react';
import { axios } from '../../api/axios'
import { useAuth } from '../../Context/AuthProvider'
const Conversation = ({ListCustomer, active, setActive, setNamePartner, setChatPartnerId}) => {

    return (
        <div className="p-1">
            {
                ListCustomer.length >0 && ListCustomer.map((item, index) => (
                    <div onClick={() => {setActive(index); setNamePartner(item.user_name);setChatPartnerId(item.user_id)}}>
                        <ConversationItem
                        message={item.last_message}
                        time={item.last_message_time}
                        name={item.user_name}
                        active={ index == active ? true : false }
                    />
                    </div>
                ))
            }
        </div>
    )
}

export default Conversation