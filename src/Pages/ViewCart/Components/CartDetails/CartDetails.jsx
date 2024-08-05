import React, { useEffect, useState } from "react";
import "./cartdetails.scss";
import Add from "./../../../../Assets/Images/add.svg";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../../../ServicesView/Components/AddOn/addon.scss";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import "../CartDetails/cartdetails.scss";
import "../PersonalInfo/personalinfo.scss";
import "../CartDetails/cartitem.scss";
import "../ScheduleService/scheduleservice.scss";
import "../Payment/payment.scss";
import "../Summary/summary.scss";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { NavLink } from "react-bootstrap";
import RightArrow from "../../../../Assets/Images/rightarrow.svg";
import "../../../BookingDetail/Components/DetailsHeader/detailsheader.scss";
import "../Promo/promo.scss";
// import { ImagApi, ReactApi } from "../../../../api";

export default function CartDetails() {
  const ReactApi = process.env.REACT_APP_API_URL;
  const ImagApi = process.env.REACT_APP_IMAGE_API_URL;
  const location = useLocation();
  const storedUserDataJSON = sessionStorage.getItem("userdata");

  let userData = null;
  try {
    userData = JSON.parse(storedUserDataJSON);
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  const { passseviceid, bhk, selectecity } = location.state || {};

  const [selectedAddons, setSelectedAddons] = useState([]);
  const [Service, setService] = useState([]);
  // const navigate = useNavigate();

  // const [pay, setPay] = useState(true);
  const [cartData, setCartData] = useState([]);
  const [viewOrder, setViewOrder] = useState(false);
  const [viewAddress, setviewAddress] = useState(false);
  const [AddAddress, setAddAddress] = useState(false);
  const [Voucher, setVoucher] = useState([]);
  const [Discount, setDiscount] = useState(null);
  const [fourDates, setFourDates] = useState([]);

  const [datepicker, setdatePicker] = useState(false);

  const [AddOn, setAddOn] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlotsID, setselectedSlotsID] = useState(null);

  const [CustomerAddress, setCustomerAddress] = useState("");
  const [CustomerStreet, setCustomerStreet] = useState("");
  const [CustomerLandMark, setCustomerLandMark] = useState("");
  const [CustomerState, setCustomerState] = useState("");
  const [CustomerCity, setCustomerCity] = useState("");
  const [CustomerZipCode, setCustomerZipCode] = useState("");

  const [NumberOfQunatity, setNumberOfQunatity] = useState(1);

  const [selectedpaymentOption, setselectedpaymentOption] = useState(null);

  const [DelivaryAddress, setDelivaryAddress] = useState(null);
  const [SelectedAddress, setSelectedAddress] = useState(null);
  const [allBookedServices, setallBookedServices] = useState(null);

  // console.log("selectecity", selectecity);
  useEffect(() => {
    getAllServices();
    getVoucher();
    getAddons();
    getDeliveryAddres();
    getServiceDetails();
  }, []);
  const handleAddAddres = () => {
    setAddAddress(true);
  };

  const currentDate1 = new Date(Date.now());

  const options = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  const formattedDate = currentDate1.toLocaleDateString("en-US", options);

  const result = ` ${formattedDate} `;
  const time = currentDate1.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const getAllServices = async () => {
    try {
      let res = await axios.get(`${ReactApi}/userapp/getservices`);
      if (res.status === 200) {
        setService(res.data.service);
      }
    } catch (er) {
      console.log(er, "err while fetching data");
    }
  };
  const handleAddon = (addon) => {
    setSelectedAddons((prevAddons) =>
      prevAddons.concat(Array.isArray(addon) ? addon : [addon])
    );
  };

  useEffect(() => {
    const filteredService = Service?.filter((service) => {
      return service?._id === passseviceid;
    });

    setCartData(filteredService);
  }, [passseviceid, Service]);

  // console.log(cartData, "cartData");

  let services = Service?.find((ele, index) => {
    return ele?._id === passseviceid;
  });

  const getVoucher = async () => {
    try {
      let res = await axios.get(`${ReactApi}/userapp/getvoucher`);
      if (res.status === 200) {
        // let filteredData = res.data.voucher.filter(
        //   (ele) =>
        //     ele.category?.toLowerCase() === services?.category?.toLowerCase()
        // );

        setVoucher(res.data.voucher);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const [coupancode, setCoupanCode] = useState("");
  const [VoucherError, setVoucherError] = useState("");
  const [verified, setVerified] = useState(false);

  // Initial calculations
  let AddOnPrice = 0;
  let CountAddon = 0;
  let addOnPrice = selectedAddons?.map((addon) => {
    CountAddon++;
    return Number(addon?.addOnsOfferPrice);
  });

  let getaddonsSum = addOnPrice?.reduce(
    (accumulator, currentvalue) => accumulator + currentvalue,
    AddOnPrice
  );

  let FreqensaveAmt = 0;

  const calculateSubtotal = (cartData) => {
    let subtotal = 0;
    let frequentAmount = 0;
    let totalPrice = 0;
    cartData?.forEach((ele) => {
      ele?.morepriceData
        .filter((item) => item?._id === bhk)
        ?.forEach((filteredElement) => {
          const price = parseFloat(filteredElement?.pofferprice) || 0;
          const RealPrice = parseFloat(filteredElement?.pPrice) || 0;
          FreqensaveAmt =
            parseInt(RealPrice) * Number(NumberOfQunatity) -
            parseInt(price) * Number(NumberOfQunatity);
          subtotal += parseInt(price) * Number(NumberOfQunatity);
          frequentAmount += FreqensaveAmt;
          totalPrice += RealPrice * Number(NumberOfQunatity);
        });
    });

    return { subtotal, frequentAmount, totalPrice };
  };

  const { subtotal, frequentAmount, totalPrice } = calculateSubtotal(
    cartData,
    passseviceid
  );

  const discountAmount = (Number(subtotal) * Number(Discount)) / 100;


  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    const initialGrandTotal =
      Number(subtotal) - Number(discountAmount) + Number(getaddonsSum);
    setGrandTotal(initialGrandTotal);
  }, [subtotal, discountAmount, getaddonsSum]);

  const handleVerify = () => {
    let data = Voucher?.find((ele) => ele.voucherCode === coupancode);


    if (!data) {
      setVoucherError("Invalid coupon code.");
      return;
    }


    let currentDate = new Date();
    let voucherExpDate = new Date(data.expDate);

    currentDate.setHours(0, 0, 0, 0);
    voucherExpDate.setHours(0, 0, 0, 0);

    if (currentDate > voucherExpDate) {
      setVoucherError("This voucher has expired.");
    } else {

      let discountAmount = (grandTotal * data.discountPercentage) / 100;
      let newGrandTotal = grandTotal - discountAmount;
      setGrandTotal(newGrandTotal);
      setVerified(true);
      setVoucherError("");
    }
  };


  const currentDate = new Date();

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  useEffect(() => {
    const getNextDays = () => {
      const nextDays = [];
      for (let i = 0; i < 4; i++) {
        const date = new Date();
        date.setDate(currentDate.getDate() + i);

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const dayName = daysOfWeek[date.getDay()];

        nextDays.push({ day, month, year, dayName });
      }
      return nextDays;
    };

    const nextDays = getNextDays();
    setFourDates(nextDays);
  }, []);

  const tileDisabled = ({ date }) => {
    const isPastDate = moment(date).isBefore(moment(), "day");

    return isPastDate;
  };

  const tileClassName = ({ date }) => {
    const isNextFourDate = fourDates.some((d) => {
      const dDate = new Date(d.year, d.month - 1, d.day);
      return date.toDateString() === dDate.toDateString();
    });

    return isNextFourDate ? "selecteddate" : "";
  };

  const DatePicker = (e) => {
    e.preventDefault();
    setdatePicker(true);
  };
  const handleCalendarSelect = (date) => {
    const selectedDate = moment(date).toDate();

    setSelectedDate(selectedDate);
    // console.log(selectedDate, "selectedDate");
    setdatePicker(false);
  };
  // console.log(selectedDate, "select");
  const monthsMap = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };
  const isDateSelected = (day) => {
    if (!selectedDate) return false;

    const { day: dayNumber, month, year } = day;
    const monthName = monthsMap[month];

    if (!monthName) {
      console.error("Invalid month number:", month);
      return false;
    }

    const formattedDay = moment(`${year}-${month}-${dayNumber}`, "YYYY-M-D");
    const formattedDateString = formattedDay.format("LL");

    return formattedDateString === selectedDate;
  };

  const handleCheckboxSelect = (day) => {
    const formattedDate = moment(
      `${day.year}-${day.month}-${day.day}`,
      "YYYY-M-D"
    );
    const formattedDateString = formattedDate.format("LL");

    setSelectedDate(formattedDateString);
  };

  const getAddons = async () => {
    try {
      let res = await axios.get(`${ReactApi}/userapp/getServiceAddOns`);
      if (res.status === 200) {
        setAddOn(res?.data?.AddOns);
        // .filter((i) => i.addOnsCategory === selectedCategory)
      }
    } catch (err) {
      console.log(err);
    }
  };

  let cate = services?.serviceName?.toLowerCase();
  const filteredAddons = AddOn?.filter((addon) => {
    const addonCategory = addon?.addOnsCategory?.toLowerCase();
    return addonCategory?.includes(cate);
  });

  const handleSlotSelect = (starttime, endtime) => {
    setselectedSlotsID([{ startTime: starttime, endTime: endtime }]);
  };

  const selectedSlotTextget = selectedSlotsID
    ?.map((slot) => `${slot?.startTime} - ${slot?.endTime}`)
    ?.join(", ");

  const handleOptionClick = (selectedId) => {
    const option1 = document.getElementById("option1");
    const option2 = document.getElementById("option2");

    if (selectedId === "option1") {
      option1.checked = true;
      option2.checked = false;

      setselectedpaymentOption("Pay Online");
    } else if (selectedId === "option2") {
      option1.checked = false;
      option2.checked = true;

      setselectedpaymentOption("Cash on Delivery");
    }
  };

  let ServicePans = cartData?.map((item) =>
    item.morepriceData?.filter((item) => item?._id === bhk)?.map((ele) => ele)
  );
  const firstFilteredElement = ServicePans?.[0]?.[0];

  const calculateExpiryDate = (selectedDate, servicePeriod) => {
    let monthsToAdd = 0;

    if (servicePeriod === "monthly") {
      monthsToAdd = 1;
    } else if (servicePeriod === "quart") {
      monthsToAdd = 3;
    } else if (servicePeriod === "half") {
      monthsToAdd = 6;
    } else if (servicePeriod === "year") {
      monthsToAdd = 12;
    }

    const expiryDate = moment(selectedDate)
      .add(monthsToAdd, "months")
      .format("YYYY-MM-DD");

    return expiryDate;
  };

  const servicePeriod = firstFilteredElement?.servicePeriod;

  const dividedamtCharges = [firstFilteredElement?.pofferprice];
  const pofferprice = firstFilteredElement?.pofferprice;

  const expiryDate = calculateExpiryDate(selectedDate, servicePeriod);
  const sDate = moment(selectedDate, "YYYY-MM-DD");
  const eDate = moment(expiryDate, "YYYY-MM-DD");

  const totalDays = Math.ceil(eDate.diff(sDate, "days"));
  const interval = Math.ceil(totalDays / dividedamtCharges);

  const dividedDates = [];
  const dividedamtDates = [new Date(selectedDate)];

  const sf = dividedamtCharges ? dividedamtCharges : "1";
  for (let i = 0; i < sf; i++) {
    const date = sDate.clone().add(interval * i, "days");
    dividedDates.push(date);
  }

  let addOnsCategory = selectedAddons.map((Ele) => Ele.addOnsCategory);

  const joinedPlanNames = addOnsCategory
    .concat(services?.serviceName)
    .join(",");
  const generateBookingId = (length) => {
    let bookingId = "";
    for (let i = 0; i < length; i++) {
      const randomDigit = Math.floor(Math.random() * 10);
      bookingId += randomDigit;
    }
    return bookingId;
  };
  const getServiceDetails = async () => {
    try {
      const response = await axios.get(`${ReactApi}/getservicedetails`);
      if (response.status === 200) {
        let filtredServices = response.data.servicedetails.filter(
          (itme) => itme.serviceID !== passseviceid
        );
        // console.log(filtredServices, "filtredServices");
        setallBookedServices(filtredServices);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeliveryAddress = async (eleId) => {
    const selectedAddress = DelivaryAddress.find((item) => item._id === eleId);
    setSelectedAddress(selectedAddress);
  };

  const handleBookservices1 = () => {
    setviewAddress(false);
    handleBookservices();
  };

  const handleBookservices = async () => {
    try {
      if (userData === null || userData === undefined) {
        alert("Please Login ");
        window.location.assign("/login");
      } else if (selectedDate === null || selectedDate == undefined) {
        alert("Please Select Date");
      } else if (SelectedAddress === null || SelectedAddress === undefined) {
        alert("Please Select Address");
        setviewAddress(true);
      } else {
        const generatedBookingId = generateBookingId(8);

        const config = {
          url: `/addservicedetails`,
          baseURL: ReactApi,
          headers: { "content-type": "application/json" },
          method: "post",
          data: {
            customer: userData,
            customerData: userData,
            dividedDates: dividedDates ? dividedDates : selectedDate,
            dividedamtCharges: dividedamtCharges,
            dividedamtDates: dividedamtDates,
            cardNo: userData?.cardNo,
            category: services?.category,
            contractType: pofferprice,
            service: services.serviceName,
            serviceCharge: firstFilteredElement?.pofferprice,
            dateofService: selectedDate,
            selectedSlotText: selectedSlotTextget,
            serviceFrequency: firstFilteredElement?.pservices,
            startDate: selectedDate,
            expiryDate: expiryDate,
            firstserviceDate: selectedDate,
            date: moment().format("YYYY-MM-DD"),
            time: moment().format("LT"),
            desc: joinedPlanNames,
            city: selectecity,
            userId: userData?._id,
            deliveryAddress: JSON.stringify(SelectedAddress),
            serviceImg: services?.serviceImg,
            AddOns: selectedAddons,
            discAmt: discountAmount,
            GrandTotal: grandTotal,
            paymentMode: selectedpaymentOption,
            TotalAmt: grandTotal
              ? parseFloat(firstFilteredElement?.pPrice) +
              parseFloat(grandTotal)
              : firstFilteredElement?.pPrice,
            couponCode: coupancode,
            totalSaved: discountAmount
              ? frequentAmount + discountAmount
              : frequentAmount,
            bookingId: generatedBookingId,
            serviceID: passseviceid,
            planid: bhk,
            qunty: Number(CountAddon) + Number(NumberOfQunatity),
            subtotal: subtotal,
            ServiceStatus: "Pending",
          },
        };

        await axios(config).then(function (response) {
          if (response.status === 200) {
            setSelectedAddress(null);
            setViewOrder(true);
          }
        });
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const DeliveryAddres = async (e) => {
    e.preventDefault();

    try {
      let deliveryAddress = {
        address: CustomerAddress,
        streetName: CustomerStreet,
        landmark: CustomerLandMark,
        state: CustomerState,
        city: CustomerCity,
        zipcode: CustomerZipCode,
        userId: userData._id,
      };
      const config = {
        url: `/addcustomerAddress`,
        baseURL: ReactApi,
        headers: { "content-type": "application/json" },
        method: "post",
        data: deliveryAddress,
      };

      await axios(config).then(function (response) {
        if (response.status === 200) {
          alert("Address Added Succesfully");
          setAddAddress(false);
          setCustomerAddress("");
          setCustomerStreet("");
          setCustomerLandMark("");
          setCustomerState("");
          setCustomerCity("");
          setCustomerZipCode("");
        }
      });
    } catch (error) {
      console.error("error", error);
      alert(error);
    }
  };

  const getDeliveryAddres = async () => {
    try {
      const response = await axios.get(`${ReactApi}/getalladress`);
      if (response.status === 200) {
        let Address = response?.data?.data
          ?.filter((ele) => ele?.userId === userData?._id)
          ?.map((ele) => ele);

        setDelivaryAddress(Address);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="cart_heading">
        <div className="container">
          <div className="row mb-4">
            <span className="col-md-1">
              <div className="row">
                <Link
                  style={{ textDecoration: "none" }}
                  to="/"
                  className="col-md-8 active"
                >
                  Home
                </Link>
                <span className="col-md-1">
                  <img src={RightArrow} alt="" />
                </span>
              </div>
            </span>

            <span className="col-md-2">
              <Link style={{ textDecoration: "none" }} to="/Servicedetails">
                Service Details
              </Link>
            </span>
          </div>
          <div className="cart_heading_content">
            <div className="text">
              <h3>View Service Cart</h3>
              <p> items added</p>
            </div>
          </div>
        </div>
      </div>

      <section className="cart_details">
        <div className="container">
          <div className="row">
            <div className="col-md-8 ">
              {cartData?.map((ele) => (
                <div className="cart_item_box">
                  <div className="item_title">{ele?.serviceName}</div>
                  <div className="item_content  ">
                    <div className="left">
                      <div className="left_img ">
                        <img
                          src={`${ImagApi}/service/${ele?.serviceImg}`}
                          alt=""
                        />
                      </div>

                      <div className="texts ">
                        {ele.morepriceData
                          ?.filter((item) => item?._id === bhk)
                          ?.map((filteredElement) => (
                            <div key={filteredElement?._id}>
                              {filteredElement?.pName}
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="col-md-5 m-auto ">
                      {ele.morepriceData
                        ?.filter((item) => item?._id === bhk)

                        ?.map((filteredElement) => (
                          <div className="row valudwidth1  m-auto">
                            <span className="col-md-6 m-auto valudwidth1 wrong_price ">
                              {filteredElement?.pPrice && "Rs."}{" "}
                              {filteredElement?.pPrice}
                            </span>
                            <span className="col-md-6 m-auto valudwidth1 real_price ">
                              {filteredElement?.pofferprice && "Rs."}{" "}
                              {filteredElement?.pofferprice}
                            </span>
                          </div>
                        ))}
                    </div>
                    <div className="col-md-2 ">
                      <Form.Control
                        placeholder="No Qty"
                        onChange={(e) => setNumberOfQunatity(e.target.value)}
                        type="number"
                        min={1}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="scheduleservice">
                <div className="title">Schedule Service</div>
                <div className="select_date">
                  <div className="text">Select the date</div>
                  <div className="date_selection">
                    {fourDates?.map((day, index) => {
                      const isChecked = isDateSelected(day);

                      return (
                        <label htmlFor={`checkbox-${index}`} key={index}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckboxSelect(day)}
                            name={`checkbox-${index}`}
                            id={`checkbox-${index}`}
                          />

                          <span
                            className={`inpt ${isChecked ? "matching" : ""}`}
                          >
                            {day?.dayName} - {day?.day}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="date row">
                    <button onClick={DatePicker} style={{ cursor: "pointer" }}>
                      {!selectedDate ? (
                        "Pick Date"
                      ) : (
                        <>
                          {" "}
                          <span className="me-3">
                            {moment(selectedDate).format("LL")}{" "}
                          </span>
                          <span className="clrg">Change</span>
                        </>
                      )}
                    </button>

                    <div className="date_picker"></div>
                  </div>
                  {datepicker && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        position: "absolute",
                        top: "16.4%",
                        left: "20%",
                        zIndex: "100",
                      }}
                    >
                      <Calendar
                        onChange={(date) => handleCalendarSelect(date)}
                        value={selectedDate}
                        calendarType="US"
                        tileDisabled={tileDisabled}
                        tileClassName={tileClassName}
                      />
                    </div>
                  )}
                </div>
                <div className="select_date">
                  <div className="text">Select the Slot</div>
                  <div className="date_selection">
                    {services?.store_slots?.map((slotItem) => {
                      const isSlotSelected = selectedSlotsID?.some(
                        (ele) =>
                          ele?.endTime === slotItem?.endTime &&
                          ele?.startTime === slotItem?.startTime
                      );

                      return (
                        <label key={slotItem.id} htmlFor={slotItem.id}>
                          <input type="checkbox" />

                          <span
                            className={`p-2 inpt ${isSlotSelected ? "matching" : ""
                              }`}
                            onClick={() =>
                              handleSlotSelect(
                                slotItem?.startTime,
                                slotItem?.endTime
                              )
                            }
                          >
                            {slotItem.startTime} {slotItem.endTime}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
              <Modal
                className="container"
                open={AddAddress}
                onClose={() => setAddAddress(false)}
              >
                <div className="personal_info">
                  {/* <div className="title">Personal Info</div> */}
                  <div>
                    <div className="address">
                      <div className="in_title">Address</div>
                      <div className="row">
                        <div className="col-md-6">
                          <input
                            type="text"
                            value={CustomerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            placeholder="Address"
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            value={CustomerStreet}
                            onChange={(e) => setCustomerStreet(e.target.value)}
                            placeholder="Street/Block/Apartment number"
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            value={CustomerLandMark}
                            onChange={(e) =>
                              setCustomerLandMark(e.target.value)
                            }
                            placeholder="Landmark"
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            value={CustomerState}
                            onChange={(e) => setCustomerState(e.target.value)}
                            placeholder="State"
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            value={CustomerCity}
                            onChange={(e) => setCustomerCity(e.target.value)}
                            placeholder="City"
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            value={CustomerZipCode}
                            onChange={(e) => setCustomerZipCode(e.target.value)}
                            placeholder="Zipcode"
                          />
                        </div>
                        <div className="col-md-2 m-auto ">
                          <button
                            className="row mb-3 p-2"
                            onClick={(e) => DeliveryAddres(e)}
                          >
                            Save
                          </button>
                        </div>
                        <div className="col-md-2 m-auto">
                          <button
                            className="row mb-3 p-2"
                            onClick={() => setAddAddress(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>

              <Modal open={viewAddress} onClose={() => setviewAddress(false)}>
                <div className="modal_wrapper">
                  <div className="modal_body">
                    <div className="hello">Delivery Address</div>
                    <div className="title center">Choose Address</div>
                    <div className="note">
                      {!DelivaryAddress ? (
                        <button onClick={handleAddAddres}>Add Address</button>
                      ) : (
                        <>
                          <p
                            className="container"
                            onClick={handleAddAddres}
                            style={{ color: "#3876BF" }}
                          >
                            <span className="col-md-1">
                              {" "}
                              <AddCircleIcon />
                            </span>
                            <span className="col-md-7"> Add a new address</span>
                          </p>{" "}
                          {DelivaryAddress?.map((ele) => (
                            <div className="row" key={ele._id}>
                              <div className="col-md-2">
                                {ele.address && (
                                  <input
                                    type="radio"
                                    defaultChecked={
                                      SelectedAddress === ele ? true : false
                                    }
                                    name="deliveryAddress"
                                    value={ele}
                                    onChange={() =>
                                      handleDeliveryAddress(ele._id)
                                    }
                                  />
                                )}
                              </div>
                              <div className="col-md-10">
                                <span>{ele.address}</span>
                                <span>
                                  {ele.streetName} {ele.landmark}
                                </span>
                                <span>{ele.city}</span>
                                <span>
                                  {ele.state} - {ele.zipcode}
                                </span>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                    <button
                      className="col-md-5 m-auto p-2 "
                      onClick={handleBookservices1}
                    >
                      BOOK
                    </button>
                  </div>
                </div>
              </Modal>

              <div className="payment">
                <div className="title">Payment Method</div>
                <div className="payment">
                  <div className="options">
                    <div className="remember">
                      <label
                        className="check_container"
                        checked={selectedpaymentOption === "option1"}
                        onClick={() => handleOptionClick("option1")}
                      >
                        Pay Online
                        <input type="radio" id="option1" />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                  </div>
                  <div className="options">
                    <div className="remember">
                      <label
                        checked={selectedpaymentOption === "option2"}
                        className="check_container"
                        onClick={() => handleOptionClick("option2")}
                      >
                        Cash on Delivery
                        <input type="radio" id="option2" />
                        <span className="checkmark"></span>
                      </label>
                    </div>{" "}
                  </div>{" "}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="addon_text">
                Add on Services booking is only valid after booking of Deep
                cleaning services
              </div>

              {filteredAddons?.map((addon) => (
                <div className="addon mt-3">
                  <div className="addon_box">
                    <div className="addon_image">
                      <img
                        src={`${ImagApi}/addOns/${addon?.addOnsImage}`}
                        alt=""
                      />
                    </div>
                    <div className="addon_details">
                      <div className="left">
                        <div className="title">{addon.addOnsCategory}</div>
                        <div>
                          <span className="fake_prices me-2">
                            Rs.{addon.addOnsPrice}
                          </span>
                          <span className="price">
                            {" "}
                            Rs.{addon.addOnsOfferPrice}
                          </span>
                        </div>
                      </div>
                      <div className="right">
                        <button onClick={() => handleAddon(addon)}>
                          <img src={Add} alt="" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="promo mt-5">
                <div className="title">Promo / Coupon Code</div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter Promocode*"
                    value={coupancode}
                    onChange={(e) => setCoupanCode(e.target.value)}
                  />

                  {!verified ? (
                    <button className="col-md-4 mx-1 p-1 row " onClick={handleVerify}>
                      Verify
                    </button>
                  ) : (
                    <p className="colr">Applied</p>
                  )}
                </div>
                {VoucherError && <p className="error">{VoucherError}</p>}
              </div>

              <div className="summary">
                <div className="title">Summary</div>
                <div className="summary_points">
                  <div className="key">Total Service </div>
                  <div className="value">
                    {Number(CountAddon) + Number(NumberOfQunatity)}
                  </div>
                </div>
                <div className="summary_points">
                  <div className="key"> Total Amount</div>
                  <div className="value1">Rs.{totalPrice}</div>
                </div>
                <div className="summary_points">
                  <div className="key">Sub Total</div>
                  <div className="value">Rs. {subtotal}</div>
                </div>
                <div className="summary_points">
                  <div className="key">Saved Amount</div>
                  <div className="value">Rs. {frequentAmount}</div>
                </div>
                <div className="summary_points">
                  <div className="key">AddOn Total</div>
                  <div className="value">Rs. {getaddonsSum}</div>
                </div>
                <div className="summary_points">
                  <div className="key">Desc </div>
                  <div className="value">Rs. {Discount}%</div>
                </div>
                <div className="summary_points">
                  <div className="key">Disc Amount</div>
                  <div className="value">Rs. {discountAmount}</div>
                </div>
                <div className="summary_points total">
                  <div className="key me-1 fs-5">Total Amount</div>
                  <div className="value fs-5">Rs. {grandTotal}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pay_wrapper">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="date">
                  {result}- <span className="colr"> {time}</span>
                </div>
              </div>
              <div className="col-md-2  btun">
                <Link
                  style={{ textDecoration: "none" }}
                  to="/booking"
                  state={{ idd: passseviceid, planBHk: bhk }}
                >
                  <button className="button1 p-2" type="submit">
                    View Booking
                  </button>
                </Link>
              </div>
              <div className="col-md-4  btun">
                <button
                  style={{ fontSize: "25px" }}
                  onClick={handleBookservices}
                  className="goto_pay p-2 button1 marlef"
                >
                  <span className="me-4  "> Pay</span>
                  <span className="">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(grandTotal)}
                  </span>{" "}
                </button>
              </div>
            </div>
          </div>
        </div>

        <Modal open={viewOrder} onClose={viewOrder}>
          <div className="modal_wrapper">
            <div className="modal_body">
              <div className="hello">Booking Successful!</div>
              <div className="title center">
                You have successfully made your booking.
              </div>
              <div className="note">
                You will receive an email containing all your booking details.
              </div>
              <Link
                style={{ textDecoration: "none" }}
                to="/booking"
                state={{ idd: passseviceid, planBHk: bhk }}
              >
                <button className="col-md-5 m-auto p-2 button1" type="submit">
                  View Order
                </button>
              </Link>
            </div>
          </div>
        </Modal>
      </section>
    </>
  );
}
