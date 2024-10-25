import Axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {Link, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import Form from 'react-bootstrap/esm/Form'
import LoadingBox from '../components/LoadingBox';



const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo} = state;
  
  const [loyaltyCode, setLoyaltyCode] = useState('')
  const [orderNotes, setorderNotes] = useState('')
  const [deliveryMessage, setdeliveryMessage] = useState('')
  const [surprise, setSurprise] = useState(false)
  const [discountedTotalPrice, setDiscountedTotalPrice] = useState(cart.totalPrice);


  

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.ugx || c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100000 ? round2(cart.itemsPrice * 0.02) : round2(cart.itemsPrice * 0.05);
  cart.taxPrice = round2(0.03 * cart.itemsPrice);
  cart.tripBill = cart.userTrip ? round2(cart.userTrip.bookedWeight * cart.userTrip.weightPrice ) : 0
  console.log(cart.userTrip)
  
  //const loyaltytotalPrice = cart.loyaltyDiscountTotal
  const fullTotal = ()=>{
    if(!discountedTotalPrice){
      const UrgencyFee = cart.timeslot.fee ? cart.timeslot.fee : 0
     return cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice + UrgencyFee + cart.tripBill
    }else{
     return cart.totalPrice = discountedTotalPrice
    }
  }



  ////APPLY CODE FUNCTION
  const handleDiscount=()=> {
    const loyaltyCodeString = loyaltyCode.toString()
    //percentage = parseInt(loyatyCode.slice(-2), 10 || 0)
    setLoyaltyCode(loyaltyCodeString)
    //console.log(loyaltyCode)
    if(loyaltyCode.length !== 5){
      const percentageCharaters = loyaltyCodeString.slice(-2)
      const loyaltyDiscountPercentage = parseInt(percentageCharaters, 10);

      if(!isNaN(loyaltyDiscountPercentage)){
        console.log(loyaltyDiscountPercentage)

        const loyaltyDiscount = (loyaltyDiscountPercentage / 100) * cart.totalPrice
        const loyaltytotalPercentage = round2(loyaltyDiscount)
        console.log(loyaltyDiscount)
        const newTotal = cart.totalPrice - loyaltytotalPercentage
        setDiscountedTotalPrice(newTotal.toFixed(2));
        console.log(cart.totalPrice.toFixed(2))
        //console.log()
      }else{
        console.log(loyaltyDiscountPercentage)
      }
    }else{
      toast.error('Code must be 6 characters')
    }
  }
  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await Axios.post(
        'https://api.ugyard.com/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: fullTotal(),
          timeslot: cart.timeslot,
          deliveryDate: cart.deliveryDate,
          orderNotes: orderNotes,
          deliveryMessage: deliveryMessage,
          surprise: surprise,
          code: loyaltyCode,
          trip: cart.userTrip
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Address: </strong> {cart.shippingAddress.address},
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>
          <Card className='mb-3'>
            <Card.Body>
            <Card.Title>Order Details</Card.Title>
            <Card.Text>
            <strong>Time:-</strong> {cart.timeslot.name || 'unspecified'}<br/>
            <strong>Hours:-</strong> {cart.timeslot.time || 'unspecified'}<br/>
            <strong>Urgency Fee:-</strong> UGX: {cart.timeslot.fee || 0}
            </Card.Text>
            <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image || item.photo}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>UGX:{item.ugx.toLocaleString() || item.price.toLocaleString()}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
          <Card className='mb-3'>
  <Card.Body>
    <Card.Title>Trip Details</Card.Title>
    {cart.userTrip ? (
      <Card.Text>
        <strong>Arrival Date: </strong> {cart.userTrip.arrivalDate ? new Date(cart.userTrip.arrivalDate).toLocaleDateString() : 'unspecified'}<br/>
        <strong>Departure Date: </strong> {cart.userTrip.departureDate ? new Date(cart.userTrip.departureDate).toLocaleDateString() : 'unspecified'}<br/>
        <strong>Booked Weight: </strong> {cart.userTrip.bookedWeight || 0}<br/>
        <strong>Amount: </strong> {round2(cart.userTrip.bookedWeight * cart.userTrip.weightPrice).toLocaleString() || 0}: UGX<br/>
        <strong>Trip Verification: </strong> {cart.userTrip.approved ? 'VERIFIED' : 'NOT VERIFIED' }
      </Card.Text>
    ) : (
      <Card.Text>No trip details available</Card.Text>
    )}
    <Link to="/cart">Edit</Link>
  </Card.Body>
</Card>
        </Col>
        <Col md={4}>
          <Card className='mb-2'>
            <Card.Body>
              <Card.Title>ORDER NOTES</Card.Title>
              <Form.Group className='mb-3'>
                <Form.Label>Order Notes</Form.Label>
                <Form.Control type='text'
                  value={orderNotes}
                  onChange={((e)=> setorderNotes(e.target.value))}
                  placeholder='put short instructions you want us to follow in this araea'
                />
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>Delivery Message</Form.Label>
                <Form.Control as='textarea' rows={3}
                  value={deliveryMessage}
                  onChange={(e)=> {setdeliveryMessage(e.target.value); console.log(deliveryMessage)}}
                placeholder='Add a sweet message you want to send the reciever or something of that kind in this area'
                />
              </Form.Group>
              <Form.Group className='mb-2'>
                <Form.Label>Surprise</Form.Label>
                <Form.Check type='checkbox'
                  id='surprise'
                  checked={surprise}
                  onChange={(e)=> {
                  setSurprise(e.target.checked)

                  //console.log(e.target.checked)
                }}
                label='I dont want to disclose information to the recipeint'
                />
              </Form.Group>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>UGX: {cart.itemsPrice.toLocaleString()}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Trip Bill</Col>
                    <Col>UGX: {cart.tripBill.toLocaleString() || 0}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>UGX: {cart.shippingPrice.toLocaleString()}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Urgency Fee</Col>
                    <Col>UGX: {cart.timeslot.fee ? cart.timeslot.fee.toLocaleString() : 0 }</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>UGX: {cart.taxPrice.toLocaleString()}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                    <strong>UGX: {fullTotal().toLocaleString()}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Loyalty Code
                    <span>
                      <Form.Control type='text'
                        value={loyaltyCode || ''}
                       onChange={(e)=>setLoyaltyCode(e.target.value)}
                      />
                      <Button className='btn-sm mt-2 btn-success' onClick={handleDiscount}>APPLY CODE</Button>
                      </span>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
