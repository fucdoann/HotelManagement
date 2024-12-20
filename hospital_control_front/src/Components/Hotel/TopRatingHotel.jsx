import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axios } from "../../api/axios";
const SvgIcon = ({ svgString }) => {
  return (
    <div className="flex max-h-[20px]"
      dangerouslySetInnerHTML={{
        __html: svgString,
      }}
    />
  );
};
const classifyRating = (rating) => {
  if (rating >= 0 && rating <= 5) {
    return "Bad";
  } else if (rating > 5 && rating <= 7) {
    return "Normal";
  } 
  else if (rating > 7 && rating <= 9) {
    return "Good";
  }else {
    return "Excellent ";
  }
};
export default function TopRatingHotel() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_IMAGE_URL;
  const [topHotel, setTopHotel] = useState([]);
  const fetchTopHotel = () => {
    axios.post('/getTopHotels')
      .then((res) => {
        const hotelData = res.data.hotel;
        return Promise.all(
          hotelData.map(async (hotel) => {
            try {
              const conveniencesResponse = await axios
                .post("/getConve", { 'arrayConve': hotel.convenients, 'type': 'hotel' }) // Send convenience IDs
                ;
              const conveniences = conveniencesResponse.data.data;
              return {
                ...hotel,
                conveniences, // Add conveniences to room data
              };
            } catch (error) {
              console.error(`Error fetching conveniences for hotel ${hotel.hotel_id}:`, error);
              return hotel;
            }
          })
        );
      })
      .then(hotelWithConve => {
        setTopHotel(hotelWithConve);
      })
      .catch(error => {
        console.error(error)
      })
  }
  useEffect(() => {
    fetchTopHotel();
  }, [])
  return (
    <div className="mt-8 px-4 py-8 flex justify-center items-center flex-col">
      <h2 className="text-2xl font-semibold mb-4">Các khách sạn được đánh giá tốt trên trang chúng tôi</h2>
      <div className="flex gap-4 w-8/12">
      {topHotel.map((item) => (
        <div key={item.hotel_id} className="w-4/12 bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={`${item.images.length  ?  baseUrl + item.images[0] :'https://as2.ftcdn.net/v2/jpg/07/91/22/59/1000_F_791225927_caRPPH99D6D1iFonkCRmCGzkJPf36QDw.jpg'}`}
            alt="Hotel"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p className="text-gray-500">{item.star_rating} Rating - {classifyRating(item.star_rating)} · {item.provinceName}</p>
            <div className="flex gap-2 mt-2 text-sm text-gray-500">
              {item.conveniences.map(item => (
                <span key={item.id} className="flex flex-row"><SvgIcon svgString={item.convenient_icon_svg} /> {item.convenient_name}</span>
              ))}

            </div>
            <button onClick={() => {navigate(`/hotel/detail?id=${item.hotel_id}`)}} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
              Check prices
            </button>
          </div>
        </div>
    

      ))}
      </div>
    </div>

  )
}