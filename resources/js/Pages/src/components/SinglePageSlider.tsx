import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Keyboard, Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
export default function SinglePageSlider() {
  return (
    <Swiper
      cssMode={true}
      navigation={true}
      mousewheel={true}
      keyboard={true}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      slidesPerView={1}
      //   breakpoints={{
      //     640: { slidesPerView: 1, spaceBetween: 20 },
      //     768: { slidesPerView: 2, spaceBetween: 40 },
      //     1280: { slidesPerView: 3, spaceBetween: 50 },
      //   }}
      modules={[Navigation, Autoplay, Mousewheel, Keyboard]}
      className="mySwiper"
    >
      {[
        "https://picsum.photos/id/238/1000/600",
        "https://picsum.photos/id/239/1000/600",
        "https://picsum.photos/id/240/1000/600",
        "https://picsum.photos/id/241/1000/600",
        "https://picsum.photos/id/242/1000/600",
      ].map((src, index) => (
        <SwiperSlide>
          <img src={src} className="w-full" key={index} alt="" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
