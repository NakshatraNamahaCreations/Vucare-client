import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import "../Component/layout.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import axios from "axios";
import Review from "./review";
// import Modal from "@mui/material/Modal";
import { Modal } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import Header from "./Header";
import { ColorRing } from "react-loader-spinner";
import Footer from "./Footer";
// import { ReactApi } from "../api";
// import { ImagApi } from "../api";

import "react-multi-carousel/lib/styles.css";
import BookNow from "../BookNow";
export default function Layout() {
  const ReactApi = process.env.REACT_APP_API_URL;
  const ImagApi = process.env.REACT_APP_IMAGE_API_URL;
  const [Banner, setBanner] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [category, setCategory] = useState([]);
  const [selcategory, setselcategory] = useState("");
  const [filtersub, setfiltersub] = useState([]);
  const [subModel, setsubModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const storedUserDataJSON = sessionStorage.getItem("userdata");
  let userData = null;
  try {
    userData = JSON.parse(storedUserDataJSON);
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  useEffect(() => {
    GetAllWebBanner();
    getAllCategory();
  }, []);

  const GetAllWebBanner = async () => {
    try {
      setIsLoading(true);
      let res = await axios.get(`${ReactApi}/website/getallwebbanner`);

      if (res.status === 200) {
        setBanner(res.data.banner);
      }
    } catch (er) {
      // console.log(er, "err while fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const filtercatsub = (cat) => {
    setselcategory(cat);

    setsubModel(true);
  };

  useEffect(() => {
    getsubcategory();
  }, [selcategory]);

  const getsubcategory = async () => {
    try {
      setIsLoading(true);
      let res = await axios.get(`${ReactApi}/userapp/getappsubcat`);

      if ((res.status = 200)) {
        setCategoryData(res.data.subcategory);

        setfiltersub(
          res.data.subcategory?.filter((i) =>
            i.category?.toLowerCase()?.includes(selcategory?.toLowerCase())
          )
        );
      }
    } catch (err) {
      // console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllCategory = async () => {
    try {
      setIsLoading(true);
      let res = await axios.get(`${ReactApi}/getcategory`);
      if (res.status === 200) {
        const firstInFirstOut = res.data.category?.reverse();
        setCategory(firstInFirstOut);
      }
    } catch (er) {
      // console.log(er, "err while fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const cleaningItemsCount = categoryData?.filter((item) =>
    item?.category?.toLowerCase()?.includes("cleaning")
  )?.length;

  const actualCleaningSlidesToShow = Math?.min(cleaningItemsCount, 5);

  const pestControlItemsCount = categoryData?.filter((item) =>
    item?.category?.toLowerCase()?.includes("control")
  )?.length;

  const actualPestControlSlidesToShow = Math.min(pestControlItemsCount, 5);

  const paintingcontorl = categoryData?.filter((item) =>
    item?.category?.toLowerCase()?.includes("painting")
  )?.length;

  const painitnca = Math.min(paintingcontorl, 5);

  const commonSliderSettings = {
    className: "common-slider",
    dots: true,
    infinite: true,
    speed: 900,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    initialSlide: 1,

    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          adaptiveHeight: true,
          centerMode: true,
          dots: true,
          arrows: true,
          lazyLoad: "ondemand",
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          adaptiveHeight: true,
          centerMode: true,
          dots: true,
          arrows: true,
          lazyLoad: "ondemand",
          centerPadding: 5,
        },
      },
    ],
  };

  const pestControlSettings = {
    ...commonSliderSettings,
    slidesToShow: actualPestControlSlidesToShow,
  };

  const cleaningSettings = {
    ...commonSliderSettings,
    slidesToShow: actualCleaningSlidesToShow,
  };

  const actualPaintingSetting = {
    ...commonSliderSettings,
    slidesToShow: painitnca,
  };

  const justforyou = {
    className: "just-for-you-slider",
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          adaptiveHeight: true,
          centerMode: true,
          dots: true,
          arrows: true,
          lazyLoad: "ondemand",
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          adaptiveHeight: true,
          centerMode: true,
          dots: true,
          arrows: true,
          lazyLoad: "ondemand",
          centerPadding: "40px",
          mobileFirst: true,
        },
      },
    ],
  };

  const handleClose = () => {
    setsubModel(false);
  };
  const [openPOP, setopenPOP] = useState(false);
  const handleShowPop = () => {
    setopenPOP(true);
  };

  const handleClosePop = () => {
    setopenPOP(false);
  };

  const commercial = [
    { title: "Ware House", img: "../NewImg/cmrs (1).png" },
    { title: "College", img: "../NewImg/cmrs (2).png" },
    { title: "Mall", img: "../NewImg/cmrs (3).png" },
    { title: "Industries", img: "../NewImg/cmrs (4).png" },
    { title: "Cafe", img: "../NewImg/cmrs (5).png" },
    { title: "Corporate", img: "../NewImg/cmrs (6).png" },
    { title: "Hospital", img: "../NewImg/cmrs (7).png" },
    { title: "Office", img: "../NewImg/cmrs (8).png" },
    { title: "Bank", img: "../NewImg/cmrs (9).png" },
    { title: "Library", img: "../NewImg/cmrs (10).png" },

  ];

  const Clients = [
    "../images/logo1.jpg",
    "../images/logo2.jpg",
    "../images/logo3.png",
    "../images/logo4.png",
    "../images/logo5.jpg",
  ];

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      {isLoading ? (
        <div className="row m-auto text-center" style={{ height: "100vh" }}>
          <div className="col-md-4"></div>
          <div className="col-md-4 m-auto">
            {" "}
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              // wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          </div>
          <div className="col-md-4"></div>
        </div>
      ) : (
        <>
          <Header />

          <div className="row m-auto">
            <div className="row m-auto  clr2 shadow p-5 ">
              <div className="row   text-center m-auto  ">
                <div className="col-md-4 p-3 brclr medis1">
                  <p className="row p-2   fnt22 clr3 pheading">
                    Our Motive Is To Make You Comfort In Your Home{" "}
                  </p>
                  <div className="row  m-auto">
                    <a
                      href={`tel:${917760120037}`}
                      className="text-decoration-none"
                    >
                      <button className="col-md-6 imgbr boldt1   m-auto mb-3 p-2 btn yellw clr2 grndclr  ">
                        Contact Us
                      </button>
                    </a>
                  </div>
                </div>
                {category?.reverse()?.map((ele) => (
                  <div className="col-md-2 responvm">
                    <Link
                      className="row m-auto linksty text-center"
                      onClick={() => filtercatsub(ele.category)}
                    >
                      <img
                        className="col-md-4 mobilescreen-category-img p-0  m-auto  logostyl "
                        width={250}
                        height={250}
                        src={`${ImagApi}/category/${ele?.categoryImg}`}
                        alt=""
                      />{" "}
                      <div className="row m-auto text-center fnt14 textsi mt-2 clr3  boldt">
                        <span className=" m-auto">{ele?.category}</span>
                      </div>{" "}
                    </Link>{" "}
                  </div>
                ))}
              </div>
            </div>

            <div className="row text-center  mt-5 ">
              <h2 className=" m-auto boldt">Just For You</h2>
              <div className="row text-center m-auto mt-2 ">
                <button className="col-md-2  m-auto btnd btns_all clr3 clr2 yellw1 p-2 boldbtn">
                  Newly launched
                </button>{" "}
              </div>

              <div className="row mt-3  m-auto slick-listsd slick-listsd3 slick-sliders just-for-you-slider">
                <Slider {...justforyou} className="mobile-screen-margin">
                  {Banner?.map((item) => (
                    <div key={item._id} className="row m-auto m-1">
                      <img
                        className="col-md-11 m-1 imgbnr p-0"
                        style={{ borderRadius: "20px" }}
                        width={480}
                        height={180}
                        src={`${ImagApi}/webBanner/${item.banner}`}
                        alt=""
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>


            <div className="row    mt-5 ">
              <h2 className="text-center">Pest Control</h2>

              <div className="row slick-listsd mt-3 slick-listsd1 slick-sliders common-slider">
                <Slider {...pestControlSettings}>
                  {categoryData
                    ?.filter((item) =>
                      item.category?.toLowerCase()?.includes("control")
                    )
                    ?.map((ele) => (
                      <div key={ele._id} className="row m-auto  linksty">
                        <Link
                          className="linksty"
                          to="/servicedetails"
                          state={{ subcategory: ele?.subcategory }}
                          key={ele.subcategory}
                        >
                          <div className="img-wrapper m-auto m-1 shadow bg-white rounded">
                            <img
                              src={`${ImagApi}/subcat/${ele?.subcatimg}`}
                              className="img-aspect-ratio"
                              alt=""
                            />
                          </div>
                          <p className="col-md-11 m-1 text-center m-auto p-2 boldt">
                            {ele.subcategory}
                          </p>
                        </Link>
                      </div>
                    ))}
                </Slider>
              </div>
            </div>
            <div className="row m-auto p-4 mt-5">
              <img
                className="row p-0 border1 m-0"
                src="..\assests\web banner pest control.png"
                style={{ width: "100%" }}
              />
            </div>
            <div className="row    mt-5 ">
              <h2 className="text-center">Cleaning Services</h2>
              <div className="row text-center">
                <button className="col-md-3 m-auto btnd btns_all clr3 clr2 p-2 yellw1 boldbtn">
                  30% Less Than Market Price
                </button>{" "}
              </div>
              <div className="row slick-listsd mt-3 slick-listsd1 slick-sliders common-slider">
                <Slider {...cleaningSettings}>
                  {categoryData
                    ?.filter((item) =>
                      item.category?.toLowerCase()?.includes("cleaning")
                    )
                    ?.map((ele) => (
                      <div key={ele._id} className="row m-auto  linksty">
                        <Link
                          className="linksty"
                          to="/servicedetails"
                          state={{ subcategory: ele?.subcategory }}
                          key={ele.subcategory}
                        >
                          <div className="img-wrapper m-auto m-1 shadow bg-white rounded">
                            <img
                              src={`${ImagApi}/subcat/${ele?.subcatimg}`}
                              className="img-aspect-ratio"
                              alt=""
                            />
                          </div>
                          <p className="col-md-11 m-1 text-center m-auto p-2 boldt">
                            {ele.subcategory}
                          </p>
                        </Link>
                      </div>
                    ))}
                </Slider>
              </div>
            </div>

            <div className="row m-auto p-4 mt-5">
              <img
                className="row p-0 border1 m-0"
                src="..\assests\web banner cleaning.png"
                style={{ width: "100%" }}
              />
            </div>

            <div className="row    mt-5 ">
              <h2 className="text-center">Painting Services</h2>
              <div className="row text-center">
                <button className="col-md-3 m-auto btnd btns_all clr3 clr2 p-2 yellw1 boldbtn">
                  Asian Paints Certified
                </button>{" "}
              </div>
              <div className="row slick-listsd mt-3 slick-listsd1 slick-sliders common-slider">
                <Slider {...actualPaintingSetting}>
                  {categoryData
                    ?.filter((item) =>
                      item.category?.toLowerCase()?.includes("painting")
                    )
                    ?.map((ele) => (
                      <div key={ele._id} className="row m-auto  linksty">
                        <Link
                          className="linksty"
                          to="/servicedetails"
                          state={{ subcategory: ele?.subcategory }}
                          key={ele.subcategory}
                        >
                          <div className="img-wrapper m-auto m-1 shadow bg-white rounded">
                            <img
                              src={`${ImagApi}/subcat/${ele?.subcatimg}`}
                              className="img-aspect-ratio"
                              alt=""
                            />
                          </div>
                          <p className="col-md-11 m-1 text-center m-auto p-2 boldt">
                            {ele.subcategory}
                          </p>
                        </Link>
                      </div>
                    ))}
                </Slider>
              </div>
            </div>

            <div className="row m-auto p-4 mt-5">
              <img
                className="row p-0 border1 m-0"
                src="..\assests\ggg-01.png"
                style={{ width: "100%" }}
              />
            </div>
            <div className="row m-0 mt-5 commercial-bg p-3">
              <h2 className="boldt row m-auto">Commercial Serivces Management</h2>

            </div>
            <div className="row m-auto commercial commercial-bg">
              {commercial.map((ele) => (
                <div className="col-md-2   mt-4 ">
                  <img
                    src={ele.img}
                    width={150}
                    height={150}
                    className="p-2 border-name"
                  />

                  <div className="row   fnt14  mt-2 text-center  boldt">
                    <p className="col-md-10">{ele?.title}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="row m-auto mt-5 ">
              <h2 className="boldt">Our Clients</h2>

            </div>
            <div className="row m-auto mt-3">
              {Clients.map((ele) => (
                <img
                  src={ele}
                  height={100}
                  className="col-md-2  ourClients"
                />
              ))}
            </div>
            <Review />

            <div
              className="col-md-12 m-auto   mt-5 mb-5 "
              style={{ position: "relative" }}
            >
              <h2 className="text-center boldt">Why Choose Us?</h2>

              <div className="row m-auto mt-3 p-3 rdiu clr2 p-5">
                {/* <p className="yellw1 fs-4">Exceptional Expertise:</p>
                <p className="clr3 fsd">
                  Our home services company boasts a team of highly skilled
                  professionals with years of experience,ensuring top-notch
                  service quality and efficient solutions for all your home
                  needs.
                </p>
                <p className="yellw1 fs-4">Customer-Centric Approach:</p>
                <p className="clr3 fsd">
                  We prioritize your satisfaction and convenience,tailoring our
                  services to your unique requirements,our dedicated team
                  listens attentively and delivers personalized solutions that
                  align with your expectations.
                </p>
                <p className="yellw1 fs-4">Reliability And Trust:</p>
                <p className="clr3 fsd">
                  Count on us for dependable,trustworthy service. We value
                  transparency,punctuality.and a strong work ethic,providing
                  peace of mind knowing your home is in capable and caring
                  hands.
                </p> */}

                <p className="clr3 fsd">
                  At Vu Care Services, we pride ourselves on delivering top-notch deep cleaning and pest control solutions. With our experienced team, state-of-the-art equipment, and commitment to customer satisfaction, we ensure your home or business is spotless and pest-free. Choose us for our reliability, professionalism, and dedication to providing a healthier, cleaner environment.
                </p>
              </div>

              <div className="col-md-6 text-center m-auto p-ab p-ab-top">
                <div className="row   m-auto ">
                  <div className="col-md-3 m-1 responsive-brimg  m-auto  text-center rdiu2">
                    <img
                      width={50}
                      height={50}
                      src="..\assests\icons8-expert-48.png"
                    />
                    <p className="grndclr boldt fnt12">Experts Only </p>
                  </div>
                  <div className="col-md-3 m-1 marginleft responsive-brimg  m-auto  text-center rdiu2">
                    <img
                      width={50}
                      height={50}
                      src="..\assests\icons8-house-48.png"
                    />
                    <p className="grndclr boldt fnt12">Fully Equipped </p>
                  </div>

                  <div className="col-md-3 m-1 marginleft responsive-brimg  m-auto  text-center rdiu2">
                    <img
                      width={50}
                      height={50}
                      src="..\assests\icons8-business-team-61.png"
                    />
                    <p className="grndclr boldt fnt12">No Subcontract </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Modal show={subModel} onHide={handleClose} size="lg">
            <div className="row p-4">
              <div className="row p-2">
                <div className="col-md-11">
                  <span>Select the subcategory</span>
                </div>
                <div className="col-md-1" onClick={() => setsubModel(false)}>
                  <img
                    width={25}
                    height={25}
                    src="..\assests\cancel1.png"
                    alt=""
                  />
                </div>
              </div>
              {isLoading ? (
                <div className="col-md-2 m-auto  ">
                  {" "}
                  <ColorRing
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    colors={[
                      "#e15b64",
                      "#f47e60",
                      "#f8b26a",
                      "#abbd81",
                      "#849b87",
                    ]}
                  />
                </div>
              ) : (
                <div className="row m-auto mt-3 justify-content-center">
                  {filtersub?.map((item) => (
                    <div className="col-md-3  text-align-center subcss modacnt">
                      <Link
                        className="linksty"
                        to="/servicedetails"
                        state={{ subcategory: item?.subcategory }}
                        key={item.subcategory}
                      >
                        <img
                          className="mt-2 imgbr2"
                          src={`${ImagApi}/subcat/${item.subcatimg}`}
                          alt=""
                        />
                        <p className="row  p-2 text-black linksty widthsub ">
                          {item.subcategory}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Modal>
          {openPOP && (
            <BookNow
              openPOP={openPOP}
              handleShowPop={handleShowPop}
              handleClosePop={handleClosePop}
            />
          )}
        </>
      )}
      <Footer />
    </>
  );
}
