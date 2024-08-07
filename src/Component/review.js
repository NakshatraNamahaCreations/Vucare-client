import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import StarIcon from "@mui/icons-material/Star";

export default function Review() {

  return (
    <div className=" mt-5">
      <h2 className="text-center boldt">Review</h2>

      <div className="row mt-3 m-auto slick-listsd1 ">
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
