import "./App.css";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./Pages/HomePage";
import CartPage from "./Pages/CartPage";
import ProductPage from "./Pages/ProductPage";
import SigninPage from "./Pages/SigninPage";
import SignupPage from "./Pages/SignupPage";
import SearchPage from "./Pages/SearchPage";
import PaymentMethodPage from "./Pages/PaymentMethodPage";
import { NavDropdown, Navbar } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { Badge } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import { Store } from "./Store";
import { Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import ShippingAdressPage from "./Pages/ShippingAdressPage";
import PlaceOrderPage from "./Pages/PlaceOrderPage";
import OrderPage from "./Pages/OrderPage";
import OrderHistoryPage from "./Pages/orderHistoryPage";
import OrderListPage from "./Pages/OrderListPage";
import DashboardPage from "./Pages/DashboardPage";
import ProfilePage from "./Pages/ProfilePage";
import Button from "react-bootstrap/Button";
import { getError } from "./Util";
import axios from "axios";
import SearchBox from "./Components/Searchbox";
import ShoppingCartIcon from "./Components/shoppingCart";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminRoute from "./Components/AdminRoute";
import ProductListPage from "./Pages/ProductListPage";
import ProductEditPage from "./Pages/ProductEditPage";
import UserEditPage from "./Pages/userEditPage";
import UserListPage from "./Pages/userListPage";
import {
  FaShoePrints,
  FaTv,
  FaTshirt,
  FaPhone,
  FaLaptop,
  FaSpeakerDeck,
  FaUtensilSpoon,
  FaHeadphones,
} from "react-icons/fa";
import { BiFridge } from "react-icons/bi";

function App() {
  const categoryIcons = {
    Shoes: <FaShoePrints />,
    TVs: <FaTv />,
    Clothes: <FaTshirt />,
    Phones: <FaPhone />,
    Headphones: <FaHeadphones />,
    Laptops: <FaLaptop />,
    Woofers: <FaSpeakerDeck />,
    Fridges: <BiFridge />,
    Kitchenware: <FaUtensilSpoon />,

    // Add more categories and their corresponding icons here
  };
  const { state, dispatch: ctxDispatch } = useContext(Store);
  //state represents object data provided by Store,useContext allows us to consume the data from store
  //dispatch rep dispatch function provided by context,dispatch function(cxtDispatch) is used to send actions to update state
  const { cart, userInfo } = state;
  //data variables destructured fom the state
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAdress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };
  //This is a function that uses ctxDispatch function from dispacth to send action "USER_SIGNOUT" to update state(i.e remove user info)
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  //The local state above means sidebar is not open by default
  const [categories, setCategories] = useState([]);
  //categories is assigned to an empty array by default
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/categories`
        );
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  //The above function updates local state categories from an empty array to data fetched from backend in the productRouter routes
  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? "d-flex flex-column site-container active-cont"
            : "d-flex flex-column site-container"
        }
      >
        <ToastContainer position='bottom-center' limit={1} />
        <header>
          <Navbar bg='dark' variant='dark' expand='lg' defaultExpanded>
            <Container>
              <Button
                variant='dark'
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className='fa fa-bars'></i>
              </Button>

              <LinkContainer to='/'>
                <Navbar.Brand className='golden'>RealTimeRich</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls='basic-navbar-nav' />
              <Navbar.Collapse id='basic-navbar-nav'>
                <SearchBox />
                <Nav className='me-auto  w-100  justify-content-end'>
                  <Link to='/cart' className='nav-link'>
                    <ShoppingCartIcon />
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg='danger'>
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}{" "}
                  </Link>
                  {userInfo ? (
                    <>
                      <LinkContainer to='/orderhistory'>
                        <Nav.Link className='text-white'>My orders</Nav.Link>
                      </LinkContainer>
                      <NavDropdown
                        title={<h5 className='text-white'>{userInfo.name}</h5>}
                        id='basic-nav-dropdown'
                        className='dropdown-dark'
                      >
                        <LinkContainer to='/profile'>
                          <NavDropdown.Item className='dropdown-item-white'>
                            User Profile
                          </NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Divider />
                        <Link
                          className='dropdown-item dropdown-item-white'
                          to='#signout'
                          onClick={signoutHandler}
                        >
                          Sign Out
                        </Link>
                      </NavDropdown>
                    </>
                  ) : (
                    <>
                      <Link className='nav-link text-dark' to='/signin'>
                        <Button type='button' variant='primary'>
                          Sign In
                        </Button>
                      </Link>
                    </>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown
                      title={<h5 className='text-white'>Admin</h5>}
                      id='admin-nav-dropdown'
                      className='dropdown-dark'
                    >
                      <LinkContainer to='/admin/dashboard'>
                        <NavDropdown.Item className='dropdown-item-dark'>
                          Dashboard
                        </NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <LinkContainer to='/admin/products'>
                        <NavDropdown.Item className='dropdown-item-white'>
                          Products
                        </NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <LinkContainer to='/admin/orders'>
                        <NavDropdown.Item className='dropdown-item-white'>
                          Orders
                        </NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <LinkContainer to='/admin/users'>
                        <NavDropdown.Item className='dropdown-item-white'>
                          Users
                        </NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column"
              : "side-navbar d-flex justify-content-between flex-wrap flex-column"
          }
        >
          <Nav
            className='flex-column text-dark w-100 p-3'
            style={{ backgroundColor: "cyan", height: "100vh" }}
          >
            <Nav.Item>
              <h1>Categories</h1>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category} className='my-2'>
                <LinkContainer
                  to={{ pathname: "/search", search: `?category=${category}` }}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link className='category-link'>
                    {categoryIcons[category]}
                    <span className='ms-2'>{category}</span>
                  </Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className='mt-3'>
            <Routes>
              <Route path='/product/:slug' element={<ProductPage />} />
              <Route path='/cart' element={<CartPage />} />
              <Route path='/search' element={<SearchPage />} />
              <Route path='/signin' element={<SigninPage />} />
              <Route path='/signup' element={<SignupPage />} />
              <Route
                path='/profile'
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path='/placeorder' element={<PlaceOrderPage />} />
              <Route
                path='/order/:id'
                element={
                  <ProtectedRoute>
                    <OrderPage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path='/orderhistory'
                element={
                  <ProtectedRoute>
                    <OrderHistoryPage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route path='/shipping' element={<ShippingAdressPage />}></Route>
              <Route path='/payment' element={<PaymentMethodPage />}></Route>
              {/* Admin Routes */}
              <Route
                path='/admin/dashboard'
                element={
                  <AdminRoute>
                    <DashboardPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path='/admin/orders'
                element={
                  <AdminRoute>
                    <OrderListPage />
                  </AdminRoute>
                }
              ></Route>

              <Route
                path='/admin/products'
                element={
                  <AdminRoute>
                    <ProductListPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path='/admin/product/:id'
                element={
                  <AdminRoute>
                    <ProductEditPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path='/admin/users'
                element={
                  <AdminRoute>
                    <UserListPage />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path='/admin/user/:id'
                element={
                  <AdminRoute>
                    <UserEditPage />
                  </AdminRoute>
                }
              ></Route>
              <Route path='/' element={<HomePage />} />
            </Routes>
          </Container>
        </main>

        <footer>
          <div className='text-center'>Copyright</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
