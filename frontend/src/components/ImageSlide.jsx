// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination } from "swiper/modules"; // Import Pagination module

// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/pagination";

// export default function ImageSlide(props) {
//     const { imgs } = props
//     console.log("imgs receive", imgs.length)
//     return (
//         <div>
//             <Swiper
//                 modules={[Pagination]} // Install the Pagination module
//                 pagination={true}
//                 spaceBetween={10}
//                 slidesPerView={1}
//                 style={{

//                     "--swiper-pagination-bullet-inactive-color": "#cbd5e1",
//                     "--swiper-pagination-bullet-inactive-opacity": "1",
//                     "--swiper-pagination-bullet-size": "10px",
//                     "--swiper-pagination-bullet-horizontal-gap": "6px",

//                 }}
//             >
//                 {

//                     imgs.map((item, index) => {
//                         { console.log("item", item) }
//                         return (
//                             <SwiperSlide key={index} className="w-[420px] h-[460px]">
//                                 <img
//                                     src={item}
//                                     alt="Slide 2"
//                                     style={{ width: "400px", height: "700px" }}
//                                 />
//                             </SwiperSlide>
//                         )
//                     })

//                 }


//             </Swiper>
//         </div>
//     );
// }
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules"; // Import Pagination module

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

export default function ImageSlide(props) {
    const { imgs } = props;


    return (
        <div>
            <Swiper
                modules={[Pagination]} // Install the Pagination module
                pagination={true}
                spaceBetween={10}
                slidesPerView={1}
                style={{
                    "--swiper-pagination-bullet-inactive-color": "#cbd5e1",
                    "--swiper-pagination-bullet-inactive-opacity": "1",
                    "--swiper-pagination-bullet-size": "10px",
                    "--swiper-pagination-bullet-horizontal-gap": "6px",
                }}
            >
                {imgs.map((item, index) => (
                    <SwiperSlide key={index} className="w-full h-full flex items-center justify-center">
                        <img
                            src={item}
                            alt={`Slide ${index + 1}`}
                            style={{
                                width: "500px", // Để hình ảnh không vượt quá container
                                height: "500px", // Để hình ảnh không vượt quá chiều cao
                                borderRadius: "10px", // Bo góc
                                objectFit: "cover"
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
