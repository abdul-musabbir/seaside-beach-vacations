import { Star } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Keyboard, Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ReviewData } from "../lib/reviewdata";

const ReviewCard = ({ data }: { data: any }) => {
    return (
        <div className="border rounded-3xl p-6 bg-white">
            <div>
                <div>
                    <div className="space-y-6">
                        <div className="text-start">
                            <p className="text-base font-normal text-gray-800 text-opacity-50 line-clamp-[7]">
                                {data.review}
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex gap-5 items-center">
                                <div className="text-start ">
                                    <h3 className="font-medium text-base">
                                        {data.name}
                                    </h3>
                                </div>
                            </div>

                            {/* star */}
                            <div className="flex gap-1 items-center">
                                <Star
                                    fill="yellow"
                                    className="text-amber-400 size-5"
                                />
                                <Star
                                    fill="yellow"
                                    className="text-amber-400 size-5"
                                />
                                <Star
                                    fill="yellow"
                                    className="text-amber-400 size-5"
                                />
                                <Star
                                    fill="yellow"
                                    className="text-amber-400 size-5"
                                />
                                <Star
                                    fill="yellow"
                                    className="text-amber-400 size-5"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Slider() {
    const allReviews = ReviewData.flatMap((home) => home.reviews);

    return (
        <Swiper
            cssMode={true}
            navigation={true}
            mousewheel={true}
            keyboard={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 40 },
                1280: { slidesPerView: 3, spaceBetween: 50 },
            }}
            modules={[Navigation, Autoplay, Mousewheel, Keyboard]}
            className="home-page-reviews"
        >
            {allReviews.map((item, index) => (
                <SwiperSlide key={index} className="reviews-slider">
                    <ReviewCard data={item} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
