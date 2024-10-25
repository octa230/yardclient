import { BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import Navigation from './components/Navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/esm/Navbar';
import Col from 'react-bootstrap/esm/Col';
import Alert from 'react-bootstrap/esm/Alert';
import Badge from 'react-bootstrap/esm/Badge';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import MapScreen from './screens/MapScreen';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import { FloatingWhatsApp } from 'react-floating-whatsapp'
import Offcanvas from 'react-bootstrap/esm/Offcanvas'
import Button from 'react-bootstrap/esm/Button';
import PrivacyPolicy from './screens/PrivacyPolicy';
import axios from 'axios';
import TrustBox from './components/TrustBox';
import Row from 'react-bootstrap/esm/Row';
import Stack from 'react-bootstrap/esm/Stack';
import ShopScreen from './screens/ShopScreen';
import ShopsSearch from './screens/ShopsSearch';
import LoadingBox from './components/LoadingBox';


function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo, signInDate } = state;
  const [sellerMenu, viewsellerMenu] = useState(false)
  const [location, setLocation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      setIsLoading(true)
      // Check if categories are already in local storage
      const storedCategories = localStorage.getItem('yardCategories');
      //setCategories(storedCategories)
      if (storedCategories) {
        const parseData = JSON.parse(storedCategories)
        setCategories(parseData)  
      }else{
        try{
          const {data}  = await axios.get('https://api.ugyard.com/api/category');
          setCategories(data)
          localStorage.setItem('yardCategories', JSON.stringify(data));
        } catch (error) {
          console.error('Error fetching categories:', error);
        } 
      }
      setIsLoading(false)
    };
  
    const getUserIpAddress = async () => {
      try {
        const response = await fetch(`https://api.geoapify.com/v1/ipinfo?apiKey=7c85d03e7b3b4639a8c7fc7a9cc38ea8`);
        const locationData = await response.json();
        setLocation(locationData);
      } catch (error) {
        console.error('Error fetching IP address:', error);
      }
    };
    getCategories();
    getUserIpAddress();
  }, [userInfo]);
  

    if (signInDate) {
      const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000; // Two days in milliseconds
      const currentTime = new Date().getTime();
      const lastSignInTimeMillis = parseInt(signInDate, 10);

    if (currentTime - lastSignInTimeMillis >= twoDaysInMillis) {
      // It's been more than two days, clear local storage and prompt user to sign in
      localStorage.removeItem('userInfo');
    }
    }

    
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  const dropDown=(value)=>{
    viewsellerMenu(value)
  }

  return isLoading ? (<LoadingBox/>) : (
  <BrowserRouter>
  <ToastContainer position="top-center" limit={1} />

  <div className='d-flex bg-dark p-md-2 py-xs-2 w-full justify-content-start'>
  <a className='p-1 text-light text-decoration-none' href="https://business.ugyard.com/" target="_blank" rel="noopener noreferrer">
    SELL ON UGYARD <i className='fas fa-arrow-right'/>
  </a>
</div>

  <Navbar variant="light" expand="lg" className='navigation'>
  <Link to='/'>
    <img src='/images/ugyard-logo.png' 
      width={130} height={200} alt='logo' className='logo' />
  </Link>

  <Link to='/cart'>
    <i className='fas fa-shopping-basket'/>
          {cart.cartItems.length > 0 && (
            <Badge pill bg='danger' className='ml-1'>
              {cart.cartItems.reduce((a, c)=> a + c.quantity, 0)}
            </Badge>
          )}
  </Link>

    {userInfo ? (
      <div className='px-3'>
      <i className="fas fa-bars" onClick={() => dropDown(!sellerMenu)}></i>
      {sellerMenu &&(
       <Offcanvas show={sellerMenu} placement='end' 
        onHide={()=> dropDown(!sellerMenu)} 
        className="right-nav-icons"
        style={{ width: '100%', maxWidth: '25rem', overflowY: 'auto' }}
       >
        <Offcanvas.Header>
        <Offcanvas.Title className='my-1' onClick={()=> dropDown(!sellerMenu)}>
          <Link to='/profile' className='profile-icon'>
          <span>
            <i className='fas fa-user-circle'> {userInfo.name[0].toUpperCase()}</i>
          </span>
          </Link>
          </Offcanvas.Title>
          <div>
            <Button variant='' onClick={()=>dropDown(!sellerMenu)}>
                <i className='fas fa-times-circle'></i>
            </Button>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body>              
          <Link to='/orderhistory' onClick={()=> dropDown(!sellerMenu)}>
            Orders
          </Link>

          <Button variant='dark' className='logout my-3' onClick={signoutHandler}>
            Logout 
          </Button>
        </Offcanvas.Body>
       </Offcanvas>
      )}
    </div>
    ): (
    <Link to={'/signin'} className='px-3'>
      <i className='fas fa-user-plus'></i>
    </Link>
    )}
  </Navbar>
      <Row className='align-items-center'>
      <Col xs={12} md={3}>
        <Alert className='m-1 p-3 text-black text-small' variant='success'>
        <span>
        <i className='fas fa-map-marker p-1 text-black'/>
      </span>
          {location?.country.name}: {location?.city.name}
        </Alert>
      </Col>
      <Col xs={12} md={9}>
      <SearchBox/>
      </Col>
      </Row>
        {categories.length > 0 && (<Navigation categories={categories}/>)}
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/shop/:slug" element={<ShopScreen />} />
              <Route path="/shops" element={<ShopsSearch />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path='/privacy-policy' element={<PrivacyPolicy/>}/>
              <Route
                path="/forget-password"
                element={<ForgetPasswordScreen />}
              />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordScreen />}
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen/>
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/shipping"
                element={<ShippingAddressScreen />}
              ></Route>
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          <FloatingWhatsApp phoneNumber='+256782144414' accountName='ugyard'/>  
            <footer>
              <Row fluid className='text-dark my-1, bg-white'>
              <Col md={4}>
              <h1 className='display-4 align-center'>Transforming Lives,<br/> One Experience at a Time!</h1>
              <Stack className=''>
{/*                     <Link to='/'>
                      <img src='/images/ugyard-logo.png' 
                        width={200} height={100} className='logo bg-light img-thumbnail' 
                        alt='logo' 
                        />
                    </Link> */}
                    <a href='https://play.google.com/store/apps/details?id=com.mervynstunner.ugyard&pcampaignid=web_share'
                      target="_blank" rel="noopener noreferrer"
                    >
                      <img src='/images/google-play.png' 
                        className='w-25 flex-end'
                        alt='logo' 
                        />
                    </a>
                    <a href='/' target="_blank" rel="noopener noreferrer">
                      <img src='/images/apple-store.png' 
                        className='w-25'
                        alt='logo' 
                        />
                    </a>
                    <TrustBox/>
                    <h4 className='d-none d-sm-block'>BUY & SELL ONLINE UGANDA TO U.A.E</h4>
                  </Stack>
              </Col>
                  <Col md={8}>
                    <h5 className='text-dark display-2'>Buy, Sell, & Transport On Ugyard!</h5>
                    <p className='text-weight-light'>Whether you're an individual or a business owner in Uganda or the UAE, UGYARD is here to simplify your life. In just a few clicks, our platform connects you to a world of opportunities.
                        We support nearly 20 business categories across various industries, UGYARD offers tailored features designed for sellers, transporters, and buyers alike.
                        What we are trying to do as a business:
                    </p>
                <ul>
                  <li>Effortless Online Presence: Get your brand and products showcased on Google with just a few clicks.</li>
                  <li>Diverse Categories: To cater for a wide range of businesses, from fashion and electronics to home goods, automobile parts and restaurants.</li>
                  <li>Seller-Friendly Features: Streamline your selling process with our user-friendly business tools and support.</li>
                  <li>Reliable Transportation: Ensure your goods reach their destination safely and efficiently with our trusted and verified transporters.</li>
                  <li>Buyer Convenience: Discover a vast selection of products and services at competitive prices on your fingertips.</li>
                </ul>
                  Experience the future of commerce & marketplaces — join UGYARD today to reach millions of online shoppers in Uganda and UAE!
                  </Col>
              </Row>
            </footer>
  </BrowserRouter>
  );
}

export default App;
