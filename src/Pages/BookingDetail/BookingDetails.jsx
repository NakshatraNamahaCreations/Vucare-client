import React from "react";

import "../BookingDetail/Components/DetailsHeader/detailsheader.scss";
import RightArrow from "../../Assets/Images/rightarrow.svg";
import { NavLink } from "react-router-dom";
import "../ViewCart/Components/CartDetails/cartitem.scss";
import "../BookingDetail/Components/TrackBooking/trackbooking.scss";
import "../BookingDetail/Components/Address/address.scss";
import "../BookingDetail/Components/ServiceTime/servicetime.scss";
import "../BookingDetail/Components/BookingSummary/bookingsummary.scss";
import { useLocation } from "react-router-dom";
import NabarCompo from "../../Component/navbar";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import moment from "moment";
import "../../index.css";
import { ColorRing } from "react-loader-spinner";
// import { ReactApi } from "../../api";
// import { ImagApi } from "../../api";
export default function BookingDetails() {
  const ReactApi = process.env.REACT_APP_API_URL;
  const ImagApi = process.env.REACT_APP_IMAGE_API_URL;
  const location = useLocation();
  const { trackid } = location.state;
  const [Service, setService] = useState([]);
  const [BookingDetails, setBookingDetails] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getServiceDetails();
    getAllServices();
  }, []);
  const getServiceDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${ReactApi}/getservicedetails`);
      if (response.status === 200) {
        let filtredServices = response?.data?.servicedetails?.filter(
          (itme) => itme?._id === trackid
        );

        setBookingDetails(filtredServices);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  const getAllServices = async () => {
    try {
      setIsLoading(true);
      let res = await axios.get(`${ReactApi}/userapp/getservices`);
      if (res.status === 200) {
        let data = res?.data?.service;

        setService(data);
      }
    } catch (er) {
      console.log(er, "err while fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  // getsubcategory
  let priceId = null;
  let pprices = null;
  let offepric = null;
  let pricesbhk = null;
  let serviceIMg = null;
  return (
    <>
      <NabarCompo className="full_screen" />
      {IsLoading ? (
        <div className="col-md-2 m-auto  ">
          {" "}
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      ) : (
        <>
          {BookingDetails?.flatMap((ele) => {
            const matchingService = Service.find(
              (item) => item?._id === ele?.serviceID
            );

            // Log the matchingService to check if a match is found
            // console.log("Matching Service:", matchingService);

            if (matchingService) {
              priceId = matchingService.morepriceData;
              serviceIMg = matchingService.serviceImg;
            }

            priceId?.filter((price) => {
              if (price._id === ele.planid) {
                pricesbhk = price?.pName;
                pprices = price?.pPrice;
                offepric = price?.pofferprice;
              }
            });
            const deliveryAddressObj = JSON?.parse(ele?.deliveryAddress);

            return (
              <>
                <div className="details_header">
                  <div className="container">
                    <div className="detail_links">
                      <NavLink to="/" className="active">
                        Home
                      </NavLink>
                      <img src={RightArrow} alt="" />
                      <NavLink to="/servicedetails">Service Details</NavLink>
                      <img src={RightArrow} alt="" />
                      <NavLink to="/booking">My Bookings</NavLink>
                    </div>
                    <div className="booking_id_title">
                      Booking ID : {ele?.bookingId}
                    </div>
                    <div className="booking_id_text">
                      Booked on
                      {moment(ele?.updatedAt).format("dddd, MMMM D, YYYY")}
                    </div>
                  </div>
                </div>
                <section className="details_wrapper">
                  <div className="container">
                    <div className="row mt-5">
                      <div className="col-md-8 ">
                        <div className="cart_item_box">
                          <div className="item_title">{ele?.service}</div>
                          <div className="item_content">
                            <div className="left">
                              <div className="left_img">
                                <img
                                  src={`${ImagApi}/service/${serviceIMg}`}
                                  alt=""
                                />
                              </div>
                              <div className="texts">
                                {/* <h4>Premium Cleaning</h4> */}
                                <p>{pricesbhk}</p>
                              </div>
                            </div>
                            <div className="right">
                              <div className="wrong_price">Rs.{pprices}</div>
                              <div className="clr real_price ">
                                Rs.{offepric}
                              </div>
                              <div className="delete">
                                {/* <img src={Delete} alt="" /> */}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="tracking">
                          <div class="detail_traking">
                            <div class="steps success">
                              <div class="date">Booking Confirmed</div>
                              <div class="text">
                                {" "}
                                {moment(ele?.updatedAt).format(
                                  "dddd, MMMM D, YYYY"
                                )}
                              </div>
                            </div>
                            <div class="steps success">
                              <div class="date">Provider Assigned</div>
                              <div class="text">on 16 Feb, 2023</div>
                            </div>
                            <div class="steps proccessing">
                              <div class="date">Service in Progress</div>
                            </div>
                            <div class="steps pending">
                              <div class="date">Service Completed</div>
                            </div>
                          </div>
                        </div>
                        <div className="address">
                          <div className="title">Address</div>
                          <div className="address_text">
                            <span> {deliveryAddressObj?.landmark}</span> ,
                            <span>{deliveryAddressObj?.streetName}</span>
                            <span>{deliveryAddressObj?.address}</span>
                            <span>{deliveryAddressObj?.city}</span>
                            <span>{deliveryAddressObj?.state}</span>
                            <span>{deliveryAddressObj?.zipcode}</span>
                            {/* Flat No. 70, Near Vijaya Hospital, Tilakavati Colony,
                        74, Sadhana, North Delhi, Delhi, Pincode-148278 */}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="service_time">
                          <div className="title">Service Date & Time</div>
                          <div className="serve_date">
                            <div className="s_time">
                              {moment(ele?.startDate).format(
                                "dddd,MMMM D,YYYY"
                              )}{" "}
                              -{" "}
                              <span>
                                {moment(ele?.time, "h:mm A").format("h:mm A")}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="booking_summary">
                          <div className="title">Summary</div>
                          <div className="summary_points">
                            <div className="key">Total Service</div>
                            <div className="value">{ele?.qunty}</div>
                          </div>
                          <div className="summary_points">
                            <div className="key">Sub total</div>
                            <div className="value">Rs. {ele?.subtotal}</div>
                          </div>
                          <div className="summary_points">
                            <div className="key">Saved </div>
                            <div className="value">Rs. {ele?.totalSaved}</div>
                          </div>
                          {/* <div className="summary_points red">
                        <div className="key">Promo Discount </div>
                        <div className="value">-Rs. 100</div>
                      </div> */}
                          <div className="summary_points total">
                            <div className="key">Total Amount</div>
                            <div className="value">Rs. {ele?.GrandTotal}</div>
                          </div>
                          {/* <div className="summary_points otp">
                        <div className="otp_text">
                          Your OTP <span>3579</span>{" "}
                        </div>
                      </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            );
          })}
        </>
      )}
    </>
  );
}
