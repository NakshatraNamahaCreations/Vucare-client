import React from "react";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function Footer() {
  return (
    <>
      <div className="row mt-5 bg-dark text-white m-auto ">
        <div className="container p-4  m-auto">
          <div className="row m-auto ">
            <div className="col-md-6 m-auto">
              <div className="col-md-4 bg-white rounded brd">
                <a href="/">
                  <img
                    className="brd"
                    alt=""
                    src="..\images\vucarpng (2).png"
                    height={36}
                  />
                </a>
              </div>
              <p className="col-md-6 p-2 mt-2">
                Transforming homes with spotless brilliance - Vu Care, where
                cleanlines meets care.
              </p>
            </div>
            <div className="col-md-3 ">
              <h3 className="row ">Contact Us:</h3>
              <div className="row">
                <span className="col-md-1 mt-3 me-2">
                  <AddIcCallIcon style={{ color: "white" }} />{" "}
                </span>
                <div className="col-md-9 ">
                  <span>+91 7760120037</span>
                  <p>+91 7337744156</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 ">
              <span>info@thevucare.com</span>
              <div className="row">
                <span className="col-md-1 me-2">
                  <LocationOnIcon style={{ color: "white" }} />{" "}
                </span>
                <div className="col-md-9 ">
                  {/* <span>+91 9980670037</span> */}
                  <p>+91 9741317160</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
