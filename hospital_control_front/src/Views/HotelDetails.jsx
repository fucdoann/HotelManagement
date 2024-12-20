import React from "react";
import Header from "../Components/Header";
import Overview from "../Components/Hotel/OverviewHotel";
import ImageSlider from "../Components/Hotel/DetailImage";
import RoomsTable from "../Components/Hotel/RoomsTable";
import HotelRules from "../Components/Hotel/HotelRules";
import CommentHotel from "../Components/Hotel/CommentHotel";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { axios } from "../api/axios";
import Loader from "../common/Loader";

const HotelDetail = () => {
    const [openDetail, setOpenDetail] = useState(false)
    const [hotel, setHotel] = useState({})
    const [rooms, setRooms] = useState([])
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true); // Track loading state
    const [currentIndex, setCurrentIndex] = useState(0);
    const hotel_id = searchParams.get('id');

    useEffect(() => {
        const fetchHotel = () => {
            axios
                .post('/detailHotel', { hotel_id })
                .then(async (res) => {
                    const hotelData = res.data.hotel
                    try {
                        const conveniencesResponse = await axios
                            .post("/getConve", { 'arrayConve': hotelData.convenients, 'type': 'hotel' }) // Send convenience IDs
                            ;
                        const conveniences = conveniencesResponse.data.data;
                        return {
                            ...hotelData,
                            conveniences, // Add conveniences to room data
                        };
                    } catch (error) {
                        console.error(`Error fetching conveniences for hotel ${hotelData.hotel_id}:`, error);
                        return hotelData;
                    }
                })
                .then(hotelWithConve => {
                    console.log(hotelWithConve);
                    setHotel(hotelWithConve);
                })
                .catch((error) => {
                    console.error("Error fetching hotel details:", error);
                })
                .finally(() => {
                    setLoading(false); // Stop loading
                });
        };
        const fetchRooms = () => {
            axios
                .post('/getListRoom', { hotel_id })
                .then((res) => {
                    setRooms(res.data.rooms);
                })
                .catch((error) => {
                    console.error("Error fetching list rooms:", error);
                })
                .finally(() => {
                    setLoading(false); // Stop loading
                });
        };
        fetchHotel();
        fetchRooms();

    }, [searchParams]);
    // Handle loading state
    if (loading) {
        return <Loader />; // Optional loader
    }
    return (
        <>
            <Header />
            {/* <SearchHotel /> */}
            <Overview hotel={hotel} setOpenDetail={setOpenDetail} setCurrentIndex={setCurrentIndex} />
            <RoomsTable rooms={rooms} hotel_id={hotel_id} />
            {openDetail && <ImageSlider hotel={hotel} setOpenDetail={setOpenDetail} setCurrentIndex={setCurrentIndex} currentIndex={currentIndex} />}
            <HotelRules />
            <CommentHotel />
        </>
    )

}
export default HotelDetail