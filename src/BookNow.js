import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
export default function BookNow({ openPOP, handleClosePop, handleShowPop }) {
  const ReactApi = process.env.REACT_APP_API_URL;
  const [selectedService, setSelectedService] = useState(null);
  const [category, setCategory] = useState([]);
  useEffect(() => {
    getAllCategory();
    const handleScroll = () => {
      const shouldShowModal = window.scrollY > 2000;

      if (shouldShowModal) {
        handleShowPop();
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleServiceSelection = (service) => {
    setSelectedService(service);
  };

  const sendWhatsAppMessage = (recipient, service) => {
    const apiEndpoint = "https://api.whatsapp.com/send";
    const message = `Selected Service: ${service}`;
    const whatsappLink = `${apiEndpoint}?phone=${recipient}&text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappLink, "_blank");
  };
  const handleSubmit = () => {
    sendWhatsAppMessage("9980670037", selectedService);
  };

  const getAllCategory = async () => {
    try {
      let res = await axios.get(`${ReactApi}/getcategory`);
      if (res.status === 200) {
        const firstInFirstOut = res?.data?.category?.reverse();
        setCategory(firstInFirstOut);
      }
    } catch (er) {
      // console.log(er, "err while fetching data");
    }
  };

  return (
    <div>
      <Modal show={openPOP} onHide={handleClosePop}>
        <Modal.Header closeButton>
          <Modal.Title>What service are you looking for?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please select the service you are interested in</p>
          {category?.reverse()?.map((ele) => (
            <Form.Control
              readOnly
              className={`m-2 ${
                selectedService === ele.category ? "selected" : "not-selected"
              }`}
              onClick={() => handleServiceSelection(ele.category)}
              value={ele.category}
            />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="col-md-2"
            variant="secondary"
            onClick={handleClosePop}
          >
            Close
          </Button>
          {selectedService && (
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
