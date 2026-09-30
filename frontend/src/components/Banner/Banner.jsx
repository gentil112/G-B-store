import React from "react";
import BannerImg from "../../assets/TopProducts/tshirt1.jpg";
import { GrSecure } from "react-icons/gr";
import { IoFastFood } from "react-icons/io5";
import { GiFoodTruck } from "react-icons/gi";
const Banner = () => {
  return (
    <div className="relative min-h-[550px] overflow-hidden bg-[linear-gradient(to_right,rgba(251,190,60,0.65)_1px,transparent_1px),linear-gradient(to_bottom,rgba(150,190,60,0.55)_1px,transparent_1px)] bg-[size:60px_60px] py-12 sm:py-8">
      <div className="container relative z-10 flex min-h-[450px] items-end">
        <div
          className="grid
        grid-cols-1 sm:grid-cols-2
        gap-6 items-center"
        >
          {/* image section */}
          <div data-aos="zoom-in">
            <img
              src={BannerImg}
              alt=""
              className="max-w-[400px] h-[350px] w-full rounded-2xl
             mx-auto drop-shadow-[-10px_10px_12px_rgba(0,0,0,1)] 
             object-cover"
            />
          </div>
          {/* text details section  */}
          <div
            className="flex flex-col justify-center
          gap-6 sm:pt-0"
          >
            <h1 data-aos="fade-up" className="text-3xl sm:text-4xl font-bold">
              Discount sale up to 50% off
            </h1>
            <p
              data-aos="fade-up"
              className=" text-sm text-gray-500 
            tracking-wide leading-5"
            >
              {" "}
              lorenm ahabuaba auiabuagba yiagaguaug
            </p>
            <div className="flex flex-col gap-4">
              <div data-aos="fade-up" className="flex items-center  gap-4">
                <GrSecure
                  className="text-4xl h-12 w-12
                shadow-sm p-4 rounded-full bg-violet-100
                dark:bg-orange-400"
                />
                <p> Quality products</p>
              </div>
              <div
                data-aos="fade-up"
                className="flex
              items-center gap-4"
              >
                <IoFastFood
                  className="text-4xl h-12
                w-12 shadow-sm p-4 rounded-full
                bg-orange-100 dark:bg-orange-400"
                />
                <p>Fast Delivery</p>
              </div>
              <div
                data-aos="fade-up"
                className="flex
              items-center gap-4"
              >
                <GiFoodTruck
                  className="text-4xl h-12 w-12
                shadow-sm p-4 rounded-full bg-green-100
                dark:bg-green-400"
                />
                <p>Easy Payment method</p>
              </div>
              <div
                data-aos="fade-up"
                className="flex
              items-center gap-4"
              >
                <GiFoodTruck
                  className="text-4xl h-12 w-12
                shadow-sm p-4 rounded-full bg-yellow-100
                dark:bg-yellow-400"
                />
                <p>Get Offers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
