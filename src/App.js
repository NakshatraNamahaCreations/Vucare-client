import React, { useEffect } from "react";

import { Routes, Route } from "react-router-dom";

import Login from "./Component/Login/Login";
import Register from "./Component/Register/Register";
import Career from "./Pages/Career/Career";

import ResetPassword from "./Component/ResetPassword/ResetPassword";

import ViewCart from "./Pages/ViewCart/ViewCart";
import Booking from "./Pages/Booking/Booking";
import BookingDetails from "./Pages/BookingDetail/BookingDetails";
import Servicedetails from "./Component/Servicedetails";
import Layout from "./Component/Layout";
import Aboutus from "./Aboutus";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="login" element={<Login />} />
        <Route path="Register" element={<Register />} />
        <Route path="career" element={<Career />} />
        <Route path="resetpassword" element={<ResetPassword />} />
        <Route path="viewcart" element={<ViewCart />} />
        <Route path="booking" element={<Booking />} />
        <Route path="bookingdetails" element={<BookingDetails />} />
        <Route path="servicedetails" element={<Servicedetails />} />
        <Route path="about-us" element={<Aboutus />} />
      </Routes>
    </>
  );
}

export default App;
