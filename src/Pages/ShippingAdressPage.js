import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import CheckoutSteps from "../Components/CheckoutSteps";

export default function ShippingAddressPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [adress, setAdress] = useState(shippingAddress.adress || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Submitting shipping address");
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        adress,
        city,
        postalCode,
        country,
      },
    });
    console.log("Shipping address saved to context");

    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        adress,
        city,
        postalCode,
        country,
      })
    );
    console.log("Shipping address saved to localStorage");

    navigate("/payment");
    console.log("Navigating to /payment");
  };

  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>

      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className='row justify-content-center'>
        <div className='col-md-8'>
          <h1 className='text-center my-3'>Shipping Address</h1>
          <Form
            style={{ backgroundColor: "#212529", height: "100%" }}
            className='p-4 rounded shadow-sm'
            onSubmit={submitHandler}
          >
            <Form.Group className='mb-3' controlId='fullName'>
              <Form.Label className='text-white'>Full Name</Form.Label>
              <Form.Control
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className='bg-white'
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='address'>
              <Form.Label className='text-white'>Address</Form.Label>
              <Form.Control
                value={adress}
                onChange={(e) => setAdress(e.target.value)}
                required
                className='bg-white'
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='city'>
              <Form.Label className='text-white'>City</Form.Label>
              <Form.Control
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className='bg-white'
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='postalCode'>
              <Form.Label className='text-white'>Postal Code</Form.Label>
              <Form.Control
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                className='bg-white'
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='country'>
              <Form.Label className='text-white'>Country</Form.Label>
              <Form.Control
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className='bg-white'
              />
            </Form.Group>

            <div className='d-grid gap-2'>
              <Button variant='primary' type='submit'>
                Continue
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
