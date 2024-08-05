import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import StarIcon from "@mui/icons-material/Star";

export default function Review() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
  };
  // const reviw = [
  //   {
  //     img: "../assests/prfil4.jfif",
  //     review:
  //       "Hi The Vu Care   team ws very good in work wise, hard working  made my home look neat n tidy   staff behaviour ws good and all the services  completed they were in time reached my place Bangarpet   I Recommend the vucare for the Vu Care thank u for the service",
  //   },
  //   {
  //     img: "../assests/prfil2.jfif",
  //     review:
  //       "Hi The Vu Care   team ws very good in work wise, hard working  made my home look neat n tidy   staff behaviour ws good and all the services  completed they were in time reached my place Bangarpet   I Recommend the vucare for the Vu Care thank u for the service",
  //   },
  //   {
  //     img: "../assests/prfil1.jfif",
  //     review:
  //       "Hi The Vu Care   team ws very good in work wise, hard working  made my home look neat n tidy   staff behaviour ws good and all the services  completed they were in time reached my place Bangarpet   I Recommend the vucare for the Vu Care thank u for the service",
  //   },
  //   {
  //     img: "../assests/prfil4.jfif",
  //     review:
  //       "Hi The Vu Care   team ws very good in work wise, hard working  made my home look neat n tidy   staff behaviour ws good and all the services  completed they were in time reached my place Bangarpet   I Recommend the vucare for the Vu Care thank u for the service",
  //   },
  // ];

  return (
    <div className=" mt-5">
      <h2 className="text-center boldt">Review</h2>

      <div className="row mt-3 slick-listsd1 ">
        <iframe
          className="col-md-4 review"
          height="215"
          src="https://www.youtube.com/embed/kq-GOB11iJ8?si=DS0cHMmcFS-Fpvnb"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
        <iframe
          className="col-md-4 review"
          height="215"
          src="https://www.youtube.com/embed/5EZ5tcKTlFE?si=TkrylcfLaWZ_znP1"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
        <iframe
          className="col-md-4 review"
          height="215"
          src="https://www.youtube.com/embed/XT9wQ3fTioY?si=uVs0Hr3oHPejJmG5"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  );
}
