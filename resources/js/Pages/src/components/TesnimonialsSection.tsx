import Slider from "./Slider";

export default function TesnimonialsSection() {
  return (
    <div className="bg-[#fcfcf3]">
      <div className="w-[92%] xl:max-w-screen-xl mx-auto px-4 py-16 space-y-10 md:space-y-5 md:py-24">
        <div className="">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-4xl font-bold text-black">
              Testimonial
            </h2>
            <p className="text-[#959593] text-lg">
              What out clients are saying about us
            </p>
          </div>
        </div>
        <Slider />
      </div>
    </div>
  );
}
