import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import DashBoard from './Views/DashBoard'
import Login from './Views/Login'
import Register from './Views/Register'
import UserBookPage from './Views/UserBookPage'
import SearchResult from './Views/SearchResult'
import HotelDetail from './Views/HotelDetails'
import BookingPage from './Views/BookingPage'
import PaymentResult from './Views/PaymentResult'
import Error from './Views/404'
import UserDasboard from './Views/User/UserDashboard'
import ProtectedRoute from './ProtectedRoute'
import ListBook from './Views/User/UserBookList'
import ListPay from './Views/User/UserPayList'
import UserChat from './Views/User/UserChat'
// import {AdminLayout} from './Views/AdminDashboard'
import { Home, Profile, Tables, Bookings, FormElements, Payments, EditHotel, ChatAdmin } from "./Views/AdminDashboard";
import { useAuth } from './Context/AuthProvider'
import { AdminDashboard } from './layouts/dashboard'
function App() {
    const { user } = useAuth();
    // console.log(user.role)
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<DashBoard />}> </Route>
                <Route
                    path="/login"
                    element={user ? <Navigate to="/" /> : <Login />}
                />
                <Route path='/register' element={<Register />}></Route>
                <Route path='/error' element={<Error />}></Route>
                {/* Catch-all route for undefined paths */}
                <Route path="*" element={<Error />} />
                {/* Admin router */}
                <Route exact path='/admin' element={<ProtectedRoute roles={['admin']}></ProtectedRoute>}>
                    <Route exact path='/admin' element={<AdminDashboard />}>
                        <Route path="home" element={<Home></Home>}></Route>
                        <Route path="profile" element={<Profile></Profile>}></Route>
                        <Route path="hotels" element={<Tables></Tables>}></Route>
                        <Route path="bookings" element={<Bookings></Bookings>}></Route>
                        <Route path="payments" element={<Payments></Payments>}></Route>
                        <Route path="edithotel" element={<EditHotel />} />
                        <Route path="addhotel" element={<FormElements />} />
                        <Route path="adminchat" element={<ChatAdmin />} />

                    </Route>
                </Route>
                {/* Hotel router */}
                <Route exact path='/hotel' element={<ProtectedRoute roles={['user','admin']}></ProtectedRoute>}>
                    {/* Use a relative path for child routes */}
                    <Route index element={<UserBookPage />} /> {/* Default child route */}
                    <Route path="searchresult" element={<SearchResult />} />
                    <Route path="detail" element={<HotelDetail />} />
                    <Route path="booking" element={<BookingPage />} />
                    <Route path="payment" element={<PaymentResult />} />


                </Route>
                <Route exact path='/user' element={<ProtectedRoute roles={['user','admin']}></ProtectedRoute>}>
                    {/* Use a relative path for child routes */}
                    <Route index element={<UserDasboard />} /> {/* Default child route */}
                    <Route path="listbook" element={<ListBook />} />
                    <Route path="listpay" element={<ListPay />} />
                    <Route path="chatuser" element={<UserChat />} />


                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App