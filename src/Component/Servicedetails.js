import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
// import Header from "./Header";
import NabarCompo from "./navbar";
import Modal from "react-bootstrap/Modal";

import "../Component/Servicedetails.css";
import "../Component/layout.css";
import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import Offcanvas from "react-bootstrap/Offcanvas";
import Footer from "./Footer";
import BookNow from "../BookNow";
// import { ReactApi } from "../api";
// import { ImagApi } from "../api";
function Servicedetails() {
  const location = useLocation();

  const { subcategory, SelecteddCity } = location.state || {};
  const ReactApi = process.env.REACT_APP_API_URL;
  const ImagApi = process.env.REACT_APP_IMAGE_API_URL;
  const [serviceData, setserviceData] = useState([]);
  const [subModel, setsubModel] = useState(false);
  const [doshow, setdoshow] = useState(null);
  // const [pricesdata, setpricesdata] = useState([]);
  const [Item, setItem] = useState([]);
  const [City, setCity] = useState(null);
  const [SelectedCity, setSelectedCity] = useState(SelecteddCity);
  const [Price, setPrices] = useState(null);
  const [PriceId, setPriceId] = useState(null);
  const [DefaultPrice, setDefaultPrice] = useState(null);
  const [ServiceID, setServiceID] = useState(null);
  const [ServiceIDD, setServiceIDD] = useState(null);
  const [Bannerdata, setBannerdata] = useState(null);
  const [ShowOffcanvas, setShowOffcanvas] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleBookingClose = () => setShowOffcanvas(false);
  // const handleBookingShow = () => setOffcanvas(true);

  useEffect(() => {
    getAllServices();
    getbannerimg();
    getCity();
  }, []);

  const handleDoes = (index) => {
    setdoshow(index);
  };
  const getAllServices = async () => {
    try {
      let res = await axios.get(`${ReactApi}/userapp/getservices`);

      if (res.status === 200) {
        let subcategories = subcategory?.toLowerCase();

        setserviceData(
          res.data.service?.filter((ele) => {
            let category = ele?.Subcategory?.toLowerCase();
            return category.includes(subcategories);
          })
        );
      }
    } catch (er) {
      console.log(er, "err while fetching data");
    }
  };
  const handlebookclick = (clickedItem) => {
    setItem(clickedItem);
    setsubModel(true);
  };

  const getCity = async () => {
    try {
      let res = await axios.get(`${ReactApi}/master/getcity`);
      if (res.status === 200) {
        setCity(res.data.mastercity);
      }
    } catch (er) {
      console.log(er, "err while fetching data");
    }
  };

  const handleHrSelect = (sersid, hr) => {
    const filteredData = serviceData
      ?.filter((ele) => ele._id === sersid)
      ?.flatMap((ele) => ele.morepriceData?.filter((item) => item?._id === hr));
    setServiceIDD(sersid);
    setPrices(filteredData);
    setPriceId(hr);
    setShowOffcanvas(true);
    // if (isMobileView) {
    //   setPriceId(hr);
    //   setShowOffcanvas(true);
    // }
  };

  useEffect(() => {
    if (serviceData.length > 0) {
      const allServiceIDs = serviceData?.map((service) => service._id);

      if (allServiceIDs.length > 0) {
        const defaultPrice = serviceData?.map((ele) => ele.morepriceData[0]);
        setDefaultPrice(defaultPrice);
      }

      setServiceID(allServiceIDs);
    }
  }, [serviceData]);

  const getbannerimg = async () => {
    let res = await axios.get(`${ReactApi}/getallsubcatwebbanner`);
    if ((res.status = 200)) {
      let filteredData = res.data.subcategoyrbanner?.find((Ele) =>
        Ele.category?.includes(subcategory)
      );

      setBannerdata(filteredData);
    }
  };
  const storedUserDataJSON = sessionStorage.getItem("userdata");
  let userData = null;
  try {
    userData = JSON.parse(storedUserDataJSON);
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  const sendWhatsAppMessage = (PriceId, service) => {
    let Data = serviceData
      ?.flatMap((ele) =>
        ele.morepriceData
          ?.filter((priceData) => priceData._id === PriceId)
          ?.map((priceData) => ({
            serviceImg: ele.serviceImg,
            serviceName: ele.serviceName,
            pName: priceData.pName,
          }))
      )
      ?.filter(Boolean);

    if (Data.length > 0) {
      const apiEndpoint = "https://api.whatsapp.com/send";

      const recipientString = String("9980670037");

      const defaultCountryCode = "+91";

      const fullRecipient = recipientString.startsWith("+")
        ? recipientString
        : defaultCountryCode + recipientString;

      const message = `
        Hi there!
        I'm interested in learning more about the service you offer.
        Could you please provide additional details?
        Service Details:
        - Service Name: ${Data[0].serviceName}
        - Selected Plan: ${Data[0].pName}
        - Customer Name: ${userData.customerName}
        
        Thank you!
        `;

      const whatsappLink = `${apiEndpoint}?phone=${encodeURIComponent(
        fullRecipient
      )}&text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, "_blank");
    } else {
      console.error("No data found for the given PriceId");
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getEmbedUrl = (url) => {
    let embedUrl = "";
    if (url?.includes("/shorts/")) {
      embedUrl = url?.replace("/shorts/", "/embed/") + "?autoplay=1";
    } else if (url?.includes("youtube.com/watch?v=")) {
      const videoId = url?.split("v=")[1]?.split("&")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (url?.includes("youtu.be/")) {
      const videoId = url?.split("youtu.be/")[1]?.split("?")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return embedUrl;
  };
  const [openPOP, setopenPOP] = useState(false);
  const handleShowPop = () => {
    setopenPOP(true);
  };

  const handleClosePop = () => {
    setopenPOP(false);
  };
  console.log(subcategory, "subcategory")
  const services = [
    {
      subcate: "General Deep Cleaning Service",
      includes: [
        "Floor Cleaning: Comprehensive floor scrubbing and cleaning using SingleDisc machines to ensure deep dirt removal.",
        "Dusting and Cobweb Removal: Thorough dusting of all surfaces, including ceilings, walls, and furniture, as well as cobweb removal.",
        "Ceiling and Wall Cleaning: Cleaning of ceilings and walls to remove dust, dirt, and cobwebs.",
        "Window and Door Cleaning: Cleaning of all windows, window frames, and doors, including tracks and handles.",
        "Kitchen Cleaning: Degreasing and cleaning of kitchen surfaces, cabinets (inside and out), countertops, and appliances (exterior only).",
        "Bathroom Cleaning: Cleaning of all bathroom fixtures including sinks, toilets, showers, and bathtubs.",
        "Furniture Cleaning: Dry vacuuming of sofas, chairs, and other upholstered furniture.",
        "Appliance Cleaning: Exterior cleaning of major kitchen appliances like the fridge, microwave, and oven.",
        "Lighting and Switchboard Cleaning: Cleaning of all light fixtures, fans, and switchboards.",
        "Mattress and Carpet Cleaning: Dry vacuuming of mattresses and carpets to remove dust and allergens.",
        "Rearranging Items: Basic rearrangement of furniture and items post-cleaning."
      ],
      excludes: [
        "Wall Shampooing: Deep cleaning of walls with shampooing agents.",
        "Heavy Stain Removal: Removal of stubborn stains, gum marks, sticker marks, lamination stickers, fevicol, paint marks, pigeon droppings, etc.",
        "External Window Cleaning: Cleaning of windows that are beyond reachable areas or require special equipment.",
        "Structural Repairs: Any kind of structural repairs, including plumbing, electrical repairs, and wall repairs.",
        "Deep Mold Removal: Mold removal beyond standard cleaning efforts.",
        "Balcony and Terrace Cleaning: Cleaning and scrubbing of balconies and terraces.",
        "Interior Appliance Cleaning: Interior cleaning of appliances like ovens, microwaves, and fridges.",
        "Furniture Repair and Reupholstery: Any repair or reupholstery of furniture items.",
        "Specialty Stain Removal: Removal of deep-set stains that require specialized treatments.",
        "Emergency Services: Services that require immediate attention without prior scheduling.",
        "Pest Control: Any pest control services are not part of general deep cleaning and need to be availed separately."
      ],
      dos: [
        "Secure Valuables: Ensure all valuable items are secured or removed from the areas to be cleaned before our team arrives.",
        "Provide Access: Ensure our team has access to electricity and water supply during the cleaning process.",
        "Communicate Special Requests: Inform us in advance of any specific areas of concern or additional services you may require.",
        "Inspect Post-Cleaning: Check the cleaned areas post-service and provide feedback to the team.",
        "Schedule Follow-Up: For any additional or recurring cleaning needs, schedule follow-up services in advance.",
        "Prepare the Space: Remove any fragile or personal items from surfaces to be cleaned."
      ],
      donts: [
        "Don't Leave Loose Items: Avoid leaving loose items or clutter in the areas to be cleaned.",
        "Don't Interrupt the Process: Let the cleaning team complete their work without unnecessary interruptions.",
        "Don't Apply Chemicals: Do not apply any chemicals or cleaning agents on areas that have been freshly cleaned.",
        "Don't Leave Pets Unattended: Keep pets away from the areas being cleaned to ensure their safety and the efficiency of the cleaning process.",
        "Don't Overcrowd the Space: Avoid overcrowding the cleaning area with unnecessary furniture or items.",
        "Don't Delay Feedback: Provide immediate feedback if there are areas that need re-cleaning or attention."
      ]
    },
    {
      subcate: "General Pest Control Service",
      includes: [
        "Inspection: Thorough inspection of the premises to identify pest infestation areas.",
        "Gel Application: Application of pest control gel in strategic locations like cabinets, wardrobes, window corners, and kitchen areas.",
        "Spray Treatment: Spraying of pest control chemicals in bathrooms, bedrooms, kitchen cabinets, balconies, halls, and dining areas.",
        "Protection from Common Pests: Treatment targeting common pests such as cockroaches, ants, flies, spiders, and silverfish.",
        "Chemical Application: Use of government-approved chemicals like Fipronil, Imidacloprid, and Cypermethrin.",
        "Egg and Larvae Elimination: Treatment aimed at killing adult pests as well as new eggs and larvae to provide lasting relief.",
        "Service Duration: The average service time is 20 to 40 minutes, depending on the size of the house, with an additional 5 to 10 minutes for thorough inspection.",
        "Safety Measures: Usage of safe and approved chemicals to ensure minimal risk to humans and pets."
      ],
      excludes: [
        "Rodent Control: Specific treatments for rodents are not included in general pest control services.",
        "Termite Treatment: Specialized termite treatment is not part of the general pest control package.",
        "Bed Bug Treatment: Treatment specifically targeting bed bugs is not included.",
        "Mosquito Control: Mosquito control treatments are not included.",
        "Lizard Control: Lizard control measures are excluded from general pest control services.",
        "Garden and Outdoor Areas: Pest control for extensive garden areas or large outdoor spaces is not included.",
        "Structural Repairs: Repairs to structural damage caused by pests are not covered.",
        "Sanitation Services: General sanitation and cleaning services post-treatment are not included.",
        "Emergency Services: Immediate or emergency pest control services without prior scheduling are excluded.",
        "Specialty Treatments: Treatments requiring specialized equipment or methods not covered under standard pest control.",
        "Long-Term Maintenance: Long-term pest control maintenance plans are not included in a single service."
      ],
      dos: [
        "Pre-Treatment Preparation: Ensure all food items are covered and stored away. Move furniture and appliances away from walls.",
        "Inform the Technician: Inform the technician of any specific pest problems or areas of concern.",
        "Follow Post-Treatment Instructions: Adhere to the post-treatment instructions provided by the technician for maximum effectiveness.",
        "Schedule Follow-Up Visits: Schedule follow-up visits within the warranty period to address any recurring issues.",
        "Maintain Cleanliness: Keep your home clean and free of food crumbs and spills to avoid attracting pests.",
        "Use Preventative Measures: Seal cracks, fix leaks, and take other preventative measures to keep pests out."
      ],
      donts: [
        "Don't Touch Treated Areas: Avoid touching treated areas until they are completely dry.",
        "Don't Use Other Chemicals: Do not use other chemicals or cleaning agents on treated areas immediately after the service.",
        "Don't Leave Children Unsupervised: Keep children away from treated areas for at least two hours after the service.",
        "Don't Ignore Infestation Signs: If you notice signs of pest infestation after the treatment, contact us immediately for a follow-up visit.",
        "Don't Delay Scheduling: Don’t delay scheduling follow-up visits if needed.",
        "Don't Leave Food Exposed: Avoid leaving food exposed in the treated areas to prevent attracting pests."
      ]
    }
  ];

  return (
    <div>
      <NabarCompo />
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-6">
            <div className="row m-auto mb-3">
              <h4 className="text-bold mt-1">{subcategory}</h4>
            </div>
            <div className="cart_item_box text-center">
              {" "}
              <div className="row icons-list">
                {" "}
                <iframe
                  width="200"
                  height="340"
                  src={getEmbedUrl(Bannerdata?.video)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-5 ">
            <div className="row mt-5  brd">
              <>
                <img
                  onClick={handleShowPop}
                  alt=""
                  className="header_logo res-header-logo brd p-0"
                  src={`${ImagApi}/subcatwebBanner/${Bannerdata?.banner}`}
                  width={200}
                  height={340}
                />
              </>
            </div>
          </div>
        </div>
        <div className="row  mt-5">
          <div className="col-md-6 data_container">
            <div className="row container_proud">
              {!serviceData || serviceData.length === 0 ? (
                <div className="row mt-5">
                  <div className="col-md-4"></div>
                  <div className="col-md-4">Serivces Not available</div>
                  <div className="col-md-4"></div>
                </div>
              ) : (
                serviceData?.map((service, index) => {
                  return (
                    <div className="row icons-list mt-5">
                      <div className="col-md-8 ">
                        <p className="res-txt servicenme">
                          {service.serviceName}
                        </p>
                        {service?.serviceHour ? (
                          <span className="me-3">
                            Duration {service?.serviceHour}
                          </span>
                        ) : null}
                        <div className="row  mt-3">
                          <p
                            className="col-md-4"
                            style={{ color: "black", fontWeight: "bold" }}
                          >
                            Start price
                          </p>
                          <div className="col-md-8">
                            {Price && Price?.length > 0
                              ? Price.flatMap((ele) => {
                                if (
                                  ServiceIDD === service._id &&
                                  ele._id === PriceId
                                ) {
                                  return (
                                    <div className="row" key={ele._id}>
                                      {ele?.pofferprice
                                        ?.toLowerCase()
                                        ?.includes(
                                          "contact" ||
                                          ele?.pPrice
                                            ?.toLowerCase()
                                            ?.includes("contact")
                                        ) ? (
                                        <p
                                          className="text-green"
                                          style={{
                                            color: "#03b162",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Please Contact For Price
                                        </p>
                                      ) : (
                                        <>
                                          <p
                                            className="col-md-5 mx-1  price"
                                            style={{
                                              textDecorationLine:
                                                "line-through",
                                              color: "grey",
                                            }}
                                          >
                                            Rs. {ele?.pPrice}
                                          </p>

                                          <p className="col-md-5 grndclr text-bolder">
                                            Rs. {ele?.pofferprice}
                                          </p>
                                        </>
                                      )}
                                    </div>
                                  );
                                }
                              })
                              : ServiceID?.map((ele) => {
                                if (ele === service._id) {
                                  return DefaultPrice?.map((price) => {
                                    if (service?.morepriceData) {
                                      const filteredData =
                                        service?.morepriceData?.find(
                                          (data) => data._id === price?._id
                                        );

                                      if (filteredData) {
                                        return (
                                          <div className="row " key={ele._id}>
                                            {filteredData?.pofferprice
                                              ?.toLowerCase()
                                              ?.includes(
                                                "contact" ||
                                                filteredData?.pPrice
                                                  ?.toLowerCase()
                                                  ?.includes("contact")
                                              ) ? (
                                              <p
                                                style={{
                                                  color: "#03b162",
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                Contact For Price
                                              </p>
                                            ) : (
                                              <>
                                                <p
                                                  className="col-md-5   price"
                                                  style={{
                                                    textDecorationLine:
                                                      "line-through",
                                                    color: "grey",
                                                  }}
                                                >
                                                  Rs. {filteredData?.pPrice}
                                                </p>
                                                <p className="col-md-5 grndclr text-bold">
                                                  Rs.{" "}
                                                  {filteredData?.pofferprice}{" "}
                                                </p>
                                              </>
                                            )}
                                          </div>
                                        );
                                      }
                                    }
                                  });
                                }
                              })}
                          </div>
                        </div>

                        <div className="row">
                          {service?.morepriceData?.map((moreprice) => {
                            return (
                              <div className="col-md-3 res-lable area valudwidth ">
                                {moreprice?.pName && (
                                  <label
                                    className="mobilescreen-price"
                                    htmlFor={moreprice._id}
                                    key={moreprice._id}
                                    onClick={() =>
                                      handleHrSelect(
                                        service._id,
                                        moreprice?._id
                                      )
                                    }
                                  >
                                    <input
                                      type="radio"
                                      name={`moreprice-${service._id}`}
                                      id={moreprice._id}
                                      value={Price}
                                    />
                                    <span className="  ">
                                      {moreprice?.pName}
                                    </span>
                                  </label>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <p
                          className="cursor grndclr"
                          onClick={() => handlebookclick(service)}
                        >
                          View details
                        </p>
                      </div>

                      <div className="col-md-4  m-auto">
                        <img
                          width={200}
                          className="row mb-2 header_logo responsive-img"
                          height={150}
                          src={`${ImagApi}/service/${service?.serviceImg}`}
                          alt=""
                        />
                      </div>
                      <hr />
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="col-md-1"></div>
          {isMobile ? (
            <div className="mobile-screen-cart">
              <Offcanvas
                style={{
                  height: "fit-content",
                  borderTopLeftRadius: "15px",
                  borderTopRightRadius: "15px",
                }}
                placement="bottom"
                siex
                show={ShowOffcanvas}
                onHide={handleBookingClose}
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title>Cart</Offcanvas.Title>
                </Offcanvas.Header>

                <div className="row p-2">
                  {serviceData?.map((ele) => {
                    if (ele._id.includes(ServiceIDD)) {
                      return (
                        <>
                          <div className="row ">
                            <p>{ele?.serviceName}</p>
                          </div>
                          <div
                            className="row "
                            style={{ border: "1px solid black" }}
                          >
                            <div className="col-md-2 m-auto valudwidth">
                              {ele.morepriceData
                                ?.filter((item) => item?._id === PriceId)
                                ?.map((filteredElement) => (
                                  <p
                                    key={filteredElement?._id}
                                    className=" m-auto"
                                  >
                                    {filteredElement?.pName}
                                  </p>
                                ))}
                            </div>
                            <div className="col-md-6 valudwidth  m-auto">
                              {ele.morepriceData
                                ?.filter((item) => item?._id === PriceId)

                                ?.map((filteredElement) => (
                                  <div className="row   m-auto ">
                                    {filteredElement?.pofferprice?.includes(
                                      "contact" ||
                                      filteredElement?.pPrice?.includes(
                                        "contact"
                                      )
                                    ) ? (
                                      <p
                                        style={{
                                          color: "#03b162",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Contact For Price
                                      </p>
                                    ) : (
                                      <>
                                        <span className="col-md-6  m-auto real_price ">
                                          {filteredElement?.pofferprice &&
                                            "Rs."}{" "}
                                          {filteredElement?.pofferprice}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                ))}
                            </div>
                            <div className="col-md-4 valudwidth">
                              <img
                                className="brd  responsive-img"
                                // width={300}
                                height={50}
                                src={`${ImagApi}/service/${ele?.serviceImg}`}
                                alt=""
                              />
                            </div>
                          </div>

                          {ele.morepriceData
                            ?.filter((item) => item?._id === PriceId)

                            ?.map((filteredElement) => (
                              <div className="row   ">
                                {filteredElement?.pofferprice?.includes(
                                  "contact" ||
                                  filteredElement?.pPrice?.includes("contact")
                                ) ? (
                                  <div className="row  m-2">
                                    <button
                                      onClick={() =>
                                        sendWhatsAppMessage(filteredElement._id)
                                      }
                                      className="col-md-6 m-auto grndclr "
                                      style={{
                                        padding: "8px",
                                        background: "gold",
                                      }}
                                    >
                                      Enquire Now
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    {PriceId !== null &&
                                      PriceId !== undefined &&
                                      ele._id === ServiceIDD && (
                                        <div
                                          className="m-auto text-center p-2"
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Link
                                            to="/viewcart"
                                            state={{
                                              passseviceid: ele._id,
                                              bhk: PriceId,
                                              selectecity: SelectedCity,
                                            }}
                                            key={ele.serviceName}
                                            style={{ textDecoration: "none" }}
                                          >
                                            <button
                                              className="grndclr"
                                              style={{
                                                width: "300px",
                                                padding: "8px",
                                                background: "gold",
                                              }}
                                            >
                                              Continue
                                            </button>
                                          </Link>
                                        </div>
                                      )}
                                  </>
                                )}
                              </div>
                            ))}
                        </>
                      );
                    }
                  })}
                </div>
              </Offcanvas>
            </div>
          ) : (
            <div className="col-md-5 desktop-screen-cart">


              <div className="row ul_list p-4 mt-2">
                <button
                  onClick={() => handleDoes(0)}
                  className={`col-md-6 p-2 m-auto do-s ${doshow === 0 ? "dos-active" : ""
                    }`}
                >
                  Do's
                </button>

                <button
                  onClick={() => handleDoes(1)}
                  className={`col-md-6 p-2 m-auto do-s ${doshow === 1 ? "dos-active" : ""
                    }`}
                >
                  Dont's
                </button>
                <div className="row p-3">
                  {doshow === 0 ? (
                    <ul className="p-2">

                      {services?.find((ele) => ele?.subcate?.toLowerCase()
                        === subcategory?.toLowerCase())?.dos?.map((inc) => <li 
                        className="dos-list p-2" key={inc} >
                          {inc}
                        </li>)}
                    </ul>
                  ) : (
                    <ul className="p-2">
                      {services?.find((ele) => ele?.subcate?.toLowerCase()
                        === subcategory?.toLowerCase())?.donts?.map((inc) =>
                          <li className="dos-list p-2" >
                            {inc}
                          </li>)}
                    </ul>
                  )}
                </div>
              </div>

              <div className="row mt-5 cart_item_box cart_item_box1 text-center ">
                {!PriceId && (
                  <div>
                    <img
                      className="col-md-3 m-auto mt-3"
                      width={100}
                      height={100}
                      src="../NewImg/crts.png"
                      alt=""
                    />
                    <div className="texts m-auto">No items in your cart</div>
                  </div>
                )}
                {serviceData?.map((ele) => {
                  if (ele?._id?.includes(ServiceIDD)) {
                    return (
                      <>
                        <div className="item_title">{ele?.serviceName}</div>
                        <div className="item_content row m-auto">
                          <div className="col-md-4 m-auto left">
                            {/* <div className="row left_img"> */}
                            <img
                              className="brd row responsive-img"
                              width={300}
                              height={50}
                              src={`${ImagApi}/service/${ele?.serviceImg}`}
                              alt=""
                            />
                            {/* </div> */}

                            <div className="texts ">
                              <h4>{ele?.servicetitle}</h4>
                            </div>
                            <div className="row m-auto">
                              {ele?.morepriceData
                                ?.filter((item) => item?._id === PriceId)
                                ?.map((filteredElement) => (
                                  <div key={filteredElement?._id}>
                                    {filteredElement?.pName}
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div className="col-md-7 m-auto">
                            {ele?.morepriceData
                              ?.filter((item) => item?._id === PriceId)

                              ?.map((filteredElement) => (
                                <div className="row   ">
                                  {filteredElement?.pofferprice?.includes(
                                    "contact" ||
                                    filteredElement?.pPrice?.includes(
                                      "contact"
                                    )
                                  ) ? (
                                    <p
                                      style={{
                                        color: "#03b162",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Contact For Price
                                    </p>
                                  ) : (
                                    <>
                                      <span className="col-md-6 m-auto wrong_price ">
                                        {filteredElement?.pPrice && "Rs."}{" "}
                                        {filteredElement?.pPrice}
                                      </span>
                                      <span className="col-md-6 m-auto real_price ">
                                        {filteredElement?.pofferprice && "Rs."}{" "}
                                        {filteredElement?.pofferprice}
                                      </span>
                                    </>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>

                        {ele?.morepriceData
                          ?.filter((item) => item?._id === PriceId)

                          ?.map((filteredElement) => (
                            <div className="row   ">
                              {filteredElement?.pofferprice?.includes(
                                "contact" ||
                                filteredElement?.pPrice?.includes("contact")
                              ) ? (
                                <div className="row  m-2">
                                  <button
                                    onClick={() =>
                                      sendWhatsAppMessage(filteredElement._id)
                                    }
                                    className="col-md-6 m-auto grndclr "
                                    style={{
                                      padding: "8px",
                                      background: "gold",
                                    }}
                                  >
                                    Enquire Now
                                  </button>
                                </div>
                              ) : (
                                <>
                                  {PriceId !== null &&
                                    PriceId !== undefined &&
                                    ele?._id === ServiceIDD && (
                                      <div
                                        className="m-auto text-center p-2"
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Link
                                          to="/viewcart"
                                          state={{
                                            passseviceid: ele._id,
                                            bhk: PriceId,
                                            selectecity: SelectedCity,
                                          }}
                                          key={ele.serviceName}
                                          style={{ textDecoration: "none" }}
                                        >
                                          <button
                                            className="grndclr"
                                            style={{
                                              width: "300px",
                                              padding: "8px",
                                              background: "gold",
                                              // color: "#03b162",
                                            }}
                                          >
                                            Continue
                                            {/* <AddIcon /> */}
                                          </button>
                                        </Link>
                                      </div>
                                    )}
                                </>
                              )}
                            </div>
                          ))}
                      </>
                    );
                  }
                })}
              </div>
              <div className="row cart_item_box  cart_item_box1">
                <div className="item_title ">Vu Care</div>
                <div className="item_content">
                  <div className="left">
                    <div className="texts me-2">
                      <p>
                        <span>
                          <CheckIcon /> <span>Verified Professionals</span>
                        </span>
                      </p>
                      <p>
                        <span>
                          <CheckIcon /> <span>Safe Chemicals</span>
                        </span>
                      </p>
                      <p>
                        <span>
                          <CheckIcon /> <span>Mess Free Experience</span>
                        </span>
                      </p>
                    </div>
                    <img
                      className=" brd"
                      alt=""
                      src="../images/cleaning-favicon-color.png"
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <Modal show={subModel} size="lg">
        <div>
          <div className="row m-auto ">
            <div className="modal_header row m-auto p-3">
              <div className="col-11 col-md-11">
                <span>Select the subcategory</span>
              </div>
              <div className="col-md-1" onClick={() => setsubModel(false)}>
                <img
                  width={30}
                  height={30}
                  alt=""
                  src="..\assests\cancel1.png"
                // style={{}}
                />
              </div>
            </div>
            <h3 className="text-center">{Item?.serviceName}</h3>

            <div className="row modal_body p-3 m-auto">
              <div className="col-md-11 m-auto header_logo p-4">
                <div className="row m-auto text-center ">
                  <img
                    className="col-md-5 m-auto p-0 mt-2 header_logo"
                    src={`${ImagApi}/service/${Item?.serviceImg}`}
                    alt=""
                    height={200}
                  />
                </div>
                <div className="row mt-2 ">
                  <p className="col-md-5 ">
                    No Of Service Hour {Item?.serviceHour}{" "}
                    <AccessTimeIcon style={{ color: "grey" }} />
                  </p>
                  <p className="col-md-5 ">
                    No of Service Man {Item?.NofServiceman}{" "}
                    <PeopleIcon style={{ color: "grey" }} />
                  </p>

                  {Item?.morepriceData?.map((Ele) => (
                    <div className="row ">
                      <div className="col-md-3 p-2   area valudwidth ">
                        {Ele?.pName && (
                          <label
                            htmlFor={Ele._id}
                            key={Ele._id}
                            onClick={() => handleHrSelect(Ele._id, Ele?._id)}
                          >
                            <input
                              type="radio"
                              name={`Ele-${Ele._id}`}
                              id={Ele._id}
                              // defaultChecked={innerindex === 0}
                              value={Price}
                            />
                            <span className=" res-txt ">{Ele?.pName}</span>
                          </label>
                        )}
                      </div>

                      {Ele?.pofferprice?.includes(
                        "contact" || Ele?.pPrice?.includes("contact")
                      ) ? (
                        <p
                          style={{
                            color: "#03b162",
                            fontWeight: "bold",
                          }}
                        >
                          Contact For Price
                        </p>
                      ) : (
                        <>
                          {" "}
                          <p
                            className="col-md-3 m-0 valudwidth m-auto"
                            style={{
                              textDecorationLine: "line-through",
                              color: "grey",
                            }}
                          >
                            Rs. {Ele?.pPrice}
                          </p>
                          <p
                            className="col-md-3 m-0 valudwidth m-auto"
                            style={{
                              color: "#03b162",
                              fontWeight: "bold",
                            }}
                          >
                            Rs. {Ele?.pofferprice}
                          </p>{" "}
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <>
                  {Item?.serviceDesc?.map((Ele, index) => (
                    <span key={index}>
                      {Ele?.text?.split("\n")?.map((line, lineIndex) => (
                        <p key={lineIndex}>
                          {line?.startsWith("*") ? line : `* ${line}`}
                        </p>
                      ))}
                    </span>
                  ))}
                </>

              </div>
            </div>
          </div>
        </div>
      </Modal>

      {openPOP && (
        <BookNow
          openPOP={openPOP}
          handleShowPop={handleShowPop}
          handleClosePop={handleClosePop}
        />
      )}
    </div>
  );
}

export default Servicedetails;
