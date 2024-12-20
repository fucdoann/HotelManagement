import React from "react";

const Overview = ({ hotel = { images: [] }, setOpenDetail, setCurrentIndex }) => {
  const baseUrl = import.meta.env.VITE_IMAGE_URL
  const SvgIcon = ({ svgString }) => {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: svgString,
            }}
        />
    );
};
  return (
    <div className="font-sans z-50 mt-10">
      {/* Header */}
      <header className="border-b bg-white shadow-md">
        <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <div className="flex gap-4">
            <a href="#overview" className="text-blue-600 font-semibold">Tổng quan</a>
            <a href="#rooms" className="text-gray-600 hover:text-blue-600">Thông tin & giá</a>
            <a href="#overview" className="text-gray-600 hover:text-blue-600">Tiện nghi</a>
            <a href="#rules" className="text-gray-600 hover:text-blue-600">Quy tắc chung</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Đánh giá của khách</a>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Đặt ngay</button>
        </nav>
      </header>

      {/* Main Content */}
      <a name="overview">
      <main className="max-w-7xl mx-auto mt-6">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row gap-6">
          {/* Image Carousel */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-4 gap-2">
              {/* Main image */}
              <div className="col-span-2 row-span-2">
                <img
                  onClick={() => { setCurrentIndex(0); setOpenDetail(true) }}
                  src={`${baseUrl}${hotel.images ? hotel.images[0] : ''}`}
                  key={0}
                  alt="Main"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Other images */}
              <div className="grid grid-cols-2 grid-rows-2 col-span-2 gap-2">
                {hotel.images && hotel.images.length > 1  &&
                  hotel.images.slice(1, 4).map((item, index) => (
                    <img
                      onClick={() => { setCurrentIndex(index); setOpenDetail(true) }}
                      src={`${baseUrl}${item ? item : ''}`}
                      key={index}
                      alt="Image 1"
                      className="w-full h-full object-cover rounded-lg"
                    />

                  ))
                }
              </div>
              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-2 col-span-4 mt-2">
                {hotel.images && hotel.images.length > 5 &&
                  hotel.images.slice(5, 8).map((item, index) => (
                    <img
                      onClick={() => { setCurrentIndex(index); setOpenDetail(true) }}
                      src={`${baseUrl}${item ? item : ''}`}
                      key={index}
                      alt="Image 1"
                      className="w-full h-full object-cover rounded-lg"
                    />

                  ))
                }
                {hotel.images && hotel.images.length > 9 &&
                  <div className="relative w-full h-full rounded-lg">
                    <img
                      src={`${baseUrl}${hotel.images ? hotel.images[9] : ''}`}
                      onClick={() => { setCurrentIndex(9); setOpenDetail(true) }}
                      key={index}
                      alt="Thumbnail 5"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-bold">
                      +{hotel.images.length - 9} ảnh
                    </div>
                  </div>


                }

              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/3 space-y-4">
            <h1 className="text-2xl font-bold">Dear House near Bãi Sau beach</h1>
            <p className="text-gray-500">139/18 Phan Chu Trinh, Vũng Tàu, Việt Nam</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-blue-600">8.5</span>
              <p className="text-gray-600">Rất tốt · 244 đánh giá</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <p className="font-bold">Điểm nổi bật của chỗ nghỉ</p>
              <ul className="text-gray-600 text-sm list-disc pl-4">
                <li>Hoàn hảo cho kỳ nghỉ 2 đêm!</li>
                <li>Vị trí rất được yêu thích</li>
              </ul>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded">Đặt ngay</button>
          </div>
        </section>

        {/* Description */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Mô tả</h2>
          <p className="text-gray-700">
            {hotel.description}
          </p>
        </section>

        {/* Amenities */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Các tiện nghi được ưa chuộng nhất</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {hotel.conveniences.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <SvgIcon svgString={item.convenient_icon_svg} />
                <p className="text-gray-700">{item.convenient_name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Map */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Vị trí</h2>
          <div className="google-map-code w-full">
            <iframe
              className="w-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15282225.79979123!2d73.7250245393691!3d20.750301298393563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1587818542745!5m2!1sen!2sin"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
            />
          </div>
        </section>
      </main>
      </a>
    </div>
  );
};

export default Overview;