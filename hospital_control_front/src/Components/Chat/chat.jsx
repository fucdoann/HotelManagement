import React from 'react'
import Conversation from './Conversation';
import Messages from './Messages';
import { useState, useEffect } from 'react';
import { axios } from '../../api/axios'
import { useAuth } from '../../Context/AuthProvider'
import Pusher from 'pusher-js';

const Chat = () => {
    const { user } = useAuth();
    const [ListCustomer, SetListCustomer] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatPartnerId, setChatPartnerId] = useState(null);
    const [namePartner, setNamePartner] = useState('');
    const [active, setActive] = useState(0);
    const fetchUser = () => {
        axios.post('/getListChatId')
            .then(res => {
                SetListCustomer(res.data.data);
            })
            .catch(error => {
                console.error(error);
            });
    };
    useEffect(() => {
        fetchUser();
    }, [])
    useEffect(() => {
        if (!chatPartnerId) return;

        const fetchMessages = async () => {
            try {
                const response = await axios.post(
                    `/messages`,{user_id : chatPartnerId}
                );
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
        const sortedIds = [user.id, chatPartnerId].sort();
        const channelName = `chat.${sortedIds[0]}.${sortedIds[1]}`;
        const pusher = new Pusher('46ad969e35fb64ef4e0c', {
            cluster: 'ap1',
            // authEndpoint: 'http://localhost:8000/broadcasting/auth',
        });

        const channel = pusher.subscribe(channelName);
        channel.bind('message.sent', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            pusher.unsubscribe(channelName);
        };
    }, [user.id, chatPartnerId]);
    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;
        try {
            await axios.post(
                '/sendmessage',
                { message: newMessage, receiver_id: chatPartnerId }
            );
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    return (
        <div className="">
            <div className="flex bg-white dark:bg-gray-900">
                <div className="w-80 h-screen dark:bg-gray-800 bg-gray-100 p-2 hidden md:block">
                    <div className="h-full overflow-y-auto">
                        <div className="text-xl font-extrabold text-gray-600 dark:text-gray-200 p-3">Chikaa</div>
                        <div className="search-chat flex p-3">
                            <input className="input text-gray-700 dark:text-gray-200 text-sm p-3 focus:outline-none bg-gray-200 dark:bg-gray-700  w-full rounded-l-md" type="text" placeholder="Search Messages" />
                            <div className="bg-gray-200 dark:bg-gray-700 flex justify-center items-center pr-3 text-gray-400 rounded-r-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-lg font-semibol text-gray-600 dark:text-gray-200 p-3">Recent</div>
                        <Conversation setNamePartner={setNamePartner} ListCustomer={ListCustomer} active={active} setActive={setActive} setChatPartnerId={setChatPartnerId} />
                    </div>
                </div>
                <div className="flex-grow  h-screen p-2 rounded-md">
                    <Messages userId={user.id} newMessage={newMessage} handleSendMessage={handleSendMessage} setNewMessage={setNewMessage} namePartner={namePartner} messages={messages} />
                </div>
            </div>
        </div>
    )
}

export default Chat