import React from 'react';
import { useNavigate } from 'react-router-dom';

const HotPlaces = () => {
  const navigate = useNavigate();
  const places = [
    { 
      id: 1, 
      name: 'Hạ Long Bay', 
      description: 'Di sản thế giới UNESCO nổi tiếng với những hòn đảo đá vôi và nước biển trong xanh.', 
      image: '../public/halong.jpg',
      url: '/hotel/searchresult?ss=Thành phố Hạ Long&province=22&district=193&commune=0&checkin=4890693300541&checkout=4890779700541&children=0&adults=0&rooms=0', 
    },
    { 
      id: 2, 
      name: 'Sapa', 
      description: 'Nổi tiếng với những cánh đồng bậc thang và khung cảnh núi non hùng vĩ.', 
      image: '../public/sapa.jpg',
      url: '/hotel/searchresult?ss=Thị xã Sa Pa&province=10&district=088&commune=0&checkin=4890693300541&checkout=4890779700541&children=0&adults=0&rooms=0', 

    },
    { 
      id: 3, 
      name: 'Phong Nha-Kẻ Bàng', 
      description: 'Nổi tiếng với các hang động, đặc biệt là hang Sơn Đoòng, hang động lớn nhất thế giới.', 
      image: '../public/phongnha.jpg',
      url: '/hotel/searchresult?ss=Thị trấn Phong Nha&province=44&district=455&commune=19165&checkin=4890693300541&checkout=4890779700541&children=0&adults=0&rooms=0', 

    },
    { 
      id: 4, 
      name: 'Hội An', 
      description: 'Thành phố cổ nổi tiếng với những công trình kiến trúc lịch sử và phố cổ tuyệt đẹp.', 
      image: '../public/hoian.webp',
      url: '/hotel/searchresult?ss=Thành phố Hội An&province=49&district=503&commune=0&checkin=4890693300541&checkout=4890779700541&children=0&adults=0&rooms=0', 
    },
    { 
      id: 5, 
      name: 'Nha Trang', 
      description: 'Thành phố ven biển nổi tiếng với các bãi biển đẹp và cuộc sống về đêm sôi động.', 
      image: '../public/nhatrang.jpg',
      url: '/hotel/searchresult?ss=Thành phố Nha Trang&province=56&district=568&commune=0&checkin=4890693300541&checkout=4890779700541&children=0&adults=0&rooms=0', 

    },
    { 
      id: 6, 
      name: 'Huế', 
      description: 'Cố đô Huế với các di tích lịch sử và những công trình kiến trúc cổ kính.', 
      image: '../public/hue.jpg',
      url: '/hotel/searchresult?ss=Thành phố Huế&province=46&district=474&commune=0&checkin=4890693300541&checkout=4890779700541&children=0&adults=0&rooms=0', 
    },
  ];
  
  return (
    <div className="mt-8 px-4 py-8 flex justify-center items-center flex-col">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Các địa điểm nổi bật tại Việt Nam</h2>
      <div className="flex gap-2 flex-wrap justify-between w-full max-w-screen-xl">
        {places.map((place) => (
          <div key={place.id} className="w-full sm:w-[32%] md:w-[32%] lg:w-[32%] xl:w-[32%] bg-white rounded-lg shadow-xl overflow-hidden hover:scale-105 transform transition-all duration-300">
            <img
              src={place.image || 'https://via.placeholder.com/400x250'}
              alt={place.name}
              className="w-full h-56 object-cover rounded-t-lg"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">{place.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{place.description}</p>
              <button
                onClick={() => navigate(`${place.url}`)}
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold transition-all duration-200 hover:bg-blue-700"
              >
                Xem khách sạn
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotPlaces;
