import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';
import {toast} from 'react-toastify'


function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {cart, cart: { cartItems }} = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`https://api.ugyard.com/api/products/${item._id}`);
    if (data.inStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
    toast.success(
      <Link to='/cart'>{cart.cartItems.reduce((a, c)=> a + c.quantity, 1)}: View Cart</Link>
    )
  };

  return (
    <Card className='product' key={product.sku}>
      <i className='fas fa-share align-self-end p-2'
            onClick={(e)=> {
              e.stopPropagation(); 
              navigator.clipboard.writeText(`https://ugyard.com/product/${product.slug}`);
              toast.success('Copied')
            }}
          />  
      <Link to={`/product/${product.slug}`}>
        <Card.Img src={product.image} 
        className="card-img-top" 
        alt={product.name}
        />
      </Link>
      <Card.Body className='d-grid card-info'>
        <Link to={`/product/${product.slug}`} className='productName'>
          <Card.Title>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text className='d-flex flex-column'>
        <small><sup>UGX:</sup>
          <strong>{product.ugx.toLocaleString() || 0}</strong>
        </small>
        <small><sup>AED:</sup>
          <strong>{product.aed.toLocaleString() || 0}</strong>
        </small>
        <small className='text-muted'>{product.shopName || 'Unlisted'}: seller</small>
        <small className='text-muted'>{product.inStock || 0}: Pieces Available for delivery</small>
        <small className='text-muted'>{Math.ceil(Math.random()* 10)}%: Discount on Delivery</small>
        </Card.Text>
        {product.inStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to Basket</Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product;
