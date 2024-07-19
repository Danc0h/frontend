import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import Axios from "axios";
import { useState, useContext, useEffect } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../Util";

export default function SigninPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post("api/users/signin", {
        email,
        password,
      });

      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className='small-container'>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <div className='container' style={{ height: "100%" }}>
        <div className='row justify-content-center'>
          <div className='col-md-8'>
            <h1 className='text-center my-3 custom-font font-weight-bold'>
              Sign In
            </h1>
            <Form
              className='bg-dark p-3 rounded shadow-sm'
              onSubmit={submitHandler}
              style={{ backgroundColor: "#ffcc00", height: "100%" }}
            >
              <Form.Group className='mb-3' controlId='email'>
                <Form.Label className='text-white'>Email</Form.Label>
                <Form.Control
                  type='email'
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className='bg-white form-control' // Add bg-white and form-control classes
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='password'>
                <Form.Label className='text-white'>Password</Form.Label>
                <Form.Control
                  type='password'
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className='bg-white form-control' // Add bg-white and form-control classes
                />
              </Form.Group>

              <div className='d-grid gap-2'>
                <Button type='submit'>Sign In</Button>
              </div>

              <div className='text-center mt-3 text-white'>
                New customer?{" "}
                <Link to={`/signup?redirect=${redirect}`}>
                  Create your account
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Container>
  );
}
