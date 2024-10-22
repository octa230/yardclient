import { useContext, useEffect, useReducer } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/esm/Card';
import Container from 'react-bootstrap/esm/Container';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../utils';
import Trip from '../components/Trip';


const reducer =(state, action)=>{
  switch(action.type){
    case 'FETCH_TRIPS':
      return {...state, loading: true};
    case 'FETCH_SUCCESS':
      return {...state, trips: action.payload}
    case 'FETCH_FAIL':
      return {...state, loading: false, error: action.payload}
    default:
      return state
  }
}

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart: { cartItems, userTrip}} = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.iStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  
  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  const [{trips}, dispatch] = 
    useReducer(reducer, {
    loading: true,
    error: '',
    trips: []
  })

  useEffect(()=> {
    const fetchData = async()=> {
      try{
        dispatch({type: 'FETCH_TRIPS'})
        const {data} =  await axios.get('/api/trips') 
        console.log(data)
        dispatch({type: 'FETCH_SUCCESS', payload: data})
      }catch(error){
        dispatch({type: 'FETCH_FAIL', payload: getError(error)})
      }
    }
    fetchData()
  },[])
  
  return (
    <Container fluid className='mb-2'>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row className='mb-2'>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup className='mb-2'>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image || item.photo}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3} xs={8}>
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        variant="light"
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.inStock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3} xs={8}>UGX:{item.ugx.toLocaleString() || item.price.toLocaleString()}</Col>
                    <Col md={2}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant="light"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

<Col md={4}>
  <Card>
    <Card.Body>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <h3>
            Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0).toLocaleString()}{' '}
            items) : UGX: 
            {cartItems.reduce((a, c) => a + (c.ugx || c.price * c.quantity), 0).toLocaleString()}
          </h3>
        </ListGroup.Item>
        <ListGroup.Item>
  <h3>
    Trip: ({userTrip ? (userTrip.bookedWeight || 0).toLocaleString() : 0}KGs) : UGX: {userTrip ? (userTrip.bookedWeight * userTrip.weightPrice || 0).toLocaleString() : 0}
  </h3>
</ListGroup.Item>
        <ListGroup.Item>
          <div className="d-grid">
            <Button
              type="button"
              variant="primary"
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>
        </ListGroup.Item>
      </ListGroup>
    </Card.Body>
  </Card>
</Col>

    </Row>
        <Row className='my-3'>
        <h3>Available Trips/ Transporters</h3>
          {trips?.map((trip)=> (
          <Col className='my-2 px-1 d-flex justify-content-center' xs={12} md={3} key={trip._id}>
            <Trip trip={trip.trip}/>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
