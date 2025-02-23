import { Star } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Keyboard, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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
                                    <h3 className="font-medium text-lg">
                                        {data.name}
                                    </h3>
                                </div>
                            </div>

                            {/* Star rating */}
                            <div className="flex gap-1 items-center">
                                {[...Array(5)].map((_, index) => (
                                    <Star
                                        key={index}
                                        fill="yellow"
                                        className="text-amber-400 size-5"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ReviewSliderSinglePage({ reivews }: { reivews: any }) {
    return (
        <Swiper
            cssMode={true}
            mousewheel={true}
            keyboard={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 40 },
            }}
            modules={[Autoplay, Mousewheel, Keyboard]}
            className="mySwiper"
            style={{
                height: "500px !important",
            }}
        >
            {/* Map over the reviews for the given home */}
            {reivews.reviews.map((item: any, index: number) => (
                <SwiperSlide key={index}>
                    <ReviewCard data={item} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
