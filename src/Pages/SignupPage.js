import Axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../Util";

export default function SignupPage() {
  const navigate = useNavigate();
  //we'll use navigate to navigate after redirect
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  //search in useLocation is used to retrieve information about current URL: returns an object container current url info
  //redirectInUrl fuction returns the search object and assigns the information to a redirect variable
  //redirect variable is assigned to data from the search ,if no data,url is assigned to home

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    } else if (password.length < 6) {
      toast.error("Passwords too short,must be 6 or more characters");
      return;
    }
    try {
      const { data } = await Axios.post("/api/users/signup", {
        name,
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
        <title>Sign Up</title>
      </Helmet>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-8'>
            <h1 className='text-center my-3'>Sign Up</h1>
            <Form
              style={{ backgroundColor: "#212529", height: "100%" }}
              className=' p-4 rounded shadow-sm'
              onSubmit={submitHandler}
            >
              <Form.Group className='mb-3' controlId='name'>
                <Form.Label className='text-white'>Name</Form.Label>
                <Form.Control
                  onChange={(e) => setName(e.target.value)}
                  required
                  className='bg-white'
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='email'>
                <Form.Label className='text-white'>Email</Form.Label>
                <Form.Control
                  type='email'
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className='bg-white'
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='password'>
                <Form.Label className='text-white'>Password</Form.Label>
                <Form.Control
                  type='password'
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className='bg-white'
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='confirmPassword'>
                <Form.Label className='text-white'>Confirm Password</Form.Label>
                <Form.Control
                  type='password'
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className='bg-white'
                />
              </Form.Group>

              <div className='d-grid gap-2'>
                <Button type='submit'>Sign Up</Button>
              </div>

              <div className='text-center mt-3 text-white'>
                Already have an account?{" "}
                <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Container>
  );
}
