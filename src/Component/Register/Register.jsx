import React, { useState, useEffect } from "react";
import "../Register/register.scss";
// import { ReactApi } from "../../api";

import Modal from "@mui/material/Modal";
import axios from "axios";
import NabarCompo from "../navbar";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Form } from "react-bootstrap";

export default function Register() {
  const ReactApi = process.env.REACT_APP_API_URL;
  const ImagApi = process.env.REACT_APP_IMAGE_API_URL;
  const [name, setname] = useState("");
  const [Email, setemail] = useState("");
  const [phonenumber, setphonenumber] = useState("");
  const [Password, setpassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [customrProfile, setcustomrProfile] = useState("");

  const [openOTP, setOpenOTP] = useState(false);
  const handleOTPModal = () => {
    setOpenOTP(false);
  };
  const [City, setCity] = useState([]);
  const [finished, setFinished] = useState(false);

  const getStart = () => {
    setFinished(!finished);
    setOpenOTP(false);
  };
  useEffect(() => {
    getCity();
  }, []);

  const AddCustomers = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("customerprofile", customrProfile);
    formdata.append("customerName", name);
    formdata.append("mainContact", phonenumber);
    formdata.append("email", Email);
    formdata.append("city", selectedOption.city);

    formdata.append("password", Password);
    formdata.append("cpassword", ConfirmPassword);
    if (!name || !Email || !phonenumber || !Password || !ConfirmPassword) {
      alert("Please enter all details");
    } else {
      try {
        const config = {
          url: "/addcustomer",
          method: "post",
          baseURL: `${ReactApi}`,
          headers: { "Content-Type": "multipart/form-data" },
          data: formdata,
        };

        let res = await axios(config);

        if (res.status === 200) {
          alert("You have signed in succesfully");
          window.location.href = "/login";
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          alert(err.response.data.error);
        } else {
          alert("An error occurred while adding the customer.");
        }
        console.log(err, "err while adding customer");
      }
    }
  };

  const [openResetModal, setOpenResetModal] = useState(false);
  const handleResetModal = () => {
    setOpenResetModal(true);
  };
  const handleCloseModal = () => {
    setOpenResetModal(false);
  };

  const handleChange = (e) => {
    setSelectedOption(e);
    setOpenResetModal(false);
  };

  const [selectedOption, setSelectedOption] = useState({
    value: "0",
    text: "Select City",
  });
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

  return (
    <>
      <NabarCompo />
      <section className="register">
        <div className="page_heading">
          <div className="title">Register</div>
        </div>
        <div className="container">
          <div className="register_wrapper">
            <div className="login_header">
              <div className="title">Sign up to your account</div>
            </div>
            <div className="login_body">
              <div>
                <Form.Label>Please Choose Profile</Form.Label>
                <Form.Control
                  type="file"
                  placeholder="Name"
                  // value={name}
                  onChange={(e) => setcustomrProfile(e.target.files[0])}
                />
                {/* <p></p> */}
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={Email}
                  onChange={(e) => setemail(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phonenumber}
                  onChange={(e) => setphonenumber(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={Password}
                  onChange={(e) => setpassword(e.target.value)}
                />
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="Confirm Password"
                  value={ConfirmPassword}
                />

                <input
                  type="text"
                  onClick={handleResetModal}
                  className="select-city "
                  placeholder="City"
                  value={
                    selectedOption.city === null ||
                    selectedOption.city === undefined
                      ? "Select City"
                      : selectedOption.city
                  }
                />

                <button onClick={AddCustomers}>Sign Up</button>
              </div>
            </div>
          

            <Modal open={openOTP} onClose={handleOTPModal}>
              <div className="modal_wrapper">
                <div className="modal_header">
                  <div className="title">Verification</div>
                </div>
                <div className="modal_body">
                  <div className="title">
                    Enter 4 digit verification code sent to your number
                  </div>
                  <form>
                    <div className="otp_wrapper">
                      <input
                        type="password"
                        // {...register("opt")}
                        maxlength="1"
                        required
                        placeholder="0"
                      />
                      <input
                        type="password"
                        // {...register("opt")}
                        maxlength="1"
                        required
                        placeholder="0"
                      />
                      <input
                        type="password"
                        // {...register("opt")}
                        maxlength="1"
                        required
                        placeholder="0"
                      />
                      <input
                        type="password"
                        // {...register("opt")}
                        maxlength="1"
                        required
                        placeholder="0"
                      />
                    </div>
                    <div className="resend">
                      Resend code in <span>00:59</span>
                    </div>
                    <button type="submit" onClick={getStart}>
                      Verify
                    </button>
                  </form>
                </div>
              </div>
            </Modal>
            <Modal open={finished} onClose={finished}>
              <div className="modal_wrapper">
                <div className="modal_body">
                  <div className="hello">Hello !</div>
                  <div className="title">
                    Your account had beed created successfully. Please log in to
                    use your account and enjoy.
                  </div>
                  <button type="submit" onClick={getStart}>
                    Get Started
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
        <Modal open={openResetModal} onClose={handleCloseModal}>
          <div className="modal_wrapper select-city-modal">
            <div className="modal_header">
              <div className="col-12">
                <span>Let's choose</span>
                <p>Your Location</p>
              </div>
            </div>

            <div className="modal_body">
              <div className="title text-center">India</div>
              <div className="row cit-mange ">
                {City?.map((city) => {
                  return (
                    <div className="col-lg-2 col-md-3 col-sm-4 ">
                      <p
                        onClick={() => handleChange(city)}
                        className={`row p-0 ${
                          selectedOption ? "activecity" : ""
                        }`}
                      >
                        <span className="col-md-2">
                          {city.city ? <LocationOnIcon /> : null}
                        </span>
                        <span className="col-md-2"> {city.city}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
      </section>{" "}
    </>
  );
}
