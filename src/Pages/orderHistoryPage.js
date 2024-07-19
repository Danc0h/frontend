import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";
import { Store } from "../Store";
import { getError } from "../Util";
import { Button } from "react-bootstrap";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, orders: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryPage() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/api/orders/mine`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const isPaid = (order) => {
    return order.isPaid ? "text-success" : "text-danger";
  };

  const isDelivered = (order) => {
    return order.isDelivered ? "text-success" : "text-danger";
  };

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <h1>Order History</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <div className='table-responsive'>
          <table className='table table-bordered table-dark'>
            <thead>
              <tr>
                <th style={{ border: "1px solid #000", color: "#fff" }}>
                  Order ID
                </th>
                <th style={{ border: "1px solid #000", color: "#fff" }}>
                  Details
                </th>
                <th style={{ border: "1px solid #000", color: "#fff" }}>
                  Paid
                </th>
                <th style={{ border: "1px solid #000", color: "#fff" }}>
                  Delivered
                </th>
                <th style={{ border: "1px solid #000", color: "#fff" }}>
                  DATE
                </th>
                <th style={{ border: "1px solid #000", color: "#fff" }}>
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={{ border: "1px solid #000", color: "#fff" }}>
                    {order._id}
                  </td>
                  <td style={{ border: "1px solid #000", color: "#fff" }}>
                    <Button
                      type='button'
                      variant='success'
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                    >
                      View details
                    </Button>
                  </td>
                  <td
                    className={isPaid(order)}
                    style={{ border: "1px solid #000", color: "#fff" }}
                  >
                    {order.isPaid ? "Paid" : "Unpaid"}
                  </td>
                  <td
                    className={isDelivered(order)}
                    style={{ border: "1px solid #000", color: "#fff" }}
                  >
                    {order.isDelivered ? "Delivered" : "Undelivered"}
                  </td>
                  <td style={{ border: "1px solid #000", color: "#fff" }}>
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td style={{ border: "1px solid #000", color: "#fff" }}>
                    {order.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
