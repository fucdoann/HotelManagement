import React from "react";
import Header from "../Components/Header";
import SearchHotel from "../Components/SearchHotel";
import BookingCard from "../Components/BestDealHotel";
import TopRatingHotel from "../Components/Hotel/TopRatingHotel";
import HotPlaces from "../Components/BestPlace";
const UserBookPage = () => {
    return(
        <>
        <Header/>
        <SearchHotel/>
        <BookingCard/>
        <TopRatingHotel/>
        <HotPlaces/>
        </>
    )

}
export default UserBookPage