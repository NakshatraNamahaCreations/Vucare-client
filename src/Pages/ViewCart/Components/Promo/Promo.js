import React, { useEffect, useState } from "react";
import "./cartdetails.scss";
import Add from "./../../../../Assets/Images/add.svg";
import Added from "./../../../../Assets/Images/added.svg";
import ScheduleService from "../ScheduleService/ScheduleService";
import PersonalInfo from "../PersonalInfo/PersonalInfo";
import Payment from "../Payment/Payment";
import Promo from "../Promo/Promo";
import Summary from "../Summary/Summary";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import ItemImg from "./../../../../Assets/Images/item.jpg";
import Delete from "./../../../../Assets/Images/delete.svg";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../../../ServicesView/Components/AddOn/addon.scss";
import Card from "./../../../../Assets/Images/mastercard.svg";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "react-bootstrap";
import { SpinnerCircular } from "spinners-react";
import { useDispatch, useSelector } from "react-redux";
import { SaveCartData } from "../../../../dataStoreComponent/viewcartSlice";
// import { setstoreCity } from "../dataStoreComponent/citySlice";
export default function CartDetails() {
  const location = useLocation();
  const dispatch = useDispatch();
  const citys = useSelector((state) => state.city);

  const { ServiceIDD, NumberOfQunt, PriceID } = location.state || {};

  const cartItems = useSelector((state) => state?.viewCart?.CartItemsQnty);
  useEffect(() => {
    dispatch(SaveCartData(NumberOfQunt));
  }, [dispatch, NumberOfQunt]);

  const storedUserDataJSON = sessionStorage.getItem("userdata");

  const userData = JSON.parse(storedUserDataJSON);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [Service, setService] = useState([]);
  const navigate = useNavigate();
  const [pay, setPay] = useState(true);
  const [cartData, setCartData] = useState([]);
  const [viewOrder, setViewOrder] = useState(false);
  const [viewAddress, setviewAddress] = useState(false);
  const [AddAddress, setAddAddress] = useState(false);
  const [Voucher, setVoucher] = useState([]);
  const [coupancode, setCoupanCode] = useState(null);
  const [Discount, setDiscount] = useState(null);
  const [fourDates, setFourDates] = useState([]);

  const [datepicker, setdatePicker] = useState(false);

  // const [addOption, setAddOption] = useState(false);
  const [AddOn, setAddOn] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlotsID, setselectedSlotsID] = useState(null);

  const [CustomerAddress, setCustomerAddress] = useState("");
  const [CustomerPlatNo, setCustomerPlatNo] = useState("");
  const [CustomerLandMark, setCustomerLandMark] = useState("");
  const [saveAs, setSaveAs] = useState("");
  const [selectedpaymentOption, setselectedpaymentOption] = useState(null);

  const [DelivaryAddress, setDelivaryAddress] = useState(null);
  const [SelectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  useEffect(() => {
    getAllServices();
    getVoucher();
    getAddons();
    getDeliveryAddres();
  }, []);
  const handleAddAddres = () => {
    setAddAddress(true);
  };

  const gotoBooking = () => {
    navigate("/booking");
  };

  const getAllServices = async () => {
    try {
      setIsloading(true);
      let res = await axios.get(
        "https://api.vijayhomesuperadmin.in/api/userapp/getservices"
      );
      if (res.status === 200) {
        setService(res.data.service);
      }
    } catch (er) {
      console.log(er, "err while fetching data");
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    const filteredService = Service.filter((service) => {
      return service?._id === ServiceIDD;
    });

    setCartData(filteredService);
  }, [ServiceIDD, Service]);

  const getVoucher = async () => {
    try {
      setIsloading(true);
      let res = await axios.get(
        `https://api.vijayhomesuperadmin.in/api/userapp/getvoucher`
      );
      if (res.status === 200) {
        setVoucher(res.data.voucher);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsloading(false);
    }
  };

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

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const tileDisabled = ({ date }) => {
    const isPastDate = date <= yesterday;
    const isNextFourDate = fourDates.some((d) => {
      const dDate = new Date(d.year, d.month - 1, d.day);
      return date.toDateString() === dDate.toDateString();
    });

    return isPastDate || isNextFourDate;
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
  let services = Service?.filter((ele, index) => {
    return ele?._id === ServiceIDD;
  });
  const cityname = citys?.city?.toLowerCase();

  const filteredServices = services?.filter((ele) =>
    ele?.store_slots?.some((slot) =>
      slot?.slotCity?.toLowerCase()?.includes(cityname)
    )
  );

  // console.log(cityname, "cityname");
  // console.log(filteredServices, "filteredServices");
  const getAddons = async () => {
    try {
      setIsloading(true);
      let res = await axios.get(
        `https://api.vijayhomesuperadmin.in/api/userapp/getServiceAddOns`
      );
      if (res.status === 200) {
        setAddOn(res?.data?.AddOns);
        // .filter((i) => i.addOnsCategory === ServiceIDD)
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsloading(false);
    }
  };

  const handleCheckboxSelect = (day) => {
    const formattedDate = `${day.year}-${day.month}-${day.day}`;
    const selectedDate = moment(formattedDate, "YYYY-MM-DD");

    setSelectedDate(selectedDate.format("LL"));
  };

  const handleCalendarSelect = (date) => {
    const selectedDate = moment.isMoment(date) ? date.toDate() : date;
    setSelectedDate(selectedDate);
    setdatePicker(false);
  };

  const handleSlotSelect = (starttime, endtime) => {
    setselectedSlotsID([{ startTime: starttime, endTime: endtime }]);
  };

  const monthsMap = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    10: "October",
    11: "November",
    12: "December",
  };
  const isDateSelected = (day) => {
    if (!selectedDate) return false; // If selectedDate is null or undefined, return false

    const { day: dayNumber, month, year } = day;
    const monthName = monthsMap[month];

    if (!monthName) {
      console.error("Invalid month number:", month);
      return false;
    }

    const formattedDay = moment(
      `${monthName} ${dayNumber}, ${year}`,
      "MMMM D, YYYY"
    ).format("LL");

    return formattedDay === selectedDate;
  };
  const isSurvey = services?.some((ele) =>
    ele?.serviceDirection?.includes("Survey")
  );
  let isEnquiry = services?.some((ele) =>
    ele?.serviceDirection?.includes("Enquiry")
  );

  let cate = services?.map((ele) => ele?.serviceName?.toLowerCase());
  const filteredAddons = AddOn?.filter((addon) => {
    const addonCategory = addon?.addOnsCategory?.toLowerCase();
    return addonCategory?.includes(cate);
  });

  const serviceid = services?.map((ele) => ele);

  const handleDeliveryAddress = async (e, eleId) => {
    e.preventDefault();
    const selectedAddress = DelivaryAddress.find((item) => item._id === eleId);
    setSelectedAddress(selectedAddress);
  };

  const handleBookservices1 = () => {
    setviewAddress(false);
    handleBookservices();
  };
  // console.log(userData, "userData");
  const addcustomeraddresss = async () => {
    // e.preventDefault();

    try {
      const config = {
        url: "/addcustomeraddress",
        method: "post",
        baseURL: "https://api.vijayhomesuperadmin.in/api",
        headers: { "content-type": "application/json" },
        data: {
          userId: userData?._id,
          address: SelectedAddress,
          saveAs: saveAs,
          landmark: CustomerLandMark,
          platNo: CustomerPlatNo,
        },
      };
      await axios(config).then(function (response) {
        if (response.status === 200) {
          alert("Address Added Succesfully");
          setAddAddress(false);
          setCustomerAddress("");
          setCustomerPlatNo("");
          setCustomerLandMark("");

          setSaveAs("");
          // setCustomerCity("");
          // setCustomerZipCode("");
        }
      });
    } catch (error) {
      console.error(error);
      alert(
        "Address not added, Please delete one address to update another address "
      );
    }
  };
  const getDeliveryAddres = async () => {
    try {
      const response = await axios.get(
        "https://api.vijayhomesuperadmin.in/api/getcustomeraddress"
      );
      if (response.status === 200) {
        let Address = response?.data?.customerAddress

          ?.filter((ele) => ele?.userId === userData?._id)
          .map((ele) => ele);

        setDelivaryAddress(Address);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleAddon = (addon) => {
    setSelectedAddons((prevAddons) =>
      prevAddons.concat(Array.isArray(addon) ? addon : [addon])
    );
  };

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

  const getColorForNthChild = (index) => {
    const colors = [
      "rgb(51, 165, 127)",
      "rgb(53, 165, 51)",
      "rgb(166, 106, 21)",
    ];

    return colors[index % colors?.length];
  };

  const handlegetcoupan = (e, clickedId, desc) => {
    e.preventDefault();
    setCoupanCode(clickedId);
    setDiscount(desc);
  };

  const addenquiry = async (e) => {
    e.preventDefault();

    try {
      const formattedDate = moment().format("MM-DD-YYYY");
      if (userData === null || userData === undefined) {
        alert("Please Login ");
      } else {
        if (SelectedAddress === null || SelectedAddress === undefined) {
          alert("Please Select Address");
          setviewAddress(true);
        } else {
          const config = {
            url: "/addenquiry",
            method: "post",
            baseURL: "https://api.vijayhomesuperadmin.in/api",

            headers: { "content-type": "application/json" },
            data: {
              enquirydate: formattedDate,
              name: userData?.customerName,
              contact1: userData?.mainContact,
              email: userData?.email,
              address: { SelectedAddress },
              city: userData?.city,
              reference1: "Website",
              intrestedfor: serviceid?.serviceName?.[0],
              serviceID: serviceid?._id?.[0],
              time: selectedSlotTextget,
            },
          };
          await axios(config).then(function (response) {
            if (response.status === 200) {
              AddEnquiryfollowup(response.data.data);
              setviewAddress(!viewAddress);
              setSelectedAddress(" ");
            }
          });
        }
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(error.response.data.error);
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  const AddEnquiryfollowup = async (data) => {
    let responseData;

    try {
      if (serviceid?.serviceDirection?.includes("Survey")) {
        responseData = "Survey";
      } else {
        responseData = "New";
      }
      const config = {
        url: "/addenquiryfollowup",
        method: "post",
        baseURL: "https://api.vijayhomesuperadmin.in/api",

        headers: { "content-type": "application/json" },
        data: {
          EnquiryId: data?.EnquiryId,
          category: data?.category,
          response: responseData,
          nxtfoll: selectedDate,
        },
      };
      await axios(config).then(function (response) {
        if (response.status === 200) {
          alert("Service Booked Succesfully  ");
        }
      });
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(error.response.data.error);
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  const selectedSlotTextget = selectedSlotsID
    ?.map((slot) => `${slot?.startTime} - ${slot?.endTime}`)
    ?.join(", ");
  // ===================================  calculation part ===================================

  const calculateExpiryDate = (selectedDate, servicePeriod) => {
    let monthsToAdd = 0;

    // Determine the number of months to add based on service period
    if (servicePeriod === "monthly") {
      monthsToAdd = 1;
    } else if (servicePeriod === "quart") {
      monthsToAdd = 3;
    } else if (servicePeriod === "half") {
      monthsToAdd = 6;
    } else if (servicePeriod === "year") {
      monthsToAdd = 12;
    }

    // Calculate the expiryDate by adding the months
    const expiryDate = moment(selectedDate)
      .add(monthsToAdd, "months")
      .format("YYYY-MM-DD");

    return expiryDate;
  };

  const dividedDates = [];
  const dividedamtDates = [new Date(selectedDate)];

  let ServicePans = cartData?.map((item) =>
    item.morepriceData?.filter((ele) => ele?._id === PriceID).map((ele) => ele)
  );
  const firstFilteredElement = ServicePans?.[0]?.[0];

  const servicePeriod = firstFilteredElement?.servicePeriod;
  const serviceFrequency = firstFilteredElement?.pservices;

  const total = ServicePans.reduce((accumulator, item) => {
    const subtotal = parseFloat(item.oferprice) * cartItems;
    return accumulator + subtotal;
  }, 0);
  let FreqensaveAmt = 0;
  const calculateSubtotal = (cartData, cartItems) => {
    let subtotal = 0;
    let frequentAmount = 0;
    let totalPrice = 0;
    cartData?.forEach((ele) => {
      ele?.morepriceData
        .filter((item) => item?._id === PriceID)
        ?.forEach((filteredElement) => {
          const price = parseFloat(filteredElement?.pofferprice) || 0;
          const RealPrice = parseFloat(filteredElement?.pPrice) || 0;
          FreqensaveAmt =
            parseInt(RealPrice) * Number(cartItems) -
            parseInt(price) * Number(cartItems);
          subtotal += parseInt(price) * Number(cartItems);
          frequentAmount += Number(FreqensaveAmt);
          totalPrice += RealPrice * Number(cartItems);
        });
    });

    return { subtotal, frequentAmount, totalPrice };
  };

  const { subtotal, frequentAmount, totalPrice } = calculateSubtotal(
    cartData,
    ServiceIDD
  );
  const discountAmount = (Number(subtotal) * Number(Discount)) / 100;
  const grandTotal = total
    ? discountAmount
      ? parseFloat(firstFilteredElement?.pofferprice) +
        parseFloat(total) -
        discountAmount
      : parseFloat(firstFilteredElement?.pofferprice) + parseFloat(total)
    : discountAmount
    ? firstFilteredElement?.pofferprice - discountAmount
    : firstFilteredElement?.pofferprice;

  const expiryDate = calculateExpiryDate(selectedDate, servicePeriod);
  const sDate = moment(selectedDate, "YYYY-MM-DD");
  const eDate = moment(expiryDate, "YYYY-MM-DD");

  let k = Voucher.filter((ele) =>
    ele?.category
      ?.toLowerCase()
      ?.includes(services?.map((ele) => ele?.category?.toLowerCase()))
  );

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

  const currentDate = new Date();

  const dividedamtCharges = [firstFilteredElement?.pofferprice];
  const pofferprice = firstFilteredElement?.pofferprice;
  const sf = dividedamtCharges ? dividedamtCharges : "1";
  // const expiryDate = calculateExpiryDate(selectedDate, servicePeriod);

  const totalDays = Math.ceil(eDate.diff(sDate, "days"));
  const interval = Math.ceil(totalDays / dividedamtCharges);

  // for (let i = 0; i < amtFrequency; i++) {
  //   const date = sDate.clone().add(intervalamt * i, "days");
  //   dividedamtDates.push(date);
  // }

  for (let i = 0; i < sf; i++) {
    const date = sDate.clone().add(interval * i, "days");
    dividedDates.push(date);
  }

  let addOnsCategory = selectedAddons.map((ele) => ele?.addOnsCategory);

  const joinedPlanNames = addOnsCategory
    .concat(serviceid?.[0]?.serviceName)
    .join(",");

  const handleBookservices = async () => {
    // e.preventDefault();
    // try {
    //   if (userData === null || userData === undefined) {
    //     alert("Please Login ");
    //   } else if (SelectedAddress === null || SelectedAddress === undefined) {
    //     alert("Please Select Address");
    //     setviewAddress(true);
    //   } else {
    //     const config = {
    //       url: `/addservicedetails`,
    //       baseURL: "https://api.vijayhomesuperadmin.in/api",
    //       headers: { "content-type": "application/json" },
    //       method: "post",
    //       data: {
    //         customer: userData,
    //         customerData: userData,
    //         // dividedDates: dividedDates ? dividedDates : selectedDate,
    //         dividedamtCharges: dividedamtCharges,
    //         dividedamtDates: dividedamtDates,
    //         cardNo: userData?.cardNo,
    //         category: serviceid?.[0]?.category,
    //         contractType: !pofferprice ? "One Time" : "AMC",
    //         service: serviceid?.[0]?.serviceName,
    //         serviceCharge: firstFilteredElement?.pofferprice,
    //         dateofService: selectedDate,
    //         selectedSlotText: selectedSlotTextget,
    //         serviceFrequency: firstFilteredElement?.pservices,
    //         startDate: selectedDate,
    //         expiryDate: expiryDate,
    //         firstserviceDate: selectedDate,
    //         date: moment().format("YYYY-MM-DD"),
    //         time: moment().format("LT"),
    //         type: "Website",
    //         desc: joinedPlanNames,
    //         city: citys?.city,
    //         userId: userData?._id,
    //         deliveryAddress: { SelectedAddress },
    //         serviceImg: serviceid?.serviceImg,
    //         AddOns: selectedAddons,
    //         // discAmt: discountAmount,
    //         // GrandTotal: grandTotal,
    //         paymentMode: !selectedpaymentOption
    //           ? "online"
    //           : selectedpaymentOption,
    //         // TotalAmt: grandTotal
    //         // ? parseFloat(firstFilteredElement.pPrice) + parseFloat(grandTotal)
    //         // : firstFilteredElement.pPrice,
    //         couponCode: coupancode,
    //         // totalSaved: discountAmount
    //         // ? frequentAmount + discountAmount
    //         // : frequentAmount,
    //       },
    //     };
    //     await axios(config).then(function (response) {
    //       if (response.status === 200) {
    //         // alert("added Succesfully");
    //         setViewOrder(!viewOrder);
    //         setSelectedAddress(" ");
    //       }
    //     });
    //   }
    // } catch (error) {
    //   console.error("error", error);
    // }
    try {
      if (userData === null || userData === undefined) {
        if (SelectedAddress === null || SelectedAddress === undefined) {
          if (!SelectedAddress) {
            alert("Please Select Address");
            setviewAddress(true);
          }
          if (grandTotal < 700) {
            alert("Grand total should be at least 700");
          } else {
            setViewOrder(true);
            userData.voucherCode = coupancode;
            const config = {
              url: "https://api.vijayhomesuperadmin.in/api/addservicedetails",
              method: "post",
              headers: { "content-type": "application/json" },
              data: {
                customerData: userData,
                customerName: userData.customerName,
                email: userData.email,
                dividedDates: dividedDates ? dividedDates : selectedDate,
                dividedamtCharges: dividedamtCharges,
                dividedamtDates: dividedamtDates,
                cardNo: userData?.cardNo,
                category: serviceid?.[0]?.category,
                contractType: !firstFilteredElement?.pservices
                  ? "One Time"
                  : "AMC",
                service: serviceid?.[0]?.serviceName,
                serviceID: serviceid?.[0]?._id,
                serviceCharge: grandTotal,
                dateofService: selectedDate,
                selectedSlotText: selectedSlotTextget,
                serviceFrequency: firstFilteredElement?.pservices,
                startDate: selectedDate,
                planName: firstFilteredElement?.pName,
                expiryDate: expiryDate,
                firstserviceDate: selectedDate,
                date: moment().format("YYYY-MM-DD"),
                time: moment().format("LT"),
                type: "userapp",
                desc: joinedPlanNames,
                city: citys.city,
                userId: userData?._id,
                deliveryAddress: userData,
                serviceImg: serviceid?.[0]?.serviceImg,
                AddOns: selectedAddons,
                discAmt: discountAmount,
                GrandTotal: grandTotal,
                couponCode: coupancode,

                paymentMode: !selectedpaymentOption
                  ? "online"
                  : selectedpaymentOption,
                TotalAmt: grandTotal
                  ? parseFloat(firstFilteredElement.pPrice) +
                    parseFloat(grandTotal)
                  : firstFilteredElement.pPrice,

                totalSaved: discountAmount
                  ? frequentAmount + discountAmount
                  : frequentAmount,
              },
            };
            await axios(config).then(function (response) {
              if (response.status === 200) {
                setViewOrder(!viewOrder);
                setSelectedAddress(" ");
                // const selectedResponse = whatsappdata[0];
                // deleteAllCartItems();
                // dispatch(clearCart());
                // setModalVisible1(false);
                // advp(response.data.data);
                // makeApiCall(selectedResponse, user.mainContact);
                // AsyncStorage.setItem(
                //   "user",
                //   JSON.stringify(response.data.user)
                // );
              }
            });
          }
        } else if (SelectedAddress) {
          if (!userData) {
            alert("Please select the address  ");
          }
          if (grandTotal < 1500) {
            alert("Grand total should be at least 700");
          } else {
            setviewAddress(true);
            const config = {
              url: "https://api.vijayhomesuperadmin.in/api/addservicedetails",
              method: "post",
              headers: { "content-type": "application/json" },
              data: {
                customerData: {
                  _id: userData._id,
                  cardNo: userData?.cardNo,
                  customerName: userData.customerName,
                  email: userData.email,
                  mainContact: userData?.mainContact,
                  type: userData?.type,
                  city: citys.city,
                },
                customerName: userData.customerName,
                email: userData.email,
                dividedDates: dividedDates ? dividedDates : selectedDate,
                dividedamtCharges: dividedamtCharges,
                dividedamtDates: dividedamtDates,
                cardNo: userData?.cardNo,
                category: serviceid?.[0]?.category,
                contractType: !firstFilteredElement?.pservices
                  ? "One Time"
                  : "AMC",
                service: serviceid?.[0]?.serviceName,
                serviceID: serviceid?.[0]?._id,
                serviceCharge: grandTotal,
                dateofService: selectedDate,
                selectedSlotText: selectedSlotTextget,
                serviceFrequency: firstFilteredElement?.pservices,
                startDate: selectedDate,
                planName: firstFilteredElement?.pName,
                expiryDate: expiryDate,
                firstserviceDate: selectedDate,
                date: moment().format("YYYY-MM-DD"),
                time: moment().format("LT"),
                type: "userapp",
                desc: joinedPlanNames,
                city: citys.city,
                userId: userData?._id,
                deliveryAddress: SelectedAddress,
                serviceImg: serviceid?.[0]?.serviceImg,
                AddOns: selectedAddons,
                discAmt: discountAmount,
                GrandTotal: grandTotal,

                paymentMode: selectedpaymentOption,
                TotalAmt: total
                  ? parseFloat(firstFilteredElement.pPrice) + parseFloat(total)
                  : firstFilteredElement.pPrice,
                couponCode: coupancode,
                totalSaved: discountAmount
                  ? frequentAmount + FreqensaveAmt + discountAmount
                  : frequentAmount + FreqensaveAmt,
              },
            };
            await axios(config).then(function (response) {
              if (response.status === 200) {
                setViewOrder(!viewOrder);
                setSelectedAddress(" ");
                // const selectedResponse = whatsappdata[0];
                // deleteAllCartItems();
                // dispatch(clearCart());
                // setModalVisible1(false);
                // advp(response.data.data);
                // makeApiCall(selectedResponse, user.mainContact);
                // AsyncStorage.setItem(
                //   "user",
                //   JSON.stringify(response.data.user)
                // );
              }
            });
          }
        } else {
          alert("Please provide customer name and email  ");
          setviewAddress(false);
        }
      } else {
        alert("User data not found. Please log in or create a user account.");
        setviewAddress(false);
      }
    } catch (error) {
      console.error(error);
      setviewAddress(false);
      alert(" Not Added");
    }
  };

  return (
    <>
      <div className="cart_heading">
        <div className="container">
          <div className="cart_heading_content">
            <div className="text">
              <h3>View Service Cart</h3>Total Service
              <p> items added</p>
            </div>
            {/* <Counters /> */}
            {/* <div className="action">
              <button className="button1">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14.7368 9.26313H1.26316C0.928829 9.26093 0.608821 9.12713 0.372409 8.89072C0.135998 8.65431 0.00220686 8.3343 0 7.99997C0.00220686 7.66565 0.135998 7.34564 0.372409 7.10923C0.608821 6.87281 0.928829 6.73902 1.26316 6.73682H14.7368C15.0712 6.73902 15.3912 6.87281 15.6276 7.10923C15.864 7.34564 15.9978 7.66565 16 7.99997C15.9978 8.3343 15.864 8.65431 15.6276 8.89072C15.3912 9.12713 15.0712 9.26093 14.7368 9.26313Z" />
                  <path d="M6.73684 14.7368L6.73684 1.26313C6.73905 0.928803 6.87284 0.608795 7.10925 0.372383C7.34566 0.135972 7.66567 0.00218104 8 -2.58044e-05C8.33433 0.00218107 8.65434 0.135972 8.89075 0.372383C9.12716 0.608795 9.26095 0.928803 9.26316 1.26313L9.26316 14.7368C9.26095 15.0711 9.12716 15.3912 8.89075 15.6276C8.65434 15.864 8.33433 15.9978 8 16C7.66567 15.9978 7.34566 15.864 7.10925 15.6276C6.87284 15.3912 6.73905 15.0711 6.73684 14.7368Z" />
                </svg>
                Add More Service
              </button>
            </div> */}
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="row m-auto text-center" style={{ height: "100vh" }}>
          <div className="col-md-4"></div>
          <div className="col-md-4 m-auto ">
            <SpinnerCircular
              size={90}
              thickness={87}
              speed={80}
              color="rgba(27, 22, 22, 1)"
              secondaryColor="rgba(214, 191, 91, 1)"
            />
          </div>

          <div className="col-md-4"></div>
        </div>
      ) : (
        <section className="cart_details">
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                {cartData?.map((ele) => (
                  <div className="cart_item_box">
                    <div className="item_title">{ele?.serviceName}</div>
                    <div className="row  m-auto item_content">
                      <div className="col-md-5  m-auto left">
                        <div className="left_img">
                          <img
                            src={`https://api.vijayhomesuperadmin.in/service/${ele?.serviceImg}`}
                            alt=""
                          />
                        </div>
                        <div className="texts">
                          {ele?.morepriceData
                            .filter((item) => PriceID === item?._id)
                            .flatMap((filteredElement) => (
                              <div key={filteredElement?._id}>
                                {filteredElement.pName}
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="col-md-2  m-auto">
                        <Button variant="secondary" className="row p-0">
                          <span
                            // onClick={() => dispatch(decrement())}
                            className="me-2 fs-5 p-0"
                          >
                            -
                          </span>

                          <span className="me-2 ms-2 fs-5 p-0">
                            {cartItems}{" "}
                          </span>
                          <span
                            className="ms-2 fs-5 p-0"
                            // onClick={() => dispatch(increment())}
                          >
                            +
                          </span>
                        </Button>
                      </div>
                      <div className="col-md-4  m-auto">
                        {/* <div className="row right"> */}
                        {ele?.morepriceData
                          .filter((item) => PriceID === item?._id)
                          .flatMap((filteredElement) => (
                            <div
                              key={filteredElement.pName}
                              className="row price-container"
                            >
                              <div className="col-md-6 m-auto  wrong_price">
                                Rs. {filteredElement.pPrice}
                              </div>
                              <div className="col-md-6 m-auto real_price">
                                Rs. {filteredElement.pofferprice}
                              </div>
                            </div>
                          ))}
                        {/* </div> */}
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
                        const isDefaultChecked = isDateSelected(day);

                        return (
                          <label htmlFor={index} key={index}>
                            <input
                              type="checkbox"
                              // defaultChecked={isDefaultChecked}
                              name=""
                              id={day?.day}
                            />

                            <span
                              className={`inpt ${
                                isDefaultChecked ? "matching" : ""
                              }`}
                              onClick={() => handleCheckboxSelect(day)}
                            >
                              {day?.dayName}- {day?.day}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    <div className="date">
                      <button
                        onClick={DatePicker}
                        style={{ cursor: "pointer" }}
                      >
                        Pick Date
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
                          top: "10%",
                          left: "20%",
                          zIndex: "100",
                        }}
                      >
                        <div>
                          <Calendar
                            onChange={(date) => handleCalendarSelect(date)}
                            value={selectedDate}
                            calendarType="US"
                            tileDisabled={tileDisabled}
                            tileClassName={tileClassName}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="select_date">
                    <div className="text">Select the Slot</div>

                    <div className="date_selection">
                      {filteredServices?.map((ele) =>
                        ele?.store_slots?.map((slotItem) => {
                          const isSlotSelected = selectedSlotsID?.some(
                            (ele) =>
                              ele?.endTime === slotItem?.endTime &&
                              ele?.startTime === slotItem?.startTime
                          );

                          return (
                            <label key={slotItem.id} htmlFor={slotItem.id}>
                              <input type="checkbox" />

                              <span
                                className={`p-2 inpt ${
                                  isSlotSelected ? "matching" : ""
                                }`}
                                onClick={() =>
                                  handleSlotSelect(
                                    slotItem?.startTime,
                                    slotItem?.endTime
                                  )
                                }
                              >
                                {slotItem.startTime} - {slotItem.endTime}
                              </span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                <Modal open={viewAddress} onClose={viewAddress}>
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
                              <span className="col-md-7">
                                {" "}
                                Add a new address
                              </span>
                            </p>{" "}
                            {DelivaryAddress.map((ele, index) => (
                              <div className="row" key={ele?._id}>
                                <div className="col-md-2">
                                  {ele?._id && (
                                    <input
                                      type="radio"
                                      defaultChecked={
                                        SelectedAddress === ele ? true : false
                                      }
                                      name="deliveryAddress"
                                      value={ele}
                                      onChange={(e) =>
                                        handleDeliveryAddress(e, ele?._id)
                                      }
                                    />
                                  )}
                                </div>

                                <div className="col-md-10">
                                  <span>{ele?.address}</span>
                                  <span>{ele?.landmark}</span>
                                  <span>{ele?.platNo}</span>
                                  <span>{ele?.saveAs}</span>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                      <button className="p-2 " onClick={handleBookservices1}>
                        BOOK
                      </button>
                    </div>
                  </div>
                </Modal>

                {isSurvey || isEnquiry ? null : (
                  <div className="payment">
                    <div className="title">Payment Method</div>
                    <div className="payment">
                      <div className="options">
                        <div className="remember">
                          <label
                            className="check_container"
                            onClick={() => handleOptionClick("option1")}
                          >
                            Pay Online
                            <input type="radio" id="option1" />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                      </div>
                      {/* <div className="options price">
                      <div className="remember">
                        <label
                          className="check_container"
                          onClick={() => handleOptionClick("option2")}
                        >
                          Pay from Wallet
                          <input type="radio" id="option2" />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      <div className="p_text">Rs 6000</div>
                    </div> */}
                      <div className="options">
                        <div className="remember">
                          <label
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
                    {/* <form autoComplete="off">
                    <div className="card_details">
                      <div className="row">
                        <div className="col-md-6">
                          <input
                            type="text"
                            onChange={(e) => setcardNumber(e.target.value)}
                            placeholder="Card Number"
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            onChange={(e) => setNameOnCard(e.target.value)}
                            placeholder="Name on Card"
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            onChange={(e) => setcardexpiryDate(e.target.value)}
                            placeholder="Exp. Date*"
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            onChange={(e) => setcvv(e.target.value)}
                            placeholder="CVV"
                          />
                        </div>
                      </div>
                    </div>
                  </form> */}
                    {/* <div className="card_no">
                    <div className="remember">
                      <label className="check_container">
                        <div className="card_no_wrapper">
                          <img src={Card} alt="" />
                          <span className="hidden_no">************</span>
                          <span className="highlight">436</span>
                        </div>
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                  </div> */}
                  </div>
                )}
              </div>
              {isSurvey | isEnquiry ? null : (
                <div className="col-md-4 ">
                  {filteredAddons.length > 0 && (
                    <>
                      <div className="addon_title">Add On Services</div>
                      <div className="addon_text">
                        Add on Services booking is only valid after booking of
                        Deep cleaning services
                      </div>
                    </>
                  )}

                  <div
                    className={`${
                      filteredAddons.length > 0 ? "addoncontr" : ""
                    } mt-4`}
                  >
                    {filteredAddons?.map((addon) => (
                      <div className="addon  ">
                        <div className="addon_box">
                          <div className="addon_image">
                            <img
                              src={`https://api.vijayhomesuperadmin.in/addOns/${addon?.addOnsImage}`}
                              alt=""
                            />

                            {/* <div className="offer"> vhs</div> */}
                          </div>
                          <div className="addon_details">
                            <div className="left">
                              <div className="title">
                                {addon.addOnsCategory}
                              </div>
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
                  </div>
                  <div className={`${k.length > 0 ? "addoncontr" : ""} `}>
                    {k?.map((ele, index) => (
                      <div className="col-md-10 mt-4 slide m-auto" key={index}>
                        <div
                          style={{ textDecoration: "none", color: "black" }}
                          className=" jf_box shadow bg-white rounded"
                        >
                          <p>
                            <span
                              style={{ color: getColorForNthChild(index) }}
                              className="code1"
                            >
                              {ele?.discountPercentage}
                            </span>{" "}
                            <span>{ele?.desc}</span>
                          </p>

                          <div
                            className="code m-auto p-2"
                            style={{
                              backgroundColor: getColorForNthChild(index),
                            }}
                          >
                            <p
                              style={{ cursor: "pointer" }}
                              className="m-auto "
                              onClick={(e) =>
                                handlegetcoupan(
                                  e,
                                  ele?.voucherCode,
                                  ele?.discountPercentage
                                )
                              }
                            >
                              GET COUPON CODE
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="promo mt-5 ">
                    <div className="title">Promo / Coupon Code</div>
                    <form autoComplete="off">
                      <input
                        type="text"
                        value={coupancode}
                        placeholder="Enter Promocode*"
                      />
                      {/* <button className="button1" type="submit">
                      Submit Now
                    </button> */}
                    </form>
                  </div>
                  <div className="summary">
                    <div className="title">Summary</div>
                    <div className="summary_points">
                      <div className="key">Total Service </div>
                      <div className="value">{Number(cartItems)}</div>
                    </div>
                    <div className="summary_points">
                      <div className="key"> Total Amount</div>
                      <div className="value1">Rs.{Number(totalPrice)}</div>
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
                      {/* <div className="value">Rs. {discountAmount}</div> */}
                    </div>
                    <div className="summary_points total">
                      <div className="key me-1 fs-5">Total Amount</div>
                      {/* <div className="value fs-5">Rs. {grandTotal}</div> */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isSurvey || isEnquiry ? (
            <div className="pay_wrapper">
              <div className="container">
                <div className="row">
                  <div className="col-md-8">
                    <div className="date">
                      Fri , 24 Feb, 2023 - <span> 9:30 am</span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <button
                      style={{ fontSize: "25px" }}
                      onClick={addenquiry}
                      className="goto_pay p-3 button1"
                    >
                      BOOK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {pay && (
                <div className="pay_wrapper">
                  <div className="container">
                    <div className="row">
                      <div className="col-md-8">
                        <div className="date">
                          Fri , 24 Feb, 2023 - <span> 9:30 am</span>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <button
                          style={{ fontSize: "25px" }}
                          onClick={handleBookservices}
                          className="goto_pay p-3 button1"
                        >
                          <span className="me-4">Pay</span>
                          <span> {grandTotal}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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

                <button className="button1" type="submit" onClick={gotoBooking}>
                  View Order
                </button>
              </div>
            </div>
          </Modal>

          <Modal className="container" open={AddAddress} onClose={AddAddress}>
            <div className="personal_info">
              <div>
                <div className="address">
                  <div className="in_title">Address</div>
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        type="text"
                        // as="textarea"
                        value={CustomerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Address"
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        type="text"
                        value={CustomerLandMark}
                        onChange={(e) => setCustomerLandMark(e.target.value)}
                        placeholder="Landmark"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        value={CustomerPlatNo}
                        onChange={(e) => setCustomerPlatNo(e.target.value)}
                        placeholder="plat No."
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        type="text"
                        value={saveAs}
                        onChange={(e) => setSaveAs(e.target.value)}
                        placeholder="save As"
                      />
                    </div>
                    <div className="col-md-2 m-auto ">
                      <button
                        className="row mb-3 p-2"
                        onClick={(e) => addcustomeraddresss(e)}
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
        </section>
      )}
    </>
  );
}