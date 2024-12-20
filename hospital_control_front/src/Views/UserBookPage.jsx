import React from "react";
import Header from "../Components/Header";
import SearchHotel from "../Components/SearchHotel";
import BookingCard from "../Components/BestDealHotel";
import TopRatingHotel from "../Components/Hotel/TopRatingHotel";
const UserBookPage = () => {
    return(
        <>
        <Header/>
        <SearchHotel/>
        <BookingCard/>
        <TopRatingHotel/>
        </>
    )

}
export default UserBookPage