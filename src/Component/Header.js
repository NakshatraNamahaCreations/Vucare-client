import React, { useEffect, useState } from "react";

import axios from "axios";
import img from "./img/Flag-India.webp";
import NabarCompo from "./navbar";
import { useNavigate } from "react-router-dom";
import "./header.css";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
// import { ReactApi } from "../api";
// import { ImagApi } from "../api";

export default function Header() {
  const [city, setCity] = useState([]);
  const [SearchSubCategory, setSearchSubCategory] = useState("");
  const [SearchSubCategoryd, setSearchSubCategoryD] = useState([]);
  const [isDropdownEnabled, setIsDropdownEnabled] = useState(true);
  const [isSearhcEnabled, setIsSearhcEnabled] = useState(false);
  const [CategoryData, setCategoryData] = useState([]);
  const ReactApi = process.env.REACT_APP_API_URL;
  const ImagApi = process.env.REACT_APP_IMAGE_API_URL;

  useEffect(() => {
    getCity();
    getsubcategory();
  }, []);
  const getsubcategory = async () => {
    try {
      let res = await axios.get(`${ReactApi}/userapp/getappsubcat`);

      if ((res.status = 200)) {
        setCategoryData(res.data.subcategory);
      }
    } catch (err) {
      // console.log(err, "err while fetching data");
    }
  };
  const getCity = async () => {
    try {
      let res = await axios.get(`${ReactApi}/master/getcity`);
      if (res.status === 200) {
        setCity(res.data.mastercity);
      }
    } catch (er) {
      // console.log(er, "err while fetching data");
    }
  };

  const [selectedOption, setSelectedOption] = useState({
    value: "0",
    text: "Select City",
    icon: (
      <svg id="flag-icons-in" viewBox="0 0 640 480">
        <path fill="#f93" d="M0 0h640v160H0z" />
        <path fill="#fff" d="M0 160h640v160H0z" />
        <path fill="#128807" d="M0 320h640v160H0z" />
        <g transform="matrix(3.2 0 0 3.2 320 240)">
          <circle r="20" fill="#008" />
          <circle r="17.5" fill="#fff" />
          <circle r="3.5" fill="#008" />
          <g id="d">
            <g id="c">
              <g id="b">
                <g id="a" fill="#008">
                  <circle r=".9" transform="rotate(7.5 -8.8 133.5)" />
                  <path d="M0 17.5.6 7 0 2l-.6 5L0 17.5z" />
                </g>
                <use width="100%" height="100%" transform="rotate(15)" />
              </g>
              <use width="100%" height="100%" transform="rotate(30)" />
            </g>
            <use width="100%" height="100%" transform="rotate(60)" />
          </g>
          <use width="100%" height="100%" transform="rotate(120)" />
          <use width="100%" height="100%" transform="rotate(-120)" />
        </g>
      </svg>
    ),
  });

  const handleResetModal = () => {
    setIsSearhcEnabled(!isSearhcEnabled);
  };
  const handleChange = (e) => {
    setSelectedOption(e);
    setIsSearhcEnabled(false);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchSubCategory(searchTerm);
    setIsDropdownEnabled(searchTerm.length === 0);

    const filterData = CategoryData?.filter((ele) => {
      const data = ele.subcategory?.toLowerCase();

      return data.includes(searchTerm);
    });

    const subcategories = filterData?.map((ele) => ele.subcategory);
    setSearchSubCategoryD(subcategories);
  };

  const handleSubcategorySelect = (ele) => {
    setSearchSubCategory(ele);

    setIsDropdownEnabled(true);
    if (SearchSubCategory === "" || selectedOption?.city?.length === 0) {
      alert("Please Select city or service");
    } else {
      navigate("/servicedetails", {
        state: {
          subcategory: ele,
          SelecteddCity: selectedOption.city,
        },
      });
    }
  };

  const CustomInputBase = styled(InputBase)(({ theme }) => ({
    backgroundColor: "#F5F6F8",
    border: "1px solid #E2E6EA",
    borderRadius: "8px",
    padding: "8px 12px",
    width: "100%",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:hover": {
      borderColor: "#B0B6BE",
    },
    "&.Mui-focused": {
      borderColor: "#006BFF",
      boxShadow: `${alpha("#006BFF", 0.25)} 0 0 0 0.2rem`,
    },
    "& .MuiInputBase-input": {
      padding: "8px 12px",
    },
  }));

  const navigate = useNavigate();
  const handleLinkClick = () => {
    if (SearchSubCategory === "" || selectedOption?.city?.length === 0) {
      alert("Please Select city or service");
    } else {
      navigate("/servicedetails", {
        state: {
          subcategory: SearchSubCategory,
          SelecteddCity: selectedOption.city,
        },
      });
    }
  };

  return (
    <>
      <NabarCompo />
      <div className="row m-auto  bgimg">
        <div className="container mt-5 ">
          <div className="row justify-content-end">
            <div className="col-md-7  mt-5">
              <div className="row m-auto">
                <h4 className="fnt  fw-bolder mobilescreen-heading">
                  Complete Home Excellence Pest Control & Cleaning & Painting
                  and Garden Maintenance.
                </h4>
              </div>
            </div>
          </div>
          <div className="row text-center  mt-3">
            <div className="col-md-5"></div>
            <div className="col-md-2 m-auto ">
              <a
                href={`tel:${917760120037}`}
                className="row text-decoration-none"
              >
                <button className="row imgbr boldt1 butn p-2 m-auto   yellw clr2 grndclr  ">
                  Contact Us
                </button>
              </a>
            </div>
          </div>
          <div className="row   justify-content-end">
            <div className="col-md-7 mt-5 ">
              <div className="row inputbox">
                <div className="col-md-6" style={{ position: "relative" }}>
                  <CustomInputBase
                    className="shadow-sm me-1   bg-white"
                    readOnly
                    value={
                      selectedOption.city === null ||
                      selectedOption.city === undefined
                        ? "Choose the nearest area"
                        : selectedOption.city
                    }
                    startAdornment={
                      <img
                        src={img}
                        width={30}
                        height={30}
                        className=" imgbr custom-dropdown-toggle"
                        alt="Flag"
                      />
                    }
                    endAdornment={
                      <svg
                        onClick={handleResetModal}
                        height="40"
                        width="40"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        focusable="false"
                        class="css-tj5bde-Svg"
                      >
                        <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                      </svg>
                    }
                  />
                  {isSearhcEnabled && (
                    <div className="drop_dow col-md-11  shadow-sm p-1 mb-5 bg-white ">
                      {city?.map((city) => {
                        return (
                          <div
                            className="city-name"
                            onClick={() => handleChange(city)}
                          >
                            <p className="selectcity ">{city.city}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="col-md-6 responvm relativeP">
                  <input
                    placeholder="Search for services"
                    value={SearchSubCategory}
                    onChange={(event) => handleSearch(event)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleLinkClick();
                      }
                    }}
                    type="search"
                  />
                  {!isDropdownEnabled && (
                    <div
                      className={` ${
                        !SearchSubCategoryd
                          ? ""
                          : "drop_dow col-md-11 m-auto shadow-sm p-2 mb-5 bg-white "
                      }`}
                    >
                      {SearchSubCategoryd?.map((ele) => (
                        <p
                          key={ele}
                          onClick={() => handleSubcategorySelect(ele)}
                          style={{ cursor: "pointer" }}
                        >
                          {ele}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
